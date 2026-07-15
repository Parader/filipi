import { supabase } from "@/lib/supabase";

export async function upsertPushToken(params: {
  expoPushToken: string;
  platform: string;
  deviceName?: string | null;
}): Promise<{ error: string | null }> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not signed in." };
  }

  const { error } = await supabase.from("push_tokens").upsert(
    {
      user_id: user.id,
      expo_push_token: params.expoPushToken,
      platform: params.platform,
      device_name: params.deviceName ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,expo_push_token" },
  );

  return { error: error?.message ?? null };
}

export async function sendTestPushNotification(): Promise<{ error: string | null; data?: unknown }> {
  const { data, error } = await supabase.functions.invoke("send-test-push", {
    body: {
      title: "Filipi Boats",
      body: "Push notifications are working!",
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null, data };
}
