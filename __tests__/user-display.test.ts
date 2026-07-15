import { getDisplayName, getInitials } from "@/lib/user-display";

describe("user-display", () => {
  test("uses display_name from user metadata when available", () => {
    expect(
      getDisplayName({
        user: {
          email: "athlete@example.com",
          user_metadata: { display_name: "Alex Rower" },
        },
      } as never),
    ).toBe("Alex Rower");
  });

  test("falls back to email local-part", () => {
    expect(
      getDisplayName({
        user: {
          email: "athlete@example.com",
          user_metadata: {},
        },
      } as never),
    ).toBe("athlete");
  });

  test("builds initials from display name", () => {
    expect(getInitials("Alex Rower")).toBe("AR");
  });
});
