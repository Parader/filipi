import { getAuthRedirectPath } from "@/lib/auth-redirect";

describe("getAuthRedirectPath", () => {
  test("returns null while auth is loading", () => {
    expect(getAuthRedirectPath(null, true, undefined)).toBeNull();
  });

  test("redirects signed-in users away from public routes", () => {
    expect(getAuthRedirectPath({} as never, false, "(public)")).toBe("/(app)/home");
    expect(getAuthRedirectPath({} as never, false, undefined)).toBe("/(app)/home");
  });

  test("redirects signed-out users away from app routes", () => {
    expect(getAuthRedirectPath(null, false, "(app)")).toBe("/");
  });

  test("allows signed-in users in app routes", () => {
    expect(getAuthRedirectPath({} as never, false, "(app)")).toBeNull();
  });

  test("allows signed-out users on public routes", () => {
    expect(getAuthRedirectPath(null, false, "(public)")).toBeNull();
  });
});
