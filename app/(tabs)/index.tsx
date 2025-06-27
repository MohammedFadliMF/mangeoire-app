import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { CColors } from "../../constants/CColors";
import { esp32Api } from '@/utils/supabase'
import type { SensorData } from '@/types/index'

export default function DashboardScreen() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadSensorData = async () => {
    try {
      const data = await esp32Api.getSensorData()
      setSensorData(data)
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les données')
    }
  }

  const handleTriggerServo = async () => {
    setLoading(true)
    try {
      const result = await esp32Api.triggerServo()
      Alert.alert('Succès', result.message)
      // Recharger les données après distribution
      await loadSensorData()
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'activer le servo')
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadSensorData()
    setRefreshing(false)
  }

  useEffect(() => {
    loadSensorData()
    // Actualiser toutes les 30 secondes
    const interval = setInterval(loadSensorData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getWeightStatus = (weight: number) => {
    if (weight < 50) return { status: 'Vide', color: CColors.light.error, icon: 'alert-circle' }
    if (weight < 200) return { status: 'Faible', color: CColors.light.warning, icon: 'warning' }
    return { status: 'Pleine', color: CColors.light.success, icon: 'checkmark-circle' }
  }

  return (
    <ScrollView
      style={sstyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={sstyles.header}>
        <Text style={sstyles.title}>🐓 Mangeoire Automatique</Text>
        <Text style={sstyles.subtitle}>Tableau de bord</Text>
      </View>

      {sensorData && (
        <>
          <Card style={sstyles.statusCard}>
            <View style={sstyles.statusHeader}>
              <Text style={sstyles.cardTitle}>État actuel</Text>
              <Text style={sstyles.lastUpdate}>
                Dernière mise à jour: {new Date(sensorData.lastUpdate).toLocaleTimeString()}
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
                <Text style={[sstyles.statusValue, { color: getWeightStatus(sensorData.weight).color }]}>
                  {getWeightStatus(sensorData.weight).status}
                </Text>
                <Text style={sstyles.statusDetail}>
                  {sensorData.weight.toFixed(1)} g
                </Text>
              </View>

              <View style={sstyles.statusItem}>
                <View style={sstyles.statusIcon}>
                  <Ionicons
                    name={sensorData.isContainerPresent ? 'cube' : 'cube-outline'}
                    size={32}
                    color={sensorData.isContainerPresent ? CColors.light.success : CColors.light.error}
                  />
                </View>
                <Text style={sstyles.statusLabel}>Récipient</Text>
                <Text style={[
                  sstyles.statusValue,
                  { color: sensorData.isContainerPresent ? CColors.light.success : CColors.light.error }
                ]}>
                  {sensorData.isContainerPresent ? 'Présent' : 'Absent'}
                </Text>
                <Text style={sstyles.statusDetail}>
                  Capteur IR
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
                loading={loading}
                style={sstyles.actionButton}
              />
              <Button
                title="Actualiser"
                onPress={loadSensorData}
                variant="secondary"
                style={sstyles.actionButton}
              />
            </View>
          </Card>

          <Card>
            <Text style={sstyles.cardTitle}>Informations système</Text>
            <View style={sstyles.infoRow}>
              <Text style={sstyles.infoLabel}>Poids actuel:</Text>
              <Text style={sstyles.infoValue}>{sensorData.weight.toFixed(1)} g</Text>
            </View>
            <View style={sstyles.infoRow}>
              <Text style={sstyles.infoLabel}>Récipient:</Text>
              <Text style={sstyles.infoValue}>
                {sensorData.isContainerPresent ? '✅ Détecté' : '❌ Non détecté'}
              </Text>
            </View>
            <View style={sstyles.infoRow}>
              <Text style={sstyles.infoLabel}>État du servo:</Text>
              <Text style={sstyles.infoValue}>🔄 Prêt</Text>
            </View>
          </Card>
        </>
      )}
    </ScrollView>
  )
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