import {
  isValidEmail,
  validateLoginForm,
  validateSignUpForm,
} from "@/lib/auth-validation";

describe("auth-validation", () => {
  test("accepts valid email addresses", () => {
    expect(isValidEmail("athlete@example.com")).toBe(true);
  });

  test("rejects invalid email addresses", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });

  test("requires email and password on login", () => {
    expect(validateLoginForm("", "")).toEqual({
      email: "Email is required.",
      password: "Password is required.",
    });
  });

  test("requires matching passwords on sign-up", () => {
    expect(
      validateSignUpForm("athlete@example.com", "password123", "different"),
    ).toEqual({
      confirmPassword: "Passwords do not match.",
    });
  });

  test("accepts valid login credentials", () => {
    expect(validateLoginForm("athlete@example.com", "password123")).toEqual({});
  });
});
