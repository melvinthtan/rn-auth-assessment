import { ThemedView } from "@/components/themed-view";
import AuthContext from "@/contexts/AuthContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export default function Auth() {
  const { authenticate } = useContext(AuthContext);
  const { replace } = useRouter();

  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  useEffect(() => {
    const authenticateToken = async () => {
      const result = await authenticate?.mutateAsync();

      if (result) {
        replace("/(tabs)");
        return;
      }

      replace("/(auth)/login");
    };

    authenticateToken();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Image
          source={require("@/assets/images/esp.svg")}
          style={styles.loadingImage}
          contentFit="contain"
        />
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingImage: {
    height: 100,
    width: 100,
  },
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
