import ThemedButton from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import ThemedTextInput from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import AuthContext from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useContext, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TextInput } from "react-native";
import * as z from "zod";

const schema = z.object({
  email: z.email("Email format is incorrect"),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useContext(AuthContext);
  const { replace } = useRouter();

  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleRegisterPress = () => {
    replace("/(auth)/signup");
  };

  const handleLoginPress = () => {
    handleSubmit(async (params) => {
      const result = await login?.mutateAsync(params);

      if (result) {
        replace("/(tabs)");

        return;
      }
    })();
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@/assets/images/esp.svg")}
        style={{ width: "100%", height: 100, marginBottom: 50 }}
        contentFit="contain"
      />
      <Controller
        control={control}
        name="email"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <ThemedTextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
            textContentType="emailAddress"
            icon={"mail"}
            error={error}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <ThemedTextInput
            ref={passwordRef}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
            textContentType="password"
            secureTextEntry
            icon={"lock"}
            error={error}
          />
        )}
      />

      <ThemedButton
        style={{ marginVertical: 12 }}
        onPress={handleLoginPress}
        disabled={!isValid}
      >
        Login
      </ThemedButton>

      <ThemedView style={{ flexDirection: "row", gap: 4 }}>
        <ThemedText>{"Don't have an account?"}</ThemedText>
        <ThemedButton
          type="text"
          textStyle={{ textTransform: "none" }}
          fullWidth={false}
          onPress={handleRegisterPress}
        >
          Sign up now!
        </ThemedButton>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 8,
  },
});
