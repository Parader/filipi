import {
  SEED_NOTIFICATIONS,
  selectUnreadCount,
  useNotificationsStore,
} from "@/stores/notifications";

describe("useNotificationsStore", () => {
  beforeEach(() => {
    useNotificationsStore.getState().resetNotifications();
  });

  test("seeds notifications on init", () => {
    expect(useNotificationsStore.getState().notifications).toHaveLength(SEED_NOTIFICATIONS.length);
  });

  test("counts unread notifications", () => {
    expect(selectUnreadCount(useNotificationsStore.getState())).toBe(3);
  });

  test("marks a single notification as read", () => {
    useNotificationsStore.getState().markAsRead("1");

    const notification = useNotificationsStore.getState().notifications.find((item) => item.id === "1");
    expect(notification?.read).toBe(true);
    expect(selectUnreadCount(useNotificationsStore.getState())).toBe(2);
  });

  test("marks all notifications as read", () => {
    useNotificationsStore.getState().markAllAsRead();

    expect(selectUnreadCount(useNotificationsStore.getState())).toBe(0);
    expect(useNotificationsStore.getState().notifications.every((item) => item.read)).toBe(true);
  });

  test("handles all-read state without errors", () => {
    useNotificationsStore.getState().markAllAsRead();
    useNotificationsStore.getState().markAsRead("1");

    expect(selectUnreadCount(useNotificationsStore.getState())).toBe(0);
  });

  test("prepends push notifications without duplicates", () => {
    useNotificationsStore.getState().addNotification({
      id: "push-1",
      title: "Test push",
      body: "Hello from Expo",
      read: false,
      createdAt: "2026-07-15T12:00:00.000Z",
      source: "push",
    });

    expect(useNotificationsStore.getState().notifications[0]?.id).toBe("push-1");
    expect(selectUnreadCount(useNotificationsStore.getState())).toBe(4);

    useNotificationsStore.getState().addNotification({
      id: "push-1",
      title: "Test push updated",
      body: "Updated body",
      read: false,
      createdAt: "2026-07-15T12:01:00.000Z",
      source: "push",
    });

    expect(useNotificationsStore.getState().notifications).toHaveLength(SEED_NOTIFICATIONS.length + 1);
    expect(useNotificationsStore.getState().notifications[0]?.title).toBe("Test push updated");
  });
});
