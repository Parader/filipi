import type { Session } from "@supabase/supabase-js";

export type AuthRedirectPath = "/" | "/(app)/home";

/**
 * Returns a redirect path when the user is in the wrong route group, or null if no redirect is needed.
 */
export function getAuthRedirectPath(
  session: Session | null,
  isLoading: boolean,
  segmentGroup: string | undefined,
): AuthRedirectPath | null {
  if (isLoading) {
    return null;
  }

  const inAppGroup = segmentGroup === "(app)";

  if (session && !inAppGroup) {
    return "/(app)/home";
  }

  if (!session && inAppGroup) {
    return "/";
  }

  return null;
}
