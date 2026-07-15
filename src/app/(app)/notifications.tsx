import { Typography } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";

export default function NotificationsScreen(): JSX.Element {
  return (
    <View
      testID="notifications-screen"
      className="flex-1 bg-background items-center justify-center px-6"
    >
      <Typography.Heading className="text-center">Notifications</Typography.Heading>
      <Typography.Paragraph className="text-center text-muted">
        Simulated notifications placeholder (Phase 4)
      </Typography.Paragraph>
    </View>
  );
}
