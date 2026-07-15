import { Typography } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";

export default function HomeScreen(): JSX.Element {
  return (
    <View testID="home-screen" className="flex-1 bg-background items-center justify-center px-6">
      <Typography.Heading className="text-center">Home</Typography.Heading>
      <Typography.Paragraph className="text-center text-muted">
        Authenticated home placeholder
      </Typography.Paragraph>
    </View>
  );
}
