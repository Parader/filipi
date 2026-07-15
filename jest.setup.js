/* eslint-disable @typescript-eslint/no-require-imports -- Jest mocks must use require() inside factories */

jest.mock("heroui-native", () => {
  const React = require("react");
  const { Pressable, Text, View } = require("react-native");

  const MockText = ({ children, ...props }) => React.createElement(Text, props, children);

  const MockButton = ({ children, onPress, testID, accessibilityLabel, accessibilityRole, ...props }) =>
    React.createElement(
      Pressable,
      {
        onPress,
        testID,
        accessibilityLabel,
        accessibilityRole: accessibilityRole ?? "button",
        ...props,
      },
      typeof children === "string" ? React.createElement(Text, null, children) : children,
    );

  MockButton.Label = MockText;

  return {
    HeroUINativeProvider: ({ children }) => React.createElement(View, null, children),
    Typography: {
      Heading: MockText,
      Paragraph: MockText,
      Label: MockText,
    },
    Button: MockButton,
    Card: ({ children, ...props }) => React.createElement(View, props, children),
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
