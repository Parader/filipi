import { Button, Typography } from "heroui-native";
import { useRouter } from "expo-router";
import { useState, type JSX } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { AuthTextField } from "@/components/auth-text-field";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { hasAuthFieldErrors, validateSignUpForm } from "@/lib/auth-validation";
import { getSupabaseConfigError, supabase } from "@/lib/supabase";

export default function SignUpScreen(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const configError = getSupabaseConfigError();

  async function handleSubmit(): Promise<void> {
    setFormError(null);
    const errors = validateSignUpForm(email, password, confirmPassword);
    setFieldErrors(errors);

    if (hasAuthFieldErrors(errors)) {
      return;
    }

    const missingConfig = getSupabaseConfigError();
    if (missingConfig) {
      setFormError(missingConfig);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setFormError(getAuthErrorMessage(error));
        return;
      }

      if (data.session) {
        router.replace("/(app)/home");
        return;
      }

      setFormError("Check your email to confirm your account, then log in.");
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow px-6 py-10 justify-center gap-6"
        keyboardShouldPersistTaps="handled"
      >
        <View testID="sign-up-screen" className="gap-6 max-w-sm w-full self-center">
          <View className="gap-2">
            <Typography.Heading className="text-center">Create account</Typography.Heading>
            <Typography.Paragraph className="text-center text-muted">
              Join Filipi Boats and start your training journey.
            </Typography.Paragraph>
          </View>

          {configError ? (
            <Typography.Paragraph testID="sign-up-config-error" className="text-danger text-center">
              {configError}
            </Typography.Paragraph>
          ) : null}

          {formError ? (
            <Typography.Paragraph testID="sign-up-form-error" className="text-danger text-center">
              {formError}
            </Typography.Paragraph>
          ) : null}

          <AuthTextField
            label="Email"
            testID="sign-up-email-input"
            accessibilityLabel="Email"
            value={email}
            onChangeText={setEmail}
            error={fieldErrors.email}
            keyboardType="email-address"
            textContentType="emailAddress"
          />

          <AuthTextField
            label="Password"
            testID="sign-up-password-input"
            accessibilityLabel="Password"
            value={password}
            onChangeText={setPassword}
            error={fieldErrors.password}
            secureTextEntry
            textContentType="newPassword"
          />

          <AuthTextField
            label="Confirm password"
            testID="sign-up-confirm-password-input"
            accessibilityLabel="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={fieldErrors.confirmPassword}
            secureTextEntry
            textContentType="newPassword"
          />

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            testID="sign-up-submit-button"
            accessibilityLabel="Create account"
            accessibilityRole="button"
            isDisabled={isSubmitting}
            onPress={() => {
              void handleSubmit();
            }}
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>

          {isSubmitting ? <ActivityIndicator testID="sign-up-loading" /> : null}

          <Button
            variant="ghost"
            testID="sign-up-login-link"
            accessibilityLabel="Log in"
            accessibilityRole="button"
            onPress={() => router.push("/login")}
          >
            Log in
          </Button>

          <Button
            variant="ghost"
            testID="sign-up-back-button"
            accessibilityLabel="Back to welcome"
            accessibilityRole="button"
            onPress={() => router.back()}
          >
            Back
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
