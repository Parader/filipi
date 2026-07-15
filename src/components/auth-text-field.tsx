import { Input, Typography } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";

type AuthTextFieldProps = {
  label: string;
  testID: string;
  accessibilityLabel: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
  textContentType?: "emailAddress" | "password" | "newPassword" | "none";
};

export function AuthTextField({
  label,
  testID,
  accessibilityLabel,
  value,
  onChangeText,
  error,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType = "default",
  textContentType,
}: AuthTextFieldProps): JSX.Element {
  return (
    <View className="gap-1.5">
      <Typography.Paragraph className="font-medium">{label}</Typography.Paragraph>
      <Input
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoCorrect={false}
        isInvalid={Boolean(error)}
      />
      {error ? (
        <Typography.Paragraph testID={`${testID}-error`} className="text-danger text-sm">
          {error}
        </Typography.Paragraph>
      ) : null}
    </View>
  );
}
