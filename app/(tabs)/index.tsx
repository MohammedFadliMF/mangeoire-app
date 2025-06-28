import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRealtimeSensorData } from "@/hooks/useRealtimeSensorData";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CColors } from "../../constants/CColors";

export default function DashboardScreen() {
  const { sensorData, loading, error, isConnected, sendCommand, refreshData } =
    useRealtimeSensorData();

  const [commandLoading, setCommandLoading] = useState(false);

  const handleTriggerServo = async () => {
    setCommandLoading(true);
    try {
      const success = await sendCommand("DISTRIBUTE");
      if (success) {
        Alert.alert("✅ Succès", "Commande de distribution envoyée");
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
    const success = await sendCommand("CALIBRATE");
    if (success) {
      Alert.alert("✅ Succès", "Calibration demandée");
    }
  };

  const getWeightStatus = (weight: number) => {
    if (weight < 50)
      return {
        status: "Vide",
        color: CColors.light.error,
        icon: "alert-circle",
      };
    if (weight < 200)
      return {
        status: "Faible",
        color: CColors.light.warning,
        icon: "warning",
      };
    return {
      status: "Pleine",
      color: CColors.light.success,
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

  if (error) {
    return (
      <View style={sstyles.errorContainer}>
        <Ionicons name="warning" size={48} color={CColors.light.error} />
        <Text style={sstyles.errorText}>Erreur de connexion</Text>
        <Text style={sstyles.errorSubtext}>{error}</Text>
        <Button title="Réessayer" onPress={refreshData} />
      </View>
    );
  }

  return (
    <ScrollView
      style={sstyles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshData} />
      }
    >
      <View style={sstyles.header}>
        <Text style={sstyles.title}>🐓 Mangeoire Automatique</Text>
        <Text style={sstyles.subtitle}>Tableau de bord</Text>

        {/* Indicateur de connexion */}
        <View style={sstyles.connectionStatus}>
          <View
            style={[
              sstyles.connectionDot,
              {
                backgroundColor: isConnected
                  ? CColors.light.success
                  : CColors.light.error,
              },
            ]}
          />
          <Text style={sstyles.connectionText}>
            {isConnected ? "Connecté" : "Déconnecté"}
          </Text>
        </View>
      </View>

      {sensorData && (
        <>
          <Card style={sstyles.statusCard}>
            <View style={sstyles.statusHeader}>
              <Text style={sstyles.cardTitle}>État actuel</Text>
              <Text style={sstyles.lastUpdate}>
                Dernière mise à jour: {formatLastUpdate(sensorData.timestamp)}
              </Text>
            </View>

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
                      sensorData.is_container_present ? "cube" : "cube-outline"
                    }
                    size={32}
                    color={
                      sensorData.is_container_present
                        ? CColors.light.success
                        : CColors.light.error
                    }
                  />
                </View>
                <Text style={sstyles.statusLabel}>Récipient</Text>
                <Text
                  style={[
                    sstyles.statusValue,
                    {
                      color: sensorData.is_container_present
                        ? CColors.light.success
                        : CColors.light.error,
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
                        ? CColors.light.warning
                        : CColors.light.success
                    }
                  />
                </View>
                <Text style={sstyles.statusLabel}>Servo</Text>
                <Text
                  style={[
                    sstyles.statusValue,
                    {
                      color: sensorData.servo_active
                        ? CColors.light.warning
                        : CColors.light.success,
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

          <Card>
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
          </Card>

          <Card>
            <Text style={sstyles.cardTitle}>Informations système</Text>
            <View style={sstyles.infoRow}>
              <Text style={sstyles.infoLabel}>Poids actuel:</Text>
              <Text style={sstyles.infoValue}>
                {sensorData.weight.toFixed(1)} g
              </Text>
            </View>
            <View style={sstyles.infoRow}>
              <Text style={sstyles.infoLabel}>Récipient:</Text>
              <Text style={sstyles.infoValue}>
                {sensorData.is_container_present
                  ? "✅ Détecté"
                  : "❌ Non détecté"}
              </Text>
            </View>
            <View style={sstyles.infoRow}>
              <Text style={sstyles.infoLabel}>Distributions totales:</Text>
              <Text style={sstyles.infoValue}>
                {sensorData.distribution_count}
              </Text>
            </View>
            <View style={sstyles.infoRow}>
              <Text style={sstyles.infoLabel}>État du servo:</Text>
              <Text style={sstyles.infoValue}>
                {sensorData.servo_active ? "🔄 En cours" : "✅ Prêt"}
              </Text>
            </View>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const sstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CColors.light.card,
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
