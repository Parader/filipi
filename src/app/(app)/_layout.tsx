import { Tabs } from "expo-router";
import type { JSX } from "react";

import { selectUnreadCount, useNotificationsStore } from "@/stores/notifications";

/**
 * Authenticated tab shell — protected by auth gate in root layout (Phase 3).
 */
export default function AppLayout(): JSX.Element {
  const unreadCount = useNotificationsStore(selectUnreadCount);

  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
    </Tabs>
  );
}
