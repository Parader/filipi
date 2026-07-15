import { Stack, useRouter, useSegments } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect, type JSX } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { getAuthRedirectPath } from "@/lib/auth-redirect";
import { AuthProvider, useAuth } from "@/providers/auth-provider";

import "../global.css";

function RootNavigator(): JSX.Element {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const segmentGroup = segments[0];
    const redirectPath = getAuthRedirectPath(session, isLoading, segmentGroup);

    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [session, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View testID="auth-loading" className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider config={{ devInfo: { stylingPrinciples: false } }}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
