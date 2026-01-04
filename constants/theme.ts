/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const palette = {
  light: {
    primary: "#C64863",
    secondary: "#5782A6",
    accent: "#726CA8",

    background: "#E4CDDD",
    surface: "#D9BAD2",

    border: "#726CA8",
    muted: "#D9BAD2",

    text: "#2A1E2E",
    error: "#D16C6C",
  },
  dark: {
    primary: "#E07451",
    secondary: "#566574",
    accent: "#F4D995",

    background: "#F4D995",
    surface: "#F4D995",

    border: "#4A575D",
    muted: "#4A575D",

    text: "#020303",
    error: "#D16C6C",
  },
};

export const Colors = {
  light: {
    ...palette.light,
    text: palette.light.text,
    background: palette.light.background,
    tint: palette.light.secondary,
    border: palette.light.border,
    button: palette.light.primary,
    icon: palette.light.accent,
    tabIconDefault: palette.light.accent,
    tabIconSelected: palette.light.primary,
    error: palette.light.error,
  },
  dark: {
    ...palette.dark,
    text: palette.dark.text,
    background: palette.dark.background,
    tint: palette.dark.secondary,
    border: palette.dark.border,
    button: palette.dark.primary,
    icon: palette.dark.accent,
    tabIconDefault: palette.dark.accent,
    tabIconSelected: palette.dark.secondary,
    error: palette.dark.error,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
