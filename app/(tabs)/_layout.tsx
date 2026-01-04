import { Tabs } from "expo-router";
import React, { useContext, useEffect } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import AuthContext from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function TabLayout() {
  const { authenticate } = useContext(AuthContext);

  const tabBackgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "surface");
  const tabActiveColor = useThemeColor({}, "tabIconSelected");
  const tabInactiveColor = useThemeColor({}, "tabIconDefault");

  useEffect(() => {
    authenticate?.mutate();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabActiveColor,
        tabBarInactiveTintColor: tabInactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: tabBackgroundColor,
          borderTopColor: borderColor,
          borderTopWidth: 2,
          paddingTop: 10,
          height: 100,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Catch",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cricket.ball.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "List",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list.triangle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
