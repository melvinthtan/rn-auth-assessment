import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    StyleProp,
    TextStyle,
    View,
} from "react-native";

interface ThemedButtonProps extends PressableProps {
  fullWidth?: boolean;
  type?: "fill" | "outline" | "text";
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
}

const ThemedButton = ({
  fullWidth = true,
  children,
  style,
  textStyle,
  type = "fill",
  disabled,
  loading = false,
  ...pressableProps
}: ThemedButtonProps) => {
  const buttonColor = useThemeColor({}, "button");

  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      style={(state) => [
        {
          opacity: state.pressed || disabled ? 0.5 : 1,
          minWidth: fullWidth ? "100%" : "auto",
          borderRadius: 8,
          paddingVertical: 12,
          alignItems: "center",
        },
        type === "fill"
          ? {
              backgroundColor: buttonColor,
            }
          : undefined,
        type === "outline"
          ? { borderColor: buttonColor, borderWidth: 2 }
          : undefined,
        type === "text" ? { paddingVertical: 0 } : undefined,
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {loading && (
        <ActivityIndicator style={{ position: "absolute", top: "50%" }} />
      )}

      <View style={{ opacity: loading ? 0 : 1 }}>
        <>
          {typeof children === "string" ? (
            <ThemedText
              style={[
                { textTransform: "uppercase", color: "white" },
                ["text", "outline"].includes(type)
                  ? { color: buttonColor }
                  : undefined,
                textStyle,
              ]}
            >
              {children}
            </ThemedText>
          ) : (
            children
          )}
        </>
      </View>
    </Pressable>
  );
};

export default ThemedButton;
