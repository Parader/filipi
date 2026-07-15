import { create } from "zustand";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  source?: "seed" | "push";
};

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    title: "New weekly challenge",
    body: "Your competition block for this week is ready. Tap Home to start.",
    read: false,
    createdAt: "2026-07-15T08:00:00.000Z",
  },
  {
    id: "2",
    title: "Streak milestone",
    body: "You hit a 5-day training streak. Keep it going!",
    read: false,
    createdAt: "2026-07-14T18:30:00.000Z",
  },
  {
    id: "3",
    title: "Leaderboard update",
    body: "You moved up 3 places in your division.",
    read: false,
    createdAt: "2026-07-14T09:15:00.000Z",
  },
  {
    id: "4",
    title: "Coach note",
    body: "Focus on recovery between high-intensity sessions.",
    read: true,
    createdAt: "2026-07-13T12:00:00.000Z",
  },
  {
    id: "5",
    title: "Badge unlocked",
    body: "You earned the Consistency badge.",
    read: true,
    createdAt: "2026-07-12T20:45:00.000Z",
  },
];

type NotificationsState = {
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  resetNotifications: () => void;
  addNotification: (notification: AppNotification) => void;
};

export const selectUnreadCount = (state: NotificationsState): number =>
  state.notifications.filter((notification) => !notification.read).length;

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: SEED_NOTIFICATIONS,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),
  resetNotifications: () => set({ notifications: SEED_NOTIFICATIONS }),
  addNotification: (notification) =>
    set((state) => {
      const withoutDuplicate = state.notifications.filter((item) => item.id !== notification.id);
      return {
        notifications: [notification, ...withoutDuplicate],
      };
    }),
}));
