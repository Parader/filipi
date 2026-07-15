import { render, screen } from "@testing-library/react-native";

import WelcomeScreen from "@/app/(public)/index";

describe("WelcomeScreen", () => {
  test("renders welcome screen with app title", async () => {
    await render(<WelcomeScreen />);

    expect(screen.getByTestId("welcome-screen")).toBeTruthy();
    expect(screen.getByText("Filipi Boats")).toBeTruthy();
  });
});
