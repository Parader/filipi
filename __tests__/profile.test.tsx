import { render, screen } from "@testing-library/react-native";

import ProfileScreen from "@/app/(app)/profile";

jest.mock("@/providers/auth-provider", () => ({
  useAuth: () => ({
    session: {
      user: {
        email: "athlete@example.com",
        user_metadata: { display_name: "Alex Rower" },
      },
    },
    isLoading: false,
  }),
}));

jest.mock("@/providers/push-notifications-provider", () => ({
  usePushNotifications: () => ({
    status: "simulator",
    expoPushToken: null,
    statusMessage: "Push notifications require a physical device (not an emulator).",
    registerPush: jest.fn(),
    sendTestPush: jest.fn(),
  }),
}));

describe("ProfileScreen", () => {
  test("renders profile identity and mock stats", async () => {
    await render(<ProfileScreen />);

    expect(screen.getByTestId("profile-screen")).toBeTruthy();
    expect(screen.getByTestId("profile-display-name")).toHaveTextContent("Alex Rower");
    expect(screen.getByTestId("profile-email")).toHaveTextContent("athlete@example.com");
    expect(screen.getByTestId("profile-stat-streak-value")).toHaveTextContent("5");
    expect(screen.getByTestId("profile-stat-xp-value")).toHaveTextContent("1250");
    expect(screen.getByTestId("profile-stat-rank-value")).toHaveTextContent("#42");
    expect(screen.getByTestId("profile-push-status")).toBeTruthy();
    expect(screen.getByTestId("profile-push-register-button")).toBeTruthy();
  });
});
