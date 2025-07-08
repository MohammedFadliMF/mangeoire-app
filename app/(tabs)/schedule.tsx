import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { STYLES } from "@/assets/styles/create.styles";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { COLORS } from "@/constants/colors";
import { useDevice } from "@/hooks/useDevice";
import { DeviceSchedule } from "@/types/index";
import { schedulesApi, supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/home.styles";
import { CColors } from "../../constants/CColors";

export default function StatisticsScreen() {
  const { selectedDevice } = useDevice();

  const [schedules, setSchedules] = useState<DeviceSchedule[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    time: "",
  });
  useEffect(() => {
    fetchSchedules();
  }, [selectedDevice?.id]);

  const fetchSchedules = async () => {
    if (!selectedDevice?.id) {
      Alert.alert(
        "Erreur",
        "Aucun appareil sélectionné pour récupérer les programmations."
      );
      return;
    }

    try {
      const data = await schedulesApi.getDeviceSchedules(selectedDevice.id);
      setSchedules(data);
    } catch (error) {
      console.error("Erreur lors du chargement des programmations :", error);
    }
  };

  const toggleSchedule = async (id: string) => {
    // Trouver la programmation concernée
    const scheduleToToggle = schedules.find((s) => s.id === id);
    if (!scheduleToToggle) return;

    const updatedEnabled = !scheduleToToggle.enabled;

    // 🔧 Mise à jour dans Supabase
    const { error } = await supabase
      .from("device_schedules")
      .update({ enabled: updatedEnabled })
      .eq("id", id);

    if (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour la programmation.");
      return;
    }

    // ✅ Mise à jour de l’état local
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, enabled: updatedEnabled } : schedule
      )
    );
  };

  const deleteSchedule = (id: string) => {
    Alert.alert(
      "Supprimer la programmation",
      "Êtes-vous sûr de vouloir supprimer cette programmation ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const success = await schedulesApi.deleteSchedule(id);
            if (success) {
              fetchSchedules(); // recharge toutes les données à jour
            } else {
              Alert.alert(
                "Erreur",
                "La suppression a échoué. Veuillez réessayer."
              );
            }
          },
        },
      ]
    );
  };

  const addSchedule = async () => {
    if (!newSchedule.name || !newSchedule.time) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    // const schedule: DeviceSchedule = {
    //   id: Date.now().toString(),
    //   name: newSchedule.name,
    //   time: newSchedule.time,
    //   enabled: true,
    // };

    // setSchedules([...schedules, schedule]);
    // setNewSchedule({ name: "", time: "" });
    // setModalVisible(false);

    // 🔧 Appel API pour créer la programmation côté Supabase
    if (!selectedDevice?.id) {
      Alert.alert("Erreur", "Aucun appareil sélectionné.");
      return;
    }
    const success = await schedulesApi.createSchedule(
      selectedDevice.id,
      newSchedule.name,
      newSchedule.time
    );

    if (success) {
      Alert.alert("Succès", "Programmation ajoutée avec succès !");
      setNewSchedule({ name: "", time: "" });
      setModalVisible(false);

      // 🔁 Recharger les programmations depuis la base si nécessaire

      fetchSchedules();
    } else {
      Alert.alert("Erreur", "Échec lors de l'ajout de la programmation.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            {/* <Image
                    source={require("../../assets/images/logo.png")}
                    style={styles.headerLogo}
                    resizeMode="contain"
                  /> */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                {selectedDevice ? selectedDevice.name : "Aucune mangeoire"}
              </Text>
              <Text style={styles.usernameText}>
                {/* {user?.email?.split("@")[0]} */}
                Programmation
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Liste des programmations */}
        {schedules.map((schedule) => (
          <View key={schedule.id} style={styles.transactionCard}>
            <View style={styles.transactionContent}>
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionTitle}>{schedule.name}</Text>
                <Text style={styles.transactionDate}>{schedule.time}</Text>
              </View>

              <View style={styles.transactionRight}>
                <Switch
                  value={schedule.enabled}
                  onValueChange={() => toggleSchedule(schedule.id)}
                  trackColor={{
                    false: CColors.light.border,
                    true: COLORS.income,
                  }}
                  thumbColor={schedule.enabled ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteSchedule(schedule.id)}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Informations */}
        <Card style={styles.balanceCard}>
          <Text style={styles.transactionTitle}>🛑 Informations</Text>
          <Text style={styles.transactionCategory}>
            • Les programmations activées déclencheront automatiquement la
            distribution
          </Text>
          <Text style={styles.transactionCategory}>
            • La distribution n&apos;a lieu que si un récipient est détecté
          </Text>
        </Card>

        {/* Modal d'ajout */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={sstyles.modalOverlay}>
            <View style={sstyles.modalContent}>
              <Text style={sstyles.modalTitle}>Nouvelle programmation</Text>

              <Input
                label="Nom de la programmation"
                value={newSchedule.name}
                onChangeText={(text) =>
                  setNewSchedule({ ...newSchedule, name: text })
                }
                placeholder="Nom de la programmation"
              />

              <Input
                label="Heure (HH:MM)"
                value={newSchedule.time}
                onChangeText={(text) =>
                  setNewSchedule({ ...newSchedule, time: text })
                }
                placeholder="Heure (HH:MM)"
                // keyboardType="numeric"
              />

              <View style={sstyles.modalActions}>
                <TouchableOpacity
                  style={[STYLES.typeButton, !STYLES.typeButtonActive]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text
                    style={[
                      STYLES.typeButtonText,
                      !STYLES.typeButtonTextActive,
                    ]}
                  >
                    Annuler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[STYLES.typeButton, STYLES.typeButtonActive]}
                  onPress={addSchedule}
                >
                  <Text
                    style={[STYLES.typeButtonText, STYLES.typeButtonTextActive]}
                  >
                    Créer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  scheduleCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: "500",
    color: CColors.light.text,
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 24,
    fontWeight: "bold",
    color: CColors.light.tint,
  },
  scheduleActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
  },
  addCard: {
    margin: 16,
  },
  infoCard: {
    margin: 16,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: CColors.light.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: CColors.light.icon,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: CColors.light.background,
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
  },
});
