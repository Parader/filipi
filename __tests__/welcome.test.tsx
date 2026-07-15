import { fireEvent, render, screen } from "@testing-library/react-native";

import WelcomeScreen from "@/app/(public)/index";

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe("WelcomeScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  test("renders welcome screen with app title and tagline", async () => {
    await render(<WelcomeScreen />);

    expect(screen.getByTestId("welcome-screen")).toBeTruthy();
    expect(screen.getByText("Filipi Boats")).toBeTruthy();
    expect(screen.getByText(/Train smarter/)).toBeTruthy();
  });

  test("renders Get started and Log in buttons with accessibility labels", async () => {
    await render(<WelcomeScreen />);

    expect(screen.getByTestId("welcome-get-started-button")).toBeTruthy();
    expect(screen.getByTestId("welcome-login-button")).toBeTruthy();
    expect(screen.getByLabelText("Get started")).toBeTruthy();
    expect(screen.getByLabelText("Log in")).toBeTruthy();
  });

  test("navigates to sign-up when Get started is pressed", async () => {
    await render(<WelcomeScreen />);

    fireEvent.press(screen.getByTestId("welcome-get-started-button"));

    expect(mockPush).toHaveBeenCalledWith("/sign-up");
  });

  test("navigates to login when Log in is pressed", async () => {
    await render(<WelcomeScreen />);

    fireEvent.press(screen.getByTestId("welcome-login-button"));

    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
