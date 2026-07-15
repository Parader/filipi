import { getAuthErrorMessage } from "@/lib/auth-errors";
import { AuthError } from "@supabase/supabase-js";

describe("getAuthErrorMessage", () => {
  test("maps invalid credentials to a friendly message", () => {
    const error = new AuthError("Invalid login credentials", 400);
    expect(getAuthErrorMessage(error)).toBe("Incorrect email or password.");
  });

  test("maps network failures to a friendly message", () => {
    expect(getAuthErrorMessage(new Error("Network request failed"))).toBe(
      "Network error. Check your connection and try again.",
    );
  });
});
