import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/home.styles";
import { SignOutButton } from "../../components/SignOutButton";
import { authService } from "../../services/auth";
import { AuthContext } from "../_layout";

export default function Page() {
  const router = useRouter();

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
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.email?.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
      </View>
    </View>
  );
}
