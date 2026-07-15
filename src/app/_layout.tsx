import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import type { JSX } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "../global.css";

/**
 * Always start on the public welcome screen until Phase 3 auth gating.
 * Without this, Expo Router may open `(app)` first (alphabetically before
 * `(public)`), which is why Android emulator showed tabs while iOS showed welcome.
 */
export const unstable_settings = {
  initialRouteName: "(public)",
};

/**
 * Root layout: providers only in Phase 0.
 * Phase 3 will add a Supabase session listener here to redirect between
 * `(public)` (welcome/login) and `(app)` (authenticated tabs).
 */
export default function RootLayout(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider config={{ devInfo: { stylingPrinciples: false } }}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(public)">
          <Stack.Screen name="(public)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
