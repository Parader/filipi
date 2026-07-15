import { Button, Chip, Typography } from "heroui-native";
import { useCallback, type JSX } from "react";
import { FlatList, Pressable, View } from "react-native";

import type { AppNotification } from "@/stores/notifications";
import { useNotificationsStore } from "@/stores/notifications";

function NotificationItem({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress: (id: string) => void;
}): JSX.Element {
  return (
    <Pressable
      testID={`notification-item-${notification.id}`}
      accessibilityRole="button"
      accessibilityLabel={notification.title}
      onPress={() => onPress(notification.id)}
      className="px-6 py-4 border-b border-default-200"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Typography.Heading className="text-base">{notification.title}</Typography.Heading>
          <Typography.Paragraph className="text-muted text-sm">{notification.body}</Typography.Paragraph>
        </View>
        {!notification.read ? (
          <Chip size="sm" variant="primary" testID={`notification-unread-${notification.id}`}>
            New
          </Chip>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen(): JSX.Element {
  const notifications = useNotificationsStore((state) => state.notifications);
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  const unreadCount = useNotificationsStore((state) =>
    state.notifications.filter((notification) => !notification.read).length,
  );

  const handlePress = useCallback(
    (id: string) => {
      markAsRead(id);
    },
    [markAsRead],
  );

  return (
    <View testID="notifications-screen" className="flex-1 bg-background">
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-default-200">
        <Typography.Paragraph testID="notifications-unread-count" className="text-muted">
          {unreadCount} unread
        </Typography.Paragraph>
        <Button
          variant="ghost"
          size="sm"
          testID="notifications-mark-all-read"
          accessibilityLabel="Mark all as read"
          accessibilityRole="button"
          isDisabled={unreadCount === 0}
          onPress={markAllAsRead}
        >
          Mark all read
        </Button>
      </View>

      <FlatList
        testID="notifications-list"
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notification={item} onPress={handlePress} />}
        ListEmptyComponent={
          <Typography.Paragraph testID="notifications-empty" className="text-center text-muted p-6">
            No notifications yet.
          </Typography.Paragraph>
        }
      />
    </View>
  );
}
