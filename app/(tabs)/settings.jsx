import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CColors } from "../../constants/CColors";
import { authService } from "../../services/auth";
import { AuthContext } from "../_layout";

export default function SettingsScreen() {
  const { user, session } = useContext(AuthContext);

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

  const handleCalibration = () => {
    Alert.alert(
      "Calibration",
      "Cette fonctionnalité permettra de calibrer le capteur de poids. Elle sera ajoutée dans une prochaine version.",
      [{ text: "OK" }]
    );
  };

  const handleResetDevice = () => {
    Alert.alert(
      "Réinitialiser l'appareil",
      "Cela redémarrera l'ESP32 et réinitialisera tous les paramètres. Continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: () => {
            Alert.alert("Succès", "Commande de réinitialisation envoyée");
          },
        },
      ]
    );
  };

  const settingsMenuItems = [
    {
      icon: "scale-outline",
      title: "Calibrer la balance",
      subtitle: "Ajuster la précision du capteur",
      onPress: handleCalibration,
    },
    {
      icon: "wifi-outline",
      title: "Configuration WiFi",
      subtitle: "Modifier les paramètres réseau",
      onPress: () => Alert.alert("Info", "Fonctionnalité à venir"),
    },
    {
      icon: "notifications-outline",
      title: "Notifications",
      subtitle: "Gérer les alertes et rappels",
      onPress: () => Alert.alert("Info", "Fonctionnalité à venir"),
    },
    {
      icon: "refresh-outline",
      title: "Réinitialiser l'appareil",
      subtitle: "Redémarrer l'ESP32",
      onPress: handleResetDevice,
    },
  ];

  return (
    <ScrollView style={sstyles.container}>
      <View style={sstyles.header}>
        <Text style={sstyles.title}>⚙️ Paramètres</Text>
        <Text style={sstyles.subtitle}>Configuration et gestion</Text>
      </View>

      {/* Profil utilisateur */}
      <Card style={sstyles.profileCard}>
        <View style={sstyles.profileHeader}>
          <View style={sstyles.avatar}>
            <Ionicons name="person" size={32} color={CColors.light.tint} />
          </View>
          <View style={sstyles.profileInfo}>
            <Text style={sstyles.profileName}>Utilisateur</Text>
            <Text style={sstyles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
      </Card>

      {/* Menu des paramètres */}
      <Card style={sstyles.menuCard}>
        <Text style={sstyles.menuTitle}>Configuration de l&apos;appareil</Text>
        {settingsMenuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={sstyles.menuItem}
            onPress={item.onPress}
          >
            <View style={sstyles.menuIcon}>
              <Ionicons name={item.icon} size={24} color={CColors.light.tint} />
            </View>
            <View style={sstyles.menuContent}>
              <Text style={sstyles.menuItemTitle}>{item.title}</Text>
              <Text style={sstyles.menuItemSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={CColors.light.icon}
            />
          </TouchableOpacity>
        ))}
      </Card>

      {/* Informations système */}
      <Card style={sstyles.systemCard}>
        <Text style={sstyles.menuTitle}>Informations système</Text>
        <View style={sstyles.systemInfo}>
          <View style={sstyles.systemRow}>
            <Text style={sstyles.systemLabel}>Version de l&apos;app:</Text>
            <Text style={sstyles.systemValue}>1.0.0</Text>
          </View>
          <View style={sstyles.systemRow}>
            <Text style={sstyles.systemLabel}>ESP32 connecté:</Text>
            <Text
              style={[sstyles.systemValue, { color: CColors.light.success }]}
            >
              ✅ En ligne
            </Text>
          </View>
          <View style={sstyles.systemRow}>
            <Text style={sstyles.systemLabel}>Dernière sync:</Text>
            <Text style={sstyles.systemValue}>
              {new Date().toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </Card>

      {/* Bouton de déconnexion */}
      <Card style={sstyles.signOutCard}>
        <Button
          title="Se déconnecter"
          onPress={handleSignOut}
          variant="danger"
        />
      </Card>

      {/* À propos */}
      <Card style={sstyles.aboutCard}>
        <Text style={sstyles.aboutTitle}>À propos</Text>
        <Text style={sstyles.aboutText}>
          Mangeoire Automatique v1.0.0{"\n"}
          Développée avec Expo, React Native et Supabase{"\n"}
          Pour ESP32 avec capteurs HX711 et IR
        </Text>
      </Card>
    </ScrollView>
  );
}

const sstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CColors.light.card,
  },
  header: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: CColors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: CColors.light.icon,
  },
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CColors.light.card,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: CColors.light.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: CColors.light.icon,
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: CColors.light.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CColors.light.border,
  },
  menuIcon: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: CColors.light.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: CColors.light.icon,
  },
  systemCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  systemInfo: {
    marginTop: 8,
  },
  systemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  systemLabel: {
    fontSize: 14,
    color: CColors.light.icon,
  },
  systemValue: {
    fontSize: 14,
    fontWeight: "500",
    color: CColors.light.text,
  },
  signOutCard: {
    margin: 16,
  },
  aboutCard: {
    margin: 16,
    marginTop: 8,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: CColors.light.text,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: CColors.light.icon,
    lineHeight: 20,
  },
});
