/* eslint-disable @typescript-eslint/no-require-imports -- Jest mocks must use require() inside factories */

jest.mock("heroui-native", () => {
  const React = require("react");
  const { Pressable, Text, TextInput, View } = require("react-native");

  const MockText = ({ children, ...props }) => React.createElement(Text, props, children);

  const MockButton = ({
    children,
    onPress,
    testID,
    accessibilityLabel,
    accessibilityRole,
    isDisabled,
    ...props
  }) =>
    React.createElement(
      Pressable,
      {
        onPress: isDisabled ? undefined : onPress,
        testID,
        accessibilityLabel,
        accessibilityRole: accessibilityRole ?? "button",
        accessibilityState: { disabled: Boolean(isDisabled) },
        ...props,
      },
      typeof children === "string" ? React.createElement(Text, null, children) : children,
    );

  MockButton.Label = MockText;

  const MockInput = ({ testID, accessibilityLabel, value, onChangeText, ...props }) =>
    React.createElement(TextInput, {
      testID,
      accessibilityLabel,
      value,
      onChangeText,
      ...props,
    });

  return {
    HeroUINativeProvider: ({ children }) => React.createElement(View, null, children),
    Typography: {
      Heading: MockText,
      Paragraph: MockText,
      Label: MockText,
    },
    Button: MockButton,
    Input: MockInput,
    Card: ({ children, testID, ...props }) => React.createElement(View, { testID, ...props }, children),
    Avatar: Object.assign(
      ({ children, testID, ...props }) => React.createElement(View, { testID, ...props }, children),
      {
        Fallback: MockText,
        Image: () => null,
      },
    ),
    Chip: ({ children, testID, ...props }) => React.createElement(View, { testID, ...props }, children),
    useThemeColor: () => "#000000",
  };
});

jest.mock("react-native-worklets", () => ({
  __esModule: true,
  createSerializable: jest.fn((value) => value),
  createWorkletRuntime: jest.fn(),
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  scheduleOnRN: (fn) => fn,
  scheduleOnUI: (fn) => fn,
  isWorkletFunction: () => false,
}));

jest.mock("uniwind", () => ({
  useUniwind: () => ({ theme: "light" }),
  withUniwind: (Component) => Component,
}));

jest.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => true,
  getSupabaseConfigError: () => null,
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));
