import { fireEvent, render, screen } from "@testing-library/react-native";

import NotificationsScreen from "@/app/(app)/notifications";
import { useNotificationsStore } from "@/stores/notifications";

describe("NotificationsScreen", () => {
  beforeEach(() => {
    useNotificationsStore.getState().resetNotifications();
  });

  test("renders seeded notifications and unread count", async () => {
    await render(<NotificationsScreen />);

    expect(screen.getByTestId("notifications-screen")).toBeTruthy();
    expect(screen.getByTestId("notifications-unread-count")).toHaveTextContent("3 unread");
    expect(screen.getByTestId("notification-item-1")).toBeTruthy();
    expect(screen.getByTestId("notification-unread-1")).toBeTruthy();
  });

  test("marks all notifications as read", async () => {
    await render(<NotificationsScreen />);

    fireEvent.press(screen.getByTestId("notifications-mark-all-read"));

    expect(screen.getByTestId("notifications-unread-count")).toHaveTextContent("0 unread");
    expect(screen.queryByTestId("notification-unread-1")).toBeNull();
  });

  test("marks a notification as read when tapped", async () => {
    await render(<NotificationsScreen />);

    fireEvent.press(screen.getByTestId("notification-item-2"));

    expect(screen.getByTestId("notifications-unread-count")).toHaveTextContent("2 unread");
    expect(screen.queryByTestId("notification-unread-2")).toBeNull();
  });
});
