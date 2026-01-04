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
  name: z.string().min(1, { message: "Name cannot be empty." }),
  email: z.email("Email format is incorrect"),
  password: z
    .string()
    .min(8, { message: "Password must have a minimum of 8 characters." })
    .refine((password) => /[a-zA-Z]/.test(password) && /\d/.test(password), {
      message: "Password must contain both letters and numbers.",
    }),
});

type FormData = z.infer<typeof schema>;

export default function Signup() {
  const { replace } = useRouter();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const { signup } = useContext(AuthContext);

  const { mutateAsync, isPending } = signup || {};

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleLoginPress = () => {
    if (!isPending) {
      replace("/(auth)/login");
    }
  };

  const handleSignupPress = () => {
    handleSubmit(async (params) => {
      const response = await mutateAsync?.(params);

      if (response) {
        replace("/(tabs)");
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
        name="name"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <ThemedTextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Name"
            textContentType="name"
            icon={"person.crop.circle"}
            error={error}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <ThemedTextInput
            ref={emailRef}
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
        onPress={handleSignupPress}
        disabled={!isValid}
        loading={isPending}
      >
        Sign Up
      </ThemedButton>

      <ThemedView style={{ flexDirection: "row", gap: 4 }}>
        <ThemedText>{"Already have an account?"}</ThemedText>
        <ThemedButton
          type="text"
          textStyle={{ textTransform: "none" }}
          fullWidth={false}
          onPress={handleLoginPress}
        >
          Login now!
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
