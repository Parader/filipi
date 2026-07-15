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
});
