import { render, screen } from "@testing-library/react-native";

import ProfileScreen from "@/app/(app)/profile";

jest.mock("@/providers/auth-provider", () => ({
  useAuth: () => ({
    session: {
      user: {
        email: "athlete@example.com",
        user_metadata: { display_name: "Alex Rower" },
      },
    },
    isLoading: false,
  }),
}));

describe("ProfileScreen", () => {
  test("renders profile identity and mock stats", async () => {
    await render(<ProfileScreen />);

    expect(screen.getByTestId("profile-screen")).toBeTruthy();
    expect(screen.getByTestId("profile-display-name")).toHaveTextContent("Alex Rower");
    expect(screen.getByTestId("profile-email")).toHaveTextContent("athlete@example.com");
    expect(screen.getByTestId("profile-stat-streak-value")).toHaveTextContent("5");
    expect(screen.getByTestId("profile-stat-xp-value")).toHaveTextContent("1250");
    expect(screen.getByTestId("profile-stat-rank-value")).toHaveTextContent("#42");
  });
});
