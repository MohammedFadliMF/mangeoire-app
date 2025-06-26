import { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { AuthContext } from "../_layout";
import { authService } from "../../services/auth";

export default function Page() {
  const { user, session } = useContext(AuthContext);
  
  const handleSignOut = async () => {
    try {
      await authService.signOut();
      // La redirection se fera automatiquement via le contexte
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Bonjour {user?.email || "Utilisateur"}!
      </Text>

      <TouchableOpacity
        onPress={handleSignOut}
        style={{
          backgroundColor: "red",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white" }}>Se déconnecter</Text>
      </TouchableOpacity>
      <Link href="/(auth)/sign-in" style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>Sign In</Text>
      </Link>
      <Link href="/(auth)/sign-up" style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>Sign Up</Text>
      </Link>
    </View>
  );
}
