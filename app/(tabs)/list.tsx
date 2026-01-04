import { getPokeList } from "@/api/poke";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import AuthContext from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { capitalizeFirstLetter } from "@/libs/capitalizeFirstLetter";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useContext } from "react";
import { View } from "react-native";

export default function List() {
  const { user } = useContext(AuthContext);
  const backgroundColor = useThemeColor({}, "surface");

  const isFocused = useIsFocused();

  const { data } = useQuery({
    queryKey: ["poke-list", user],
    queryFn: async () => {
      if (user) {
        return await getPokeList({ userId: user?.id });
      }

      return [];
    },
    enabled: isFocused,
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: backgroundColor, dark: backgroundColor }}
      headerImage={
        <Image
          source={require("@/assets/images/list.webp")}
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
        {data?.map(({ sprite, name }, index) => (
          <CardItem key={`pokelist_${index}`} name={name} sprite={sprite} />
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const CardItem = ({ name, sprite }: { name: string; sprite: string }) => {
  const borderColor = useThemeColor({}, "border");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderColor,
        borderWidth: 3,
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 8,
      }}
    >
      <ThemedText style={{ flex: 1, fontWeight: "bold" }}>
        {capitalizeFirstLetter(name)}
      </ThemedText>
      <Image
        source={sprite}
        contentFit="contain"
        style={{ height: 80, width: 80 }}
      />
    </View>
  );
};
