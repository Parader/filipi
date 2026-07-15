import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type PushPlatform = "ios" | "android" | "unknown";

export type PushRegistrationFailureReason =
  | "simulator"
  | "permission_denied"
  | "missing_project_id"
  | "unavailable";

export type PushRegistrationResult =
  | { ok: true; token: string; platform: PushPlatform }
  | { ok: false; reason: PushRegistrationFailureReason };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function getExpoProjectId(): string | null {
  const extraProjectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (typeof extraProjectId === "string" && extraProjectId.length > 0) {
    return extraProjectId;
  }

  const easProjectId = Constants.easConfig?.projectId;
  if (typeof easProjectId === "string" && easProjectId.length > 0) {
    return easProjectId;
  }

  return null;
}

export function getPushStatusMessage(reason: PushRegistrationFailureReason): string {
  switch (reason) {
    case "simulator":
      return "Push notifications require a physical device (not an emulator).";
    case "permission_denied":
      return "Notification permission was denied. Enable it in system settings.";
    case "missing_project_id":
      return "Missing EAS project ID in app config.";
    case "unavailable":
      return "Push is unavailable. Rebuild the dev client and configure FCM in EAS.";
    default:
      return "Push notifications are unavailable.";
  }
}

export async function registerForPushNotificationsAsync(): Promise<PushRegistrationResult> {
  if (!Device.isDevice) {
    return { ok: false, reason: "simulator" };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const existing = await Notifications.getPermissionsAsync();
  let permissionStatus = existing.status;

  if (permissionStatus !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    permissionStatus = requested.status;
  }

  if (permissionStatus !== "granted") {
    return { ok: false, reason: "permission_denied" };
  }

  const projectId = getExpoProjectId();
  if (!projectId) {
    return { ok: false, reason: "missing_project_id" };
  }

  try {
    const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
    const platform: PushPlatform =
      Platform.OS === "ios" ? "ios" : Platform.OS === "android" ? "android" : "unknown";

    return { ok: true, token: tokenResponse.data, platform };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}
