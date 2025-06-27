import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../assets/styles/home.styles";
import { SignOutButton } from "../../components/SignOutButton";
import { authService } from "../../services/auth";
import { AuthContext } from "../_layout";

import Card from "@/components/ui/Card";
import { esp32Api } from "@/utils/supabase";
import { LineChart } from "react-native-chart-kit";
import { CColors } from "../../constants/CColors";

const screenWidth = Dimensions.get("window").width;
export default function StatisticsScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await esp32Api.getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    backgroundColor: CColors.light.background,
    backgroundGradientFrom: CColors.light.background,
    backgroundGradientTo: CColors.light.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: CColors.light.tint,
    },
  };

  const weightData = {
    labels: history
      .map((entry) => new Date(entry.date).getDate().toString())
      .reverse(),
    datasets: [
      {
        data: history.map((entry) => entry.weight).reverse(),
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const distributionData = {
    labels: history
      .map((entry) => new Date(entry.date).getDate().toString())
      .reverse(),
    datasets: [
      {
        data: history.map((entry) => entry.distributions).reverse(),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const totalDistributions = history.reduce(
    (sum, entry) => sum + entry.distributions,
    0
  );
  const averageWeight =
    history.reduce((sum, entry) => sum + entry.weight, 0) / history.length || 0;
  const lastWeekConsumption = history
    .slice(0, 7)
    .reduce((sum, entry) => sum + entry.distributions, 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement des statistiques...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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

        {/* Résumé */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalDistributions}</Text>
            <Text style={styles.summaryLabel}>Distributions totales</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{averageWeight.toFixed(0)}g</Text>
            <Text style={styles.summaryLabel}>Poids moyen</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{lastWeekConsumption}</Text>
            <Text style={styles.summaryLabel}>Cette semaine</Text>
          </Card>
        </View>

        {/* Graphique du poids */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Évolution du poids (g)</Text>
          <LineChart
            data={weightData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>

        {/* Graphique des distributions */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Nombre de distributions</Text>
          <LineChart
            data={distributionData}
            width={screenWidth - 64}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </Card>

        {/* Historique détaillé */}
        <Card style={styles.historyCard}>
          <Text style={styles.chartTitle}>Historique détaillé</Text>
          {history.map((entry, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyDate}>
                {new Date(entry.date).toLocaleDateString("fr-FR")}
              </Text>
              <View style={styles.historyData}>
                <Text style={styles.historyWeight}>
                  {entry.weight.toFixed(0)}g
                </Text>
                <Text style={styles.historyDistributions}>
                  {entry.distributions} distributions
                </Text>
              </View>
            </View>
          ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: CColors.light.tint,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: CColors.light.icon,
    textAlign: "center",
  },
  chartCard: {
    margin: 16,
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: CColors.light.text,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  historyCard: {
    margin: 16,
    marginTop: 8,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CColors.light.border,
  },
  historyDate: {
    fontSize: 16,
    color: CColors.light.text,
  },
  historyData: {
    alignItems: "flex-end",
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: "500",
    color: CColors.light.text,
  },
  historyDistributions: {
    fontSize: 14,
    color: CColors.light.icon,
  },
});
