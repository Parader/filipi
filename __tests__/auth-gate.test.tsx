import { render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";

jest.mock("react-native-gesture-handler", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    GestureHandlerRootView: ({ children }: { children: ReactNode }) =>
      React.createElement(View, null, children),
  };
});

import RootLayout from "@/app/_layout";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  Stack: Object.assign(
    ({ children }: { children: ReactNode }) => children,
    { Screen: () => null },
  ),
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => ["(public)"],
}));

jest.mock("@/providers/auth-provider", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: jest.fn(),
}));

const useAuth = jest.requireMock("@/providers/auth-provider").useAuth as jest.Mock;

describe("RootLayout auth gate", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    useAuth.mockReset();
  });

  test("shows loading screen while session is resolving", async () => {
    useAuth.mockReturnValue({ session: null, isLoading: true });

    await render(<RootLayout />);

    expect(screen.getByTestId("auth-loading")).toBeTruthy();
  });

  test("redirects authenticated users to home from public routes", async () => {
    useAuth.mockReturnValue({ session: { user: { email: "athlete@example.com" } }, isLoading: false });

    await render(<RootLayout />);

    expect(mockReplace).toHaveBeenCalledWith("/(app)/home");
  });
});
