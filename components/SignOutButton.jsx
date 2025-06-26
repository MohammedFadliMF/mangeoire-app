import { styles } from "@/assets/styles/auth.styles.js";
import { authService } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { Alert, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";

export const SignOutButton = () => {
  const SignOut = async () => {
    try {
      await authService.signOut();
      // La redirection se fera automatiquement via le contexte
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignOut = async () => {
    Alert.alert("Lougout", "Are you sure want to logout ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: SignOut,
        style: "destructive",
      },
    ]);
  };
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
};
