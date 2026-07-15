import { Typography } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";

export default function ProfileScreen(): JSX.Element {
  return (
    <View testID="profile-screen" className="flex-1 bg-background items-center justify-center px-6">
      <Typography.Heading className="text-center">Profile</Typography.Heading>
      <Typography.Paragraph className="text-center text-muted">
        Profile placeholder (Phase 4)
      </Typography.Paragraph>
    </View>
  );
}
