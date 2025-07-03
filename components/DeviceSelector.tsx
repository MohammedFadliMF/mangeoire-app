import { STYLES } from "@/assets/styles/create.styles";
import { CColors } from "@/constants/CColors";

import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { Device } from "@/types/index";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface DeviceSelectorProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
  onCreateDevice: (name: string, location?: string) => Promise<boolean>;
  loading?: boolean;
}

export default function DeviceSelector({
  devices,
  selectedDevice,
  onSelectDevice,
  onCreateDevice,
  loading = false,
}: DeviceSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceLocation, setNewDeviceLocation] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateDevice = async () => {
    if (!newDeviceName.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom pour la mangeoire");
      return;
    }

    setCreating(true);
    try {
      const success = await onCreateDevice(
        newDeviceName.trim(),
        newDeviceLocation.trim() || undefined
      );
      if (success) {
        setNewDeviceName("");
        setNewDeviceLocation("");
        setCreateModalVisible(false);
        Alert.alert("Succès", "Mangeoire créée avec succès");
      } else {
        Alert.alert("Erreur", "Impossible de créer la mangeoire");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <View style={styles.header}>
        {/* <View style={styles.headerLeft}> */}
        <View style={styles.headerLeft}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              {selectedDevice ? selectedDevice.name : "Aucune mangeoire"}
            </Text>
            {selectedDevice && (
              <Text style={styles.usernameText}>
                {selectedDevice.location || "Emplacement non défini"}
              </Text>
            )}
          </View>

          {/* <Text style={sstyles.deviceName}>
            {selectedDevice ? selectedDevice.name : "Aucune mangeoire"}
          </Text>
          {selectedDevice && (
            <Text style={sstyles.deviceLocation}>
              📍 {selectedDevice.location || "Emplacement non défini"}
            </Text>
          )} */}
        </View>
        {/* <Ionicons name="chevron-down" size={20} color={CColors.light.icon} /> */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
            disabled={loading}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </View>

      {/* Modal de sélection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={sstyles.modalOverlay}>
          <View style={sstyles.modalContent}>
            <View style={sstyles.modalHeader}>
              <Text style={sstyles.modalTitle}>Choisir une mangeoire</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={sstyles.closeButton}
              >
                <Ionicons name="close" size={24} color={CColors.light.icon} />
              </TouchableOpacity>
            </View>

            <ScrollView style={sstyles.deviceList}>
              {devices.map((device) => (
                <TouchableOpacity
                  key={device.id}
                  style={[
                    sstyles.deviceItem,
                    selectedDevice?.id === device.id &&
                      sstyles.selectedDeviceItem,
                  ]}
                  onPress={() => {
                    onSelectDevice(device);
                    setModalVisible(false);
                  }}
                >
                  <View style={sstyles.deviceItemContent}>
                    <Text style={sstyles.deviceItemName}>{device.name}</Text>
                    <Text style={sstyles.deviceItemCode}>
                      Code: {device.device_code}
                    </Text>
                    {device.location && (
                      <Text style={sstyles.deviceItemLocation}>
                        📍 {device.location}
                      </Text>
                    )}
                  </View>
                  {selectedDevice?.id === device.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={CColors.light.success}
                    />
                  )}
                </TouchableOpacity>
              ))}

              {devices.length === 0 && (
                <View style={sstyles.emptyState}>
                  <Text style={sstyles.emptyText}>
                    Aucune mangeoire trouvée
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={sstyles.modalActions}>
              <Button
                title="Add"
                onPress={() => {
                  setModalVisible(false);
                  setCreateModalVisible(true);
                }}
                style={sstyles.typeButton}
              />
            </View>
            {/* <TouchableOpacity
              style={[STYLES.typeButton, STYLES.typeButtonActive]}
              onPress={() => {
                setModalVisible(false);
                setCreateModalVisible(true);
              }}
            >  
              <Ionicons
                name="share"
                size={22}
                color={COLORS.white}
                style={STYLES.typeIcon}
              />
              <Text
                style={[STYLES.typeButtonText, STYLES.typeButtonTextActive]}
              >
                Distribuer
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>

      {/* Modal de création */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={sstyles.modalOverlay}>
          <View style={sstyles.modalContent}>
            {/* <View style={sstyles.modalHeader}> */}
            <Text style={sstyles.modalTitle}>Nouvelle mangeoire</Text>
            {/* </View> */}

            <Input
              label="Nom de la mangeoire"
              value={newDeviceName}
              onChangeText={setNewDeviceName}
              placeholder="Nom de la mangeoire"
            />

            <Input
              label="Emplacement (optionnel)"
              value={newDeviceLocation}
              onChangeText={setNewDeviceLocation}
              placeholder="Emplacement (Jardin,Terrasse)"
            />

            <View style={sstyles.createInfo}>
              <Text style={styles.transactionCategory}>
                ℹ️ Un code unique sera généré automatiquement pour votre
                mangeoire. Vous devrez configurer ce code dans votre ESP32.
              </Text>
            </View>

            <View style={sstyles.modalActions}>
              <TouchableOpacity
                style={[STYLES.typeButton, !STYLES.typeButtonActive]}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text
                  style={[STYLES.typeButtonText, !STYLES.typeButtonTextActive]}
                >
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[STYLES.typeButton, STYLES.typeButtonActive]}
                onPress={handleCreateDevice}
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
    </>
  );
}

const sstyles = StyleSheet.create({
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.primary,
  },
  selector: {
    backgroundColor: CColors.light.background,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: CColors.light.text,
    marginBottom: 4,
  },
  deviceLocation: {
    fontSize: 14,
    color: CColors.light.icon,
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
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  deviceList: {
    maxHeight: 300,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: CColors.light.card,
  },
  selectedDeviceItem: {
    backgroundColor: CColors.light.tint + "20",
    borderWidth: 1,
    borderColor: CColors.light.tint,
  },
  deviceItemContent: {
    flex: 1,
  },
  deviceItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: CColors.light.text,
    marginBottom: 4,
  },
  deviceItemCode: {
    fontSize: 12,
    color: CColors.light.icon,
    marginBottom: 2,
  },
  deviceItemLocation: {
    fontSize: 14,
    color: CColors.light.icon,
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: CColors.light.icon,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
  },
  createInfo: {
    // backgroundColor: CColors.light.card,
    padding: 6,
    borderRadius: 8,
    // marginVertical: 4,
  },
  createInfoText: {
    fontSize: 14,
    color: CColors.light.icon,
    lineHeight: 20,
  },
});
