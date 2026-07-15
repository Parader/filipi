import { getExpoProjectId, getPushStatusMessage } from "@/lib/push-notifications";

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        eas: {
          projectId: "f36902ba-6be7-4499-a4e9-cada0a82d321",
        },
      },
    },
    easConfig: {
      projectId: "f36902ba-6be7-4499-a4e9-cada0a82d321",
    },
  },
}));

describe("push-notifications", () => {
  test("reads EAS project id from app config", () => {
    expect(getExpoProjectId()).toBe("f36902ba-6be7-4499-a4e9-cada0a82d321");
  });

  test("maps failure reasons to user-facing messages", () => {
    expect(getPushStatusMessage("simulator")).toMatch(/physical device/i);
    expect(getPushStatusMessage("permission_denied")).toMatch(/permission/i);
  });
});
