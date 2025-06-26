import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../../app/_layout";

export default function Layout() {
  const { user, loading } = useContext(AuthContext);

  // Afficher un écran de chargement pendant la vérification
  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text>Chargement Root ...</Text>
  //     </View>
  //   );
  // }
  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
