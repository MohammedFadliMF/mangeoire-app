import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../_layout";

export default function AuthRoutesLayout() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement Auth...</Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
