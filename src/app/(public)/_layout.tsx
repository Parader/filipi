import { Stack } from "expo-router";
import type { JSX } from "react";

/**
 * Public stack: welcome, login, and sign-up.
 */
export default function PublicLayout(): JSX.Element {
  return <Stack screenOptions={{ headerShown: false }} />;
}
