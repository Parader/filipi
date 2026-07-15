import { Avatar, Button, Card, Typography } from "heroui-native";
import { useState, type JSX } from "react";
import { ScrollView, View } from "react-native";

import { MOCK_PROFILE_STATS, getDisplayName, getInitials } from "@/lib/user-display";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";
import { usePushNotifications } from "@/providers/push-notifications-provider";

function StatCard({ label, value, testID }: { label: string; value: string | number; testID: string }): JSX.Element {
  return (
    <Card className="flex-1 items-center py-4 gap-1" testID={testID}>
      <Typography.Heading testID={`${testID}-value`} className="text-xl">
        {value}
      </Typography.Heading>
      <Typography.Paragraph className="text-muted text-sm text-center">{label}</Typography.Paragraph>
    </Card>
  );
}

export default function ProfileScreen(): JSX.Element {
  const { session } = useAuth();
  const { statusMessage, registerPush, sendTestPush, status } = usePushNotifications();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [pushFeedback, setPushFeedback] = useState<string | null>(null);
  const email = session?.user.email ?? null;
  const displayName = getDisplayName(session);
  const initials = getInitials(displayName);

  async function handleSignOut(): Promise<void> {
    setIsSigningOut(true);

    try {
      await supabase.auth.signOut();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <ScrollView
      testID="profile-screen"
      className="flex-1 bg-background"
      contentContainerClassName="px-6 py-8 gap-6"
    >
      <View className="items-center gap-3">
        <Avatar size="lg" testID="profile-avatar">
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
        <Typography.Heading testID="profile-display-name" className="text-center">
          {displayName}
        </Typography.Heading>
        {email ? (
          <Typography.Paragraph testID="profile-email" className="text-center text-muted">
            {email}
          </Typography.Paragraph>
        ) : null}
      </View>

      <View className="flex-row gap-3">
        <StatCard label="Day streak" value={MOCK_PROFILE_STATS.streak} testID="profile-stat-streak" />
        <StatCard label="XP" value={MOCK_PROFILE_STATS.xp} testID="profile-stat-xp" />
        <StatCard label="Rank" value={`#${MOCK_PROFILE_STATS.rank}`} testID="profile-stat-rank" />
      </View>

      <View className="gap-3">
        <Typography.Heading className="text-base">Push notifications</Typography.Heading>
        <Typography.Paragraph testID="profile-push-status" className="text-muted text-sm">
          {statusMessage}
        </Typography.Paragraph>
        {pushFeedback ? (
          <Typography.Paragraph testID="profile-push-feedback" className="text-sm">
            {pushFeedback}
          </Typography.Paragraph>
        ) : null}
        <Button
          variant="secondary"
          testID="profile-push-register-button"
          accessibilityLabel="Register for push notifications"
          accessibilityRole="button"
          isDisabled={status === "registering" || status === "test_sending"}
          onPress={() => {
            setPushFeedback(null);
            void registerPush().then(() => {
              setPushFeedback("Push registration attempted.");
            });
          }}
        >
          {status === "registering" ? "Registering…" : "Register push"}
        </Button>
        <Button
          variant="secondary"
          testID="profile-push-test-button"
          accessibilityLabel="Send test push notification"
          accessibilityRole="button"
          isDisabled={status !== "registered" || status === "test_sending"}
          onPress={() => {
            setPushFeedback(null);
            void sendTestPush().then((result) => {
              setPushFeedback(result.error ? result.error : "Test push sent.");
            });
          }}
        >
          {status === "test_sending" ? "Sending…" : "Send test push"}
        </Button>
      </View>

      <Button
        variant="outline"
        testID="profile-sign-out-button"
        accessibilityLabel="Sign out"
        accessibilityRole="button"
        isDisabled={isSigningOut}
        onPress={() => {
          void handleSignOut();
        }}
      >
        {isSigningOut ? "Signing out…" : "Sign out"}
      </Button>
    </ScrollView>
  );
}
