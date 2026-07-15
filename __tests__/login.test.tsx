import { render, screen } from "@testing-library/react-native";

import LoginScreen from "@/app/(public)/login";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe("LoginScreen", () => {
  test("renders login stub screen", async () => {
    await render(<LoginScreen />);

    expect(screen.getByTestId("login-screen")).toBeTruthy();
    expect(screen.getByText("Log in")).toBeTruthy();
    expect(screen.getByText(/Phase 2/)).toBeTruthy();
  });
});
