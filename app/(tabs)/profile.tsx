import ParallaxScrollView from "@/components/parallax-scroll-view";
import ThemedButton from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import AuthContext from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const backgroundColor = useThemeColor({}, "surface");
  const dividerColor = useThemeColor({}, "surface");

  const { email, name } = user || {};

  const handleLogoutPress = () => {
    logout?.();
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: backgroundColor, dark: backgroundColor }}
      headerImage={
        <Image
          source={require("@/assets/images/profile.webp")}
          style={{ height: "100%", width: "100%", alignSelf: "center" }}
          contentFit="cover"
        />
      }
    >
      <View
        style={{
          height: "100%",
          gap: 8,
        }}
      >
        <ThemedText
          style={[
            styles.text,
            {
              fontWeight: "bold",
              textAlign: "center",
              borderBottomWidth: 0,
            },
          ]}
        >
          {name}
        </ThemedText>
        <ThemedText
          style={[styles.text, { borderColor: dividerColor }]}
        >{`EMAIL: ${email ?? ""}`}</ThemedText>
        <View style={{ flex: 1 }} />
        <ThemedButton onPress={handleLogoutPress}>Logout</ThemedButton>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    textTransform: "uppercase",
    borderBottomWidth: 1,
    paddingTop: 4,
    paddingBottom: 12,
  },
});
