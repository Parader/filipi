import { Button, Typography } from "heroui-native";
import { useRouter } from "expo-router";
import type { JSX } from "react";
import { View } from "react-native";

/**
 * Login stub — Phase 2 adds Supabase auth.
 */
export default function LoginScreen(): JSX.Element {
  const router = useRouter();

  return (
    <View testID="login-screen" className="flex-1 bg-background px-6 justify-center gap-6">
      <View className="gap-2">
        <Typography.Heading className="text-center">Log in</Typography.Heading>
        <Typography.Paragraph className="text-center text-muted">
          Sign-in form coming in Phase 2 (Supabase).
        </Typography.Paragraph>
      </View>

      <Button
        variant="ghost"
        testID="login-back-button"
        accessibilityLabel="Back to welcome"
        accessibilityRole="button"
        onPress={() => router.back()}
      >
        Back
      </Button>
    </View>
  );
}
