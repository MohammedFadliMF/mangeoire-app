import { STYLES } from "@/assets/styles/create.styles";
import { styles } from "@/assets/styles/home.styles";
import DeviceSelector from "@/components/DeviceSelector";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { CColors } from "@/constants/CColors";
import { COLORS } from "@/constants/colors";
import { useDevice } from "@/hooks/useDevice";
import { useRealtimeSensorData } from "@/hooks/useRealtimeSensorData";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function DashboardScreen() {
  const {
    devices,
    selectedDevice,
    setSelectedDevice,
    loading: devicesLoading,
    createDevice,
  } = useDevice();

  const {
    sensorData,
    loading: sensorLoading,
    error,
    isConnected,
    sendCommand,
    refreshData,
  } = useRealtimeSensorData(selectedDevice?.id || null);

  const [commandLoading, setCommandLoading] = useState(false);

  const handleTriggerServo = async () => {
    if (!selectedDevice) {
      Alert.alert("Erreur", "Veuillez sélectionner une mangeoire");
      return;
    }

    setCommandLoading(true);
    try {
      const success = await sendCommand("DISTRIBUTE");
      if (success) {
        Alert.alert(
          "✅ Succès",
          "Commande de distribution envoyée à " + selectedDevice.name
        );
      } else {
        Alert.alert("❌ Erreur", "Impossible d'envoyer la commande");
      }
    } catch (error) {
      Alert.alert("❌ Erreur", "Problème de communication");
    } finally {
      setCommandLoading(false);
    }
  };

  const handleCalibrate = async () => {
    if (!selectedDevice) return;

    const success = await sendCommand("CALIBRATE");
    if (success) {
      Alert.alert(
        "✅ Succès",
        "Calibration demandée pour " + selectedDevice.name
      );
    }
  };

  const getWeightStatus = (weight: number) => {
    if (weight < 50)
      return {
        status: "Vide",
        color: COLORS.expense,
        icon: "alert-circle",
        // ? COLORS.income
        // : COLORS.expense
      };
    if (weight < 200)
      return {
        status: "Faible",
        color: CColors.light.warning,
        icon: "warning",
      };
    return {
      status: "Pleine",
      color: COLORS.income,
      icon: "checkmark-circle",
    };
  };

  const formatLastUpdate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `il y a ${diffInSeconds}s`;
    if (diffInSeconds < 3600)
      return `il y a ${Math.floor(diffInSeconds / 60)}min`;
    return date.toLocaleTimeString();
  };

  if (devicesLoading) {
    return (
      <View style={sstyles.loadingContainer}>
        <Text>Chargement de vos mangeoires...</Text>
      </View>
    );
  }

  if (devices.length === 0) {
    return (
      <View style={sstyles.emptyContainer}>
        <Ionicons name="home" size={64} color={CColors.light.icon} />
        <Text style={sstyles.emptyTitle}>Aucune mangeoire</Text>
        <Text style={sstyles.emptyText}>
          Créez votre première mangeoire pour commencer
        </Text>
        <Button
          title="Créer une mangeoire"
          onPress={() => createDevice("Ma première mangeoire", "Jardin")}
          style={sstyles.createButton}
        />
      </View>
    );
  }

  // if (error) {
  //   return (
  //     <View style={sstyles.errorContainer}>
  //       <Ionicons name="warning" size={48} color={CColors.light.error} />
  //       <Text style={sstyles.errorText}>Erreur de connexion</Text>
  //       <Text style={sstyles.errorSubtext}>{error}</Text>
  //       <Button title="Réessayer" onPress={refreshData} />
  //     </View>
  //   );
  // }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={sensorLoading} onRefresh={refreshData} />
      }
    >
      <View style={styles.content}>
       
        {/* Sélecteur de mangeoire */}
        <DeviceSelector
          devices={devices}
          selectedDevice={selectedDevice}
          onSelectDevice={setSelectedDevice}
          onCreateDevice={createDevice}
          loading={devicesLoading}
        />

        {selectedDevice && !sensorData && !sensorLoading && (
          <Card style={sstyles.noDataCard}>
            <View style={sstyles.noDataContent}>
              <Ionicons
                name="wifi-outline"
                size={48}
                color={CColors.light.icon}
              />
              <Text style={sstyles.noDataTitle}>En attente de données</Text>
              <Text style={sstyles.noDataText}>
                Votre mangeoire &quot;{selectedDevice.name}&quot; n&apos;a pas
                encore envoyé de données.
              </Text>
              <Text style={sstyles.deviceCodeText}>
                Code de la mangeoire: {selectedDevice.device_code}
              </Text>
              <Button
                title="Actualiser"
                onPress={refreshData}
                variant="secondary"
                style={sstyles.refreshButton}
              />
            </View>
          </Card>
        )}

        {sensorData && selectedDevice && (
          <>
            <Card style={styles.balanceCard}>
              {/* <View style={sstyles.statusHeader}>
                <Text style={sstyles.cardTitle}>
                  État de {selectedDevice.name}
                </Text>
                <Text style={sstyles.lastUpdate}>
                  Dernière mise à jour: {formatLastUpdate(sensorData.timestamp)}
                </Text>
              </View> */}
              <Text style={styles.balanceTitle}>État mangeoire</Text>

              <View style={sstyles.statusGrid}>
                <View style={sstyles.statusItem}>
                  <View style={sstyles.statusIcon}>
                    <Ionicons
                      name={getWeightStatus(sensorData.weight).icon as any}
                      size={32}
                      color={getWeightStatus(sensorData.weight).color}
                    />
                  </View>
                  <Text style={sstyles.statusLabel}>Réserve</Text>
                  <Text
                    style={[
                      sstyles.statusValue,
                      { color: getWeightStatus(sensorData.weight).color },
                    ]}
                  >
                    {getWeightStatus(sensorData.weight).status}
                  </Text>
                  <Text style={sstyles.statusDetail}>
                    {sensorData.weight.toFixed(1)} g
                  </Text>
                </View>

                <View style={sstyles.statusItem}>
                  <View style={sstyles.statusIcon}>
                    <Ionicons
                      name={
                        sensorData.is_container_present
                          ? "cube"
                          : "cube-outline"
                      }
                      size={32}
                      color={
                        sensorData.is_container_present
                          ? COLORS.income
                          : COLORS.expense
                      }
                    />
                  </View>
                  <Text style={sstyles.statusLabel}>Récipient</Text>
                  <Text
                    style={[
                      sstyles.statusValue,
                      {
                        color: sensorData.is_container_present
                          ? COLORS.income
                          : COLORS.expense,
                      },
                    ]}
                  >
                    {sensorData.is_container_present ? "Présent" : "Absent"}
                  </Text>
                  <Text style={sstyles.statusDetail}>Capteur IR</Text>
                </View>

                <View style={sstyles.statusItem}>
                  <View style={sstyles.statusIcon}>
                    <Ionicons
                      name={
                        sensorData.servo_active ? "refresh" : "checkmark-circle"
                      }
                      size={32}
                      color={
                        sensorData.servo_active
                          ? // ? CColors.light.warning
                            // : CColors.light.success
                            COLORS.income
                          : COLORS.expense
                      }
                    />
                  </View>
                  <Text style={sstyles.statusLabel}>Servo</Text>
                  <Text
                    style={[
                      sstyles.statusValue,
                      {
                        color: sensorData.servo_active
                          ? COLORS.income
                          : COLORS.expense,
                      },
                    ]}
                  >
                    {sensorData.servo_active ? "Actif" : "Prêt"}
                  </Text>
                  <Text style={sstyles.statusDetail}>
                    {sensorData.distribution_count} distributions
                  </Text>
                </View>
              </View>
            </Card>

            {/* <Card>
              <Text style={sstyles.cardTitle}>Actions rapides</Text>
              <View style={sstyles.actionButtons}>
                <Button
                  title="Distribuer maintenant"
                  onPress={handleTriggerServo}
                  loading={commandLoading}
                  disabled={sensorData.servo_active}
                  style={sstyles.actionButton}
                />
                <Button
                  title="Calibrer balance"
                  onPress={handleCalibrate}
                  variant="secondary"
                  style={sstyles.actionButton}
                />
              </View>
            </Card> */}
            <View style={styles.balanceCard}>
              <View style={STYLES.typeSelector}>
                <TouchableOpacity
                  style={[STYLES.typeButton, STYLES.typeButtonActive]}
                  onPress={handleTriggerServo}
                  disabled={sensorData.servo_active}
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
                </TouchableOpacity>

                <TouchableOpacity
                  style={[STYLES.typeButton, !STYLES.typeButtonActive]}
                  onPress={handleCalibrate}
                >
                  <Ionicons
                    name="options-outline"
                    size={22}
                    style={STYLES.typeIcon}
                  />
                  <Text
                    style={[
                      STYLES.typeButtonText,
                      !STYLES.typeButtonTextActive,
                    ]}
                  >
                    Calibrer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Informations système</Text>
            <Card style={styles.balanceCard}>
              <View style={sstyles.infoRow}>
                <Text style={styles.transactionTitle}>Mangeoire</Text>
                <Text style={styles.transactionCategory}>
                  {selectedDevice.name}
                </Text>
              </View>
              <View style={sstyles.infoRow}>
                <Text style={styles.transactionTitle}>Code device</Text>
                <Text style={styles.transactionCategory}>
                  {selectedDevice.device_code}
                </Text>
              </View>
              <View style={sstyles.infoRow}>
                <Text style={styles.transactionTitle}>Emplacement</Text>
                <Text style={styles.transactionCategory}>
                  {selectedDevice.location || "Non défini"}
                </Text>
              </View>
              <View style={sstyles.infoRow}>
                <Text style={styles.transactionTitle}>Poids actuel</Text>
                <Text style={styles.transactionCategory}>
                  {sensorData.weight.toFixed(1)} g
                </Text>
              </View>
              <View style={sstyles.infoRow}>
                <Text style={styles.transactionTitle}>Récipient</Text>
                <Text style={styles.transactionCategory}>
                  {sensorData.is_container_present ? "Détecté" : "Non détecté"}
                </Text>
              </View>
              <View style={sstyles.infoRow}>
                <Text style={styles.transactionTitle}>
                  Distributions totales
                </Text>
                <Text style={styles.transactionCategory}>
                  {sensorData.distribution_count}
                </Text>
              </View>
              <View style={sstyles.infoRow}>
                <Text style={styles.transactionTitle}>État du servo:</Text>
                <Text style={styles.transactionCategory}>
                  {sensorData.servo_active ? "En cours" : "Prêt"}
                </Text>
              </View>
            </Card>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const sstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CColors.light.card,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: CColors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: CColors.light.icon,
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    minWidth: 200,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: CColors.light.error,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: CColors.light.icon,
    textAlign: "center",
    marginBottom: 24,
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
    marginBottom: 12,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionText: {
    fontSize: 14,
    color: CColors.light.icon,
  },
  noDataCard: {
    margin: 16,
  },
  noDataContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: CColors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: CColors.light.icon,
    textAlign: "center",
    marginBottom: 16,
  },
  deviceCodeText: {
    fontSize: 12,
    color: CColors.light.tint,
    fontFamily: "monospace",
    backgroundColor: CColors.light.card,
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  refreshButton: {
    minWidth: 120,
  },
  statusCard: {
    margin: 16,
    marginBottom: 8,
  },
  statusHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: CColors.light.text,
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 12,
    color: CColors.light.icon,
  },
  statusGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statusItem: {
    alignItems: "center",
    flex: 1,
  },
  statusIcon: {
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: CColors.light.icon,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  statusDetail: {
    fontSize: 12,
    color: CColors.light.icon,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: CColors.light.border,
  },
  infoLabel: {
    fontSize: 16,
    color: CColors.light.text,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: CColors.light.text,
  },
});
