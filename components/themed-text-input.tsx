import { ThemedText } from "@/components/themed-text";
import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useState } from "react";
import { FieldError } from "react-hook-form";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

interface ThemedTextInputProps extends TextInputProps {
  icon?: IconSymbolName;
  fullWidth?: boolean;
  error?: FieldError;
  ref?: React.Ref<TextInput>;
}

const ThemedTextInput = ({
  ref,
  icon,
  fullWidth = true,
  error,
  textContentType,
  style,
  ...textInputProps
}: ThemedTextInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const borderColor = useThemeColor({}, !!error ? "error" : "border");
  const iconColor = useThemeColor({}, "icon");

  const isPassword = ["password", "newPassword"].includes(
    textContentType ?? ""
  );

  const handleShowPasswordPress = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={{ gap: 4, width: fullWidth ? "100%" : "auto" }}>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            borderColor: borderColor,
            borderWidth: 2,
            borderRadius: 8,
            padding: 4,
            paddingHorizontal: 8,
            minWidth: 200,
          },
        ]}
      >
        {icon && <IconSymbol name={icon} color={iconColor} />}
        <TextInput
          ref={ref}
          style={[{ flex: 1 }, style]}
          {...textInputProps}
          textContentType={textContentType}
          secureTextEntry={isPassword ? !showPassword : false}
        />

        {isPassword && (
          <Pressable
            onPress={handleShowPasswordPress}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <IconSymbol
              name={showPassword ? "eye" : "eye.half.closed"}
              color={iconColor}
            />
          </Pressable>
        )}
      </View>

      <Animated.View
        layout={LinearTransition}
        style={{
          height: !!error ? "auto" : 0,
          overflow: "hidden",
          opacity: !!error ? 1 : 0,
          paddingLeft: 12,
        }}
      >
        <ThemedText style={{ color: borderColor }}>{error?.message}</ThemedText>
      </Animated.View>
    </View>
  );
};

export default ThemedTextInput;
