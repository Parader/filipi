import { AuthError } from "@supabase/supabase-js";

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    switch (error.message) {
      case "Invalid login credentials":
        return "Incorrect email or password.";
      case "User already registered":
        return "An account with this email already exists.";
      case "Email not confirmed":
        return "Check your email to confirm your account before signing in.";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("Network request failed")) {
      return "Network error. Check your connection and try again.";
    }
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
