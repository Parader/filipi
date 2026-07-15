import type { Session } from "@supabase/supabase-js";

export const MOCK_PROFILE_STATS = {
  streak: 5,
  xp: 1250,
  rank: 42,
} as const;

export function getDisplayName(session: Session | null): string {
  if (!session) {
    return "Athlete";
  }

  const metadata = session.user.user_metadata as { display_name?: string } | undefined;
  if (metadata?.display_name?.trim()) {
    return metadata.display_name.trim();
  }

  if (session.user.email) {
    return session.user.email.split("@")[0] ?? "Athlete";
  }

  return "Athlete";
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}
