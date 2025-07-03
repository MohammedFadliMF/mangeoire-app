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
  Image,
} from "react-native";
import { CColors } from "../../constants/CColors";
import { authService } from "../../services/auth";
import { AuthContext } from "../_layout";
import { styles } from "../../assets/styles/home.styles";
import { useDevice } from "@/hooks/useDevice";
import { SignOutButton } from "../../components/SignOutButton";
import { COLORS } from "../../constants/colors";

export default function SettingsScreen() {
    const { selectedDevice } = useDevice();
  
  const { user, session } = useContext(AuthContext);

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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        {/* <Card style={sstyles.profileCard}>
          <View style={sstyles.profileHeader}>
            <View style={sstyles.avatar}>
              <Ionicons name="person" size={32} color={CColors.light.tint} />
            </View>
            <View style={sstyles.profileInfo}>
              <Text style={sstyles.profileName}>Utilisateur</Text>
              <Text style={sstyles.profileEmail}>{user?.email}</Text>
            </View>
          </View>
        </Card> */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            {/* <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            /> */}
            <View style={sstyles.avatar}>
              <Ionicons name="person" size={32} color={COLORS.primary} />
            </View>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                {/* {selectedDevice ? selectedDevice.name : "Aucune mangeoire"} */}
                {user?.email?.split("@")[0]}
              </Text>
              <Text style={styles.usernameText}>
                {/* {user?.email?.split("@")[0]} */}
                Paramètres
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            {/* <TouchableOpacity
              style={styles.addButton}
              // onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity> */}
            <SignOutButton />
          </View>
        </View>

        {/* Menu des paramètres */}
        <Text style={styles.sectionTitle}>
          Configuration de l&apos;appareil
        </Text>

        <Card style={styles.balanceCard}>
          {/* <Text style={styles.sectionTitle}>Configuration de l&apos;appareil</Text> */}
          {settingsMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={sstyles.menuItem}
              onPress={item.onPress}
            >
              <View style={sstyles.menuIcon}>
                <Ionicons name={item.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={sstyles.menuContent}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionCategory}>{item.subtitle}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={CColors.light.icon}
              />
            </TouchableOpacity>
          ))}
        </Card>
        <Text style={styles.sectionTitle}>À propos</Text>

        {/* Informations système */}
        <Card style={styles.balanceCard}>
          {/* <Text style={styles.sectionTitle}>Informations système</Text> */}
          <View style={sstyles.systemInfo}>
            <View style={sstyles.systemRow}>
              <Text style={styles.transactionCategory}>Version de l&apos;app:</Text>
              <Text style={styles.transactionTitle}>1.0.0</Text>
            </View>
            <View style={sstyles.systemRow}>
              <Text style={styles.transactionCategory}>ESP32 connecté:</Text>
              <Text
                style={[styles.transactionTitle, { color: CColors.light.success }]}
              >
                En ligne
              </Text>
            </View>
            <View style={sstyles.systemRow}>
              <Text style={styles.transactionCategory}>Dernière sync:</Text>
              <Text style={styles.transactionTitle}>
                {new Date().toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </Card>
      </View>
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
