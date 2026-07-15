import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import LoginScreen from "@/app/(public)/login";
import { supabase } from "@/lib/supabase";

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: mockReplace,
  }),
}));

const signInWithPassword = supabase.auth.signInWithPassword as jest.Mock;

describe("LoginScreen", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockBack.mockClear();
    mockPush.mockClear();
    signInWithPassword.mockReset();
  });

  test("renders login form fields", async () => {
    await render(<LoginScreen />);

    expect(screen.getByTestId("login-screen")).toBeTruthy();
    expect(screen.getByTestId("login-email-input")).toBeTruthy();
    expect(screen.getByTestId("login-password-input")).toBeTruthy();
    expect(screen.getByTestId("login-submit-button")).toBeTruthy();
  });

  test("shows validation errors when submitting empty form", async () => {
    await render(<LoginScreen />);

    fireEvent.press(screen.getByTestId("login-submit-button"));

    expect(await screen.findByText("Email is required.")).toBeTruthy();
    expect(screen.getByText("Password is required.")).toBeTruthy();
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  test("navigates to home after successful login", async () => {
    signInWithPassword.mockResolvedValue({ error: null });

    await render(<LoginScreen />);

    fireEvent.changeText(screen.getByTestId("login-email-input"), "athlete@example.com");
    fireEvent.changeText(screen.getByTestId("login-password-input"), "password123");
    fireEvent.press(screen.getByTestId("login-submit-button"));

    await waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledWith({
        email: "athlete@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(app)/home");
    });
  });

  test("shows error message when login fails", async () => {
    const { AuthError } = jest.requireActual<typeof import("@supabase/supabase-js")>("@supabase/supabase-js");
    signInWithPassword.mockResolvedValue({
      error: new AuthError("Invalid login credentials", 400),
    });

    await render(<LoginScreen />);

    fireEvent.changeText(screen.getByTestId("login-email-input"), "athlete@example.com");
    fireEvent.changeText(screen.getByTestId("login-password-input"), "password123");
    fireEvent.press(screen.getByTestId("login-submit-button"));

    expect(await screen.findByTestId("login-form-error")).toBeTruthy();
    expect(screen.getByText("Incorrect email or password.")).toBeTruthy();
  });
});
