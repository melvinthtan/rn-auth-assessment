import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export default function Auth() {
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

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.loadingImage}
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
