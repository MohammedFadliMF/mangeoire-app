import { useState } from "react";
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

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Schedule } from "@/types/index";
import { Ionicons } from "@expo/vector-icons";
import { CColors } from "../../constants/CColors";

export default function StatisticsScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: "1", time: "08:00", enabled: true, name: "Distribution matinale" },
    { id: "2", time: "12:00", enabled: false, name: "Distribution midi" },
    { id: "3", time: "18:00", enabled: true, name: "Distribution du soir" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    time: "",
  });

  const toggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
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
          onPress: () => {
            setSchedules(schedules.filter((schedule) => schedule.id !== id));
          },
        },
      ]
    );
  };

  const addSchedule = () => {
    if (!newSchedule.name || !newSchedule.time) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const schedule: Schedule = {
      id: Date.now().toString(),
      name: newSchedule.name,
      time: newSchedule.time,
      enabled: true,
    };

    setSchedules([...schedules, schedule]);
    setNewSchedule({ name: "", time: "" });
    setModalVisible(false);
  };

  return (
    <ScrollView style={sstyles.container}>
      <View style={sstyles.header}>
        <Text style={sstyles.title}>⏰ Programmation</Text>
        <Text style={sstyles.subtitle}>Gérez les horaires automatiques</Text>
      </View>

      {/* Liste des programmations */}
      {schedules.map((schedule) => (
        <Card key={schedule.id} style={sstyles.scheduleCard}>
          <View style={sstyles.scheduleHeader}>
            <View style={sstyles.scheduleInfo}>
              <Text style={sstyles.scheduleName}>{schedule.name}</Text>
              <Text style={sstyles.scheduleTime}>{schedule.time}</Text>
            </View>
            <Switch
              value={schedule.enabled}
              onValueChange={() => toggleSchedule(schedule.id)}
              trackColor={{
                false: CColors.light.border,
                true: CColors.light.tint,
              }}
              thumbColor={schedule.enabled ? "#fff" : "#f4f3f4"}
            />
          </View>

          <View style={sstyles.scheduleActions}>
            <TouchableOpacity
              style={sstyles.actionButton}
              onPress={() => deleteSchedule(schedule.id)}
            >
              <Ionicons name="trash" size={20} color={CColors.light.error} />
              <Text
                style={[sstyles.actionText, { color: CColors.light.error }]}
              >
                Supprimer
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      {/* Bouton d'ajout */}
      <Card style={sstyles.addCard}>
        <Button
          title="Ajouter une programmation"
          onPress={() => setModalVisible(true)}
          variant="secondary"
        />
      </Card>

      {/* Informations */}
      <Card style={sstyles.infoCard}>
        <Text style={sstyles.infoTitle}>ℹ️ Informations</Text>
        <Text style={sstyles.infoText}>
          • Les programmations activées déclencheront automatiquement la
          distribution
        </Text>
        <Text style={sstyles.infoText}>
          • La distribution n&apos;a lieu que si un récipient est détecté
        </Text>
        <Text style={sstyles.infoText}>
          • Vous pouvez activer/désactiver chaque programmation individuellement
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
              placeholder="Ex: Distribution matinale"
            />

            <Input
              label="Heure (HH:MM)"
              value={newSchedule.time}
              onChangeText={(text) =>
                setNewSchedule({ ...newSchedule, time: text })
              }
              placeholder="Ex: 08:00"
              keyboardType="numeric"
            />

            <View style={sstyles.modalActions}>
              <Button
                title="Annuler"
                onPress={() => setModalVisible(false)}
                variant="secondary"
                style={sstyles.modalButton}
              />
              <Button
                title="Ajouter"
                onPress={addSchedule}
                style={sstyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 20,
    fontWeight: "bold",
    color: CColors.light.text,
    marginBottom: 24,
    textAlign: "center",
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
