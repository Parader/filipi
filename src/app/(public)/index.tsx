import { Button, Typography } from "heroui-native";
import { useRouter } from "expo-router";
import type { JSX } from "react";
import { View } from "react-native";

export default function WelcomeScreen(): JSX.Element {
  const router = useRouter();

  return (
    <View testID="welcome-screen" className="flex-1 bg-background px-6 pb-10 pt-16">
      <View className="flex-1 items-center justify-center gap-3">
        <Typography.Heading className="text-center text-3xl">Filipi Boats</Typography.Heading>
        <Typography.Paragraph className="text-center text-muted max-w-sm">
          Train smarter. Compete harder. Level up with gamified workouts built for serious
          athletes.
        </Typography.Paragraph>
      </View>

      <View className="gap-3 w-full max-w-sm self-center">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          testID="welcome-get-started-button"
          accessibilityLabel="Get started"
          accessibilityRole="button"
          onPress={() => router.push("/sign-up")}
        >
          Get started
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          testID="welcome-login-button"
          accessibilityLabel="Log in"
          accessibilityRole="button"
          onPress={() => router.push("/login")}
        >
          Log in
        </Button>
      </View>
    </View>
  );
}
