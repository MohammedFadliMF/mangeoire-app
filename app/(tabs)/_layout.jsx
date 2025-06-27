import { CColors } from "@/constants/CColors";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../_layout";

export default function TabsLayout() {
  const { loading, setLoading, user, setUser } = useContext(AuthContext);

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return (
    // <Tabs
    //   screenOptions={({ route }) => ({
    //     headerShown: false,
    //     tabBarIcon: ({ color, size }) => {
    //       if (route.name === "statistics") {
    //         return <Ionicons name="stats-chart" size={size} color={color} />;
    //       }
    //       if (route.name === "schedule") {
    //         return <Ionicons name="calendar" size={size} color={color} />;
    //       }
    //       if (route.name === "settings") {
    //         return <Ionicons name="settings" size={size} color={color} />;
    //       }
    //       return null;
    //     },
    //   })}
    // >
    //   <Tabs.Screen name="statistics" options={{ title: "Statistics" }} />
    //   <Tabs.Screen name="schedule" options={{ title: "Schedule" }} />
    //   <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    // </Tabs>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: CColors.light.tint,
        tabBarInactiveTintColor: CColors.light.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: CColors.light.background,
          borderTopWidth: 1,
          borderTopColor: CColors.light.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistiques",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Programmation",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Paramètres",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
