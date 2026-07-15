import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from "react";

import {
  getPushStatusMessage,
  registerForPushNotificationsAsync,
  type PushRegistrationFailureReason,
} from "@/lib/push-notifications";
import { sendTestPushNotification, upsertPushToken } from "@/lib/push-tokens";
import { useAuth } from "@/providers/auth-provider";
import { useNotificationsStore } from "@/stores/notifications";

export type PushStatus =
  | "idle"
  | "registering"
  | "registered"
  | "signed_out"
  | PushRegistrationFailureReason
  | "save_error"
  | "test_sending";

type PushNotificationsContextValue = {
  status: PushStatus;
  expoPushToken: string | null;
  statusMessage: string;
  registerPush: () => Promise<void>;
  sendTestPush: () => Promise<{ error: string | null }>;
};

const PushNotificationsContext = createContext<PushNotificationsContextValue>({
  status: "idle",
  expoPushToken: null,
  statusMessage: "",
  registerPush: async () => {},
  sendTestPush: async () => ({ error: null }),
});

export function PushNotificationsProvider({ children }: { children: ReactNode }): JSX.Element {
  const { session } = useAuth();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const [status, setStatus] = useState<PushStatus>("idle");
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const registerPush = useCallback(async () => {
    if (!session) {
      setStatus("signed_out");
      setExpoPushToken(null);
      return;
    }

    setStatus("registering");

    const result = await registerForPushNotificationsAsync();
    if (!result.ok) {
      setStatus(result.reason);
      setExpoPushToken(null);
      return;
    }

    const { error } = await upsertPushToken({
      expoPushToken: result.token,
      platform: result.platform,
      deviceName: Device.deviceName,
    });

    if (error) {
      setStatus("save_error");
      setExpoPushToken(result.token);
      return;
    }

    setExpoPushToken(result.token);
    setStatus("registered");
  }, [session]);

  useEffect(() => {
    if (!session) {
      setStatus("signed_out");
      setExpoPushToken(null);
      return;
    }

    void registerPush();
  }, [session, registerPush]);

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
      addNotification({
        id: notification.request.identifier,
        title: notification.request.content.title ?? "Notification",
        body: notification.request.content.body ?? "",
        read: false,
        createdAt: new Date().toISOString(),
        source: "push",
      });
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const content = response.notification.request.content;
      addNotification({
        id: response.notification.request.identifier,
        title: content.title ?? "Notification",
        body: content.body ?? "",
        read: false,
        createdAt: new Date().toISOString(),
        source: "push",
      });
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [addNotification]);

  const sendTestPush = useCallback(async () => {
    setStatus("test_sending");
    const result = await sendTestPushNotification();
    setStatus(expoPushToken ? "registered" : "idle");
    return { error: result.error };
  }, [expoPushToken]);

  const statusMessage = useMemo(() => {
    switch (status) {
      case "idle":
        return "Push not registered yet.";
      case "registering":
        return "Registering for push notifications…";
      case "registered":
        return expoPushToken
          ? `Registered. Token: ${expoPushToken.slice(0, 24)}…`
          : "Registered for push notifications.";
      case "signed_out":
        return "Sign in to enable push notifications.";
      case "save_error":
        return "Got a push token but failed to save it. Try again.";
      case "test_sending":
        return "Sending test push…";
      default:
        return getPushStatusMessage(status);
    }
  }, [status, expoPushToken]);

  const value = useMemo(
    () => ({
      status,
      expoPushToken,
      statusMessage,
      registerPush,
      sendTestPush,
    }),
    [status, expoPushToken, statusMessage, registerPush, sendTestPush],
  );

  return (
    <PushNotificationsContext.Provider value={value}>{children}</PushNotificationsContext.Provider>
  );
}

export function usePushNotifications(): PushNotificationsContextValue {
  return useContext(PushNotificationsContext);
}
