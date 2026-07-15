import { Tabs } from "expo-router";
import type { JSX } from "react";

/**
 * Authenticated tab shell stub (Phase 0).
 * Phase 3 wires this behind the auth session gate.
 */
export default function AppLayout(): JSX.Element {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="notifications" options={{ title: "Notifications" }} />
    </Tabs>
  );
}
