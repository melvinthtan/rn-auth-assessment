import { catchPoke } from "@/api/poke";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import ThemedButton from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import AuthContext from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { capitalizeFirstLetter } from "@/libs/capitalizeFirstLetter";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useContext } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function Catch() {
  const { user } = useContext(AuthContext);

  const backgroundColor = useThemeColor({}, "surface");

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const spriteOverlayOpacity = useSharedValue(1);
  const spriteOpacity = useSharedValue(0);

  const {
    mutate: catchMutate,
    isPending,
    data,
    reset,
  } = useMutation({
    mutationKey: ["catchPoke"],
    mutationFn: catchPoke,
    onSuccess: () => {
      animateCaught();
    },
  });

  const handleCatchPress = () => {
    if (user) {
      animateTwitching();
      catchMutate({ userId: user.id });
    }
  };

  const animateCaught = () => {
    scale.value = withTiming(3, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });

    opacity.value = withTiming(0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });

    rotation.value = withTiming(0, {
      duration: 100,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const animateSprite = () => {
    spriteOverlayOpacity.value = withTiming(0, {
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
    });

    spriteOpacity.value = withTiming(1, {
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const animateTwitching = () => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    rotation.value = withRepeat(
      withSequence(
        withTiming(-10, {
          duration: 100,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(10, {
          duration: 100,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(-10, {
          duration: 100,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 100,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotateZ: `${rotation.value}deg` }],
  }));

  const spriteOverlayAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    opacity: spriteOverlayOpacity.value,
  }));

  const spriteAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    opacity: spriteOpacity.value,
  }));

  const caughtTextAnimatedSyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: -50,
    opacity: spriteOpacity.value,
    alignSelf: "center",
    left: "50%",
  }));

  const catchBtnAnimatedStyle = useAnimatedStyle(() => ({
    opacity: spriteOpacity.value,
  }));

  const handleCatchAgainPress = () => {
    reset();

    scale.value = 1;
    opacity.value = 1;
    rotation.value = 0;
    spriteOverlayOpacity.value = 1;
    spriteOpacity.value = 0;
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: backgroundColor, dark: backgroundColor }}
      headerImage={
        <Image
          source={require("@/assets/images/catch.webp")}
          style={{ height: "100%", width: "100%", alignSelf: "center" }}
          contentFit="cover"
        />
      }
    >
      <View
        style={{
          height: "100%",
          gap: 8,
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            onPress={handleCatchPress}
            disabled={isPending || !!data}
          >
            {data && (
              <View
                onLayout={() => {
                  setTimeout(() => {
                    animateSprite();
                  }, 1000);
                }}
                style={{
                  position: "absolute",
                  transform: [{ translateY: "-50%" }],
                }}
              >
                <Animated.View style={{ ...spriteAnimatedStyle }}>
                  <Animated.Image
                    source={{ uri: data.img }}
                    style={{
                      width: 240,
                      height: 240,
                    }}
                  />
                </Animated.View>

                <Animated.View
                  style={{
                    ...spriteOverlayAnimatedStyle,
                  }}
                >
                  <Animated.Image
                    source={{ uri: data.img }}
                    style={{
                      width: 240,
                      height: 240,
                      tintColor: "white",
                    }}
                  />
                </Animated.View>

                <Animated.View style={caughtTextAnimatedSyle}>
                  <Animated.Text>{`Congratulations! You've caught a ${capitalizeFirstLetter(
                    data?.name
                  )}!`}</Animated.Text>
                </Animated.View>
              </View>
            )}
            <Animated.View style={animatedStyle}>
              <Animated.Image
                source={require("@/assets/images/ball.webp")}
                style={{
                  width: 240,
                  height: 240,
                  marginBottom: 16,
                }}
              />
            </Animated.View>

            <ThemedText
              style={{
                textAlign: "center",
                opacity: !isPending && !data ? 1 : 0,
              }}
            >
              Tap to catch
            </ThemedText>
          </Pressable>
        </View>

        <Animated.View style={catchBtnAnimatedStyle}>
          <ThemedButton onPress={handleCatchAgainPress} disabled={!data}>
            Catch again
          </ThemedButton>
        </Animated.View>
      </View>
    </ParallaxScrollView>
  );
}
