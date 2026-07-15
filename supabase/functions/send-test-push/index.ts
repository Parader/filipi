import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

type PushTokenRow = {
  expo_push_token: string;
};

type RequestBody = {
  title?: string;
  body?: string;
};

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: RequestBody = {};
  try {
    payload = (await req.json()) as RequestBody;
  } catch {
    payload = {};
  }

  const title = payload.title ?? "Filipi Boats";
  const body = payload.body ?? "Push notifications are working!";

  const { data: tokens, error: tokensError } = await supabase
    .from("push_tokens")
    .select("expo_push_token")
    .eq("user_id", user.id);

  if (tokensError) {
    return new Response(JSON.stringify({ error: tokensError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pushTokens = (tokens ?? []) as PushTokenRow[];
  if (pushTokens.length === 0) {
    return new Response(JSON.stringify({ error: "No push tokens registered for this user." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = pushTokens.map((row) => ({
    to: row.expo_push_token,
    sound: "default",
    title,
    body,
    data: { source: "send-test-push" },
  }));

  const expoResponse = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  const expoResult = await expoResponse.json();

  if (!expoResponse.ok) {
    return new Response(JSON.stringify({ error: "Expo push API error", details: expoResult }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      sent: messages.length,
      expo: expoResult,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
});
