import {
  authenticate,
  login,
  LoginParams,
  signup,
  SignUpParams,
} from "@/api/auth";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { createContext, PropsWithChildren, useState } from "react";

import { STORAGE_KEYS } from "@/constants/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

type User = {
  id: string;
  name: string;
  email: string;
};
interface AuthContextType {
  login?: UseMutationResult<
    Awaited<ReturnType<typeof login>>,
    Error,
    LoginParams,
    unknown
  >;
  logout?: () => void;
  signup?: UseMutationResult<
    Awaited<ReturnType<typeof signup>>,
    Error,
    SignUpParams,
    unknown
  >;
  authenticate?: UseMutationResult<
    Awaited<ReturnType<typeof authenticate>>,
    Error,
    void,
    unknown
  >;
  user?: User;
}

const AuthContext = createContext<AuthContextType>({});

export default AuthContext;

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const { navigate } = useRouter();

  const [user, setUser] = useState<User>();

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (params: LoginParams) => {
      const response = await login(params);

      if (response) {
        const { token, email, id, name } = response;
        await AsyncStorage.setItem(STORAGE_KEYS.token, token);

        setUser({ email, id, name });
      } else {
        Alert.alert("Email or password is incorrect.");
      }

      return response;
    },
  });

  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (params: SignUpParams) => {
      const response = await signup(params);

      if (response) {
        await AsyncStorage.setItem(STORAGE_KEYS.token, response);
      } else {
        Alert.alert("Email already exists.");
      }

      return response;
    },
  });

  const authenticateMutation = useMutation({
    mutationKey: ["authenticate"],
    mutationFn: async () => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.token);

      if (token) {
        const result = await authenticate({ token });

        setUser(result);
        return result;
      }

      return undefined;
    },
  });

  const logout = async () => {
    setUser(undefined);

    await AsyncStorage.removeItem(STORAGE_KEYS.token);

    navigate("/(auth)/login");
  };

  return (
    <AuthContext.Provider
      value={{
        login: loginMutation,
        signup: signupMutation,
        authenticate: authenticateMutation,
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
