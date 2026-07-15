import { Button, Typography } from "heroui-native";
import { useRouter } from "expo-router";
import { useState, type JSX } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { AuthTextField } from "@/components/auth-text-field";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { hasAuthFieldErrors, validateLoginForm } from "@/lib/auth-validation";
import { getSupabaseConfigError, supabase } from "@/lib/supabase";

export default function LoginScreen(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const configError = getSupabaseConfigError();

  async function handleSubmit(): Promise<void> {
    setFormError(null);
    const errors = validateLoginForm(email, password);
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
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setFormError(getAuthErrorMessage(error));
        return;
      }

      router.replace("/(app)/home");
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
        <View testID="login-screen" className="gap-6 max-w-sm w-full self-center">
          <View className="gap-2">
            <Typography.Heading className="text-center">Log in</Typography.Heading>
            <Typography.Paragraph className="text-center text-muted">
              Welcome back. Sign in to continue training.
            </Typography.Paragraph>
          </View>

          {configError ? (
            <Typography.Paragraph testID="login-config-error" className="text-danger text-center">
              {configError}
            </Typography.Paragraph>
          ) : null}

          {formError ? (
            <Typography.Paragraph testID="login-form-error" className="text-danger text-center">
              {formError}
            </Typography.Paragraph>
          ) : null}

          <AuthTextField
            label="Email"
            testID="login-email-input"
            accessibilityLabel="Email"
            value={email}
            onChangeText={setEmail}
            error={fieldErrors.email}
            keyboardType="email-address"
            textContentType="emailAddress"
          />

          <AuthTextField
            label="Password"
            testID="login-password-input"
            accessibilityLabel="Password"
            value={password}
            onChangeText={setPassword}
            error={fieldErrors.password}
            secureTextEntry
            textContentType="password"
          />

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            testID="login-submit-button"
            accessibilityLabel="Log in"
            accessibilityRole="button"
            isDisabled={isSubmitting}
            onPress={() => {
              void handleSubmit();
            }}
          >
            {isSubmitting ? "Signing in…" : "Log in"}
          </Button>

          {isSubmitting ? <ActivityIndicator testID="login-loading" /> : null}

          <Button
            variant="ghost"
            testID="login-sign-up-link"
            accessibilityLabel="Create account"
            accessibilityRole="button"
            onPress={() => router.push("/sign-up")}
          >
            Create account
          </Button>

          <Button
            variant="ghost"
            testID="login-back-button"
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
