import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { styles } from "../../assets/styles/home.styles";
import { AuthContext } from "../_layout";

import Card from "@/components/ui/Card";
import { COLORS } from "@/constants/colors";
import { useDevice } from "@/hooks/useDevice";
import { esp32Api } from "@/utils/supabase";
import { LineChart } from "react-native-chart-kit";
import { CColors } from "../../constants/CColors";

const screenWidth = Dimensions.get("window").width;
export default function StatisticsScreen() {
  const { selectedDevice } = useDevice();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { user, session } = useContext(AuthContext);

  useEffect(() => {
    if (selectedDevice?.id) {
      setLoading(true);
      loadHistory();
    }
  }, [selectedDevice?.id]);

  const loadHistory = async () => {
    try {
      const data = await esp32Api.getHistory(selectedDevice?.id);

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
      r: "2",
      strokeWidth: "0.5",
      stroke: CColors.light.tint,
    },
  };

  const weightData = {
    labels:
      history.length > 0
        ? history
            .map((entry) => new Date(entry.date).getDate().toString())
            .reverse()
        : [""],
    datasets: [
      {
        data:
          history.length > 0
            ? history.map((entry) => entry.weight).reverse()
            : [0],
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const distributionData = {
    labels:
      history.length > 0
        ? history
            .map((entry) => new Date(entry.date).getDate().toString())
            .reverse()
        : [""],
    datasets: [
      {
        data:
          history.length > 0
            ? history.map((entry) => entry.distribution_count).reverse()
            : [0],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const totalDistributions =
    history.length > 0
      ? history.reduce((sum, entry) => sum + entry.distribution_count, 0)
      : 0;

  const averageWeight =
    history.length > 0
      ? history.reduce((sum, entry) => sum + entry.weight, 0) / history.length
      : 0;
  const lastWeekConsumption =
    history.length > 0
      ? history
          .slice(0, 7)
          .reduce((sum, entry) => sum + entry.distribution_count, 0)
      : 0;
  if (loading) {
    return (
      // <View style={styles.loadingContainer}>
      //   <Text>Chargement des statistiques...</Text>
      // </View>
      <></>
    );
  }
  if (!selectedDevice?.id) {
    return (
      <View style={sstyles.loadingContainer}>
        <Text>Sélectionnez un appareil pour voir les statistiques.</Text>
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
                Statistiques
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          {/* <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View> */}
        </View>

        {/* Résumé */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Distributions totales</Text>
          <Text style={styles.balanceAmount}>{totalDistributions}</Text>
          <View style={styles.balanceStats}>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Poids moyen</Text>
              <Text
                style={[styles.balanceStatAmount, { color: COLORS.income }]}
              >
                {averageWeight.toFixed(0)}g
              </Text>
            </View>
            <View style={[styles.balanceStatItem, styles.statDivider]}></View>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Cette semaine</Text>
              <Text
                style={[styles.balanceStatAmount, { color: COLORS.expense }]}
              >
                {lastWeekConsumption}
              </Text>
            </View>
          </View>

          {/* <Card style={sstyles.summaryCard}>
            <Text style={sstyles.summaryValue}>{totalDistributions}</Text>
            <Text style={sstyles.summaryLabel}>Distributions totales</Text>
          </Card>
          <Card style={sstyles.summaryCard}>
            <Text style={sstyles.summaryValue}>
              {averageWeight.toFixed(0)}g
            </Text>
            <Text style={sstyles.summaryLabel}>Poids moyen</Text>
          </Card>
          <Card style={sstyles.summaryCard}>
            <Text style={sstyles.summaryValue}>{lastWeekConsumption}</Text>
            <Text style={sstyles.summaryLabel}>Cette semaine</Text>
          </Card> */}
        </View>

        {/* Graphique du poids */}
        <Text style={styles.sectionTitle}>Évolution du poids (g)</Text>

        {/* <Text style={sstyles.chartTitle}>Évolution du poids (g)</Text> */}
        <View style={styles.balanceCard}>
          <LineChart
            data={weightData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={sstyles.chart}
          />
        </View>

        {/* Graphique des distributions */}
        <Text style={styles.sectionTitle}>Nombre de distributions</Text>

        <Card style={styles.balanceCard}>
          {/* <Text style={sstyles.chartTitle}>Nombre de distributions</Text> */}
          <LineChart
            data={distributionData}
            width={screenWidth - 64}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            }}
            bezier
            style={sstyles.chart}
          />
        </Card>

        {/* Historique détaillé */}
        {/* <Card style={sstyles.historyCard}> */}
        {/* </Card> */}
        <Text style={styles.sectionTitle}>Historique détaillé</Text>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={history}
        // keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View style={styles.transactionContent}>
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionTitle}>
                  {new Date(item.timestamp).toLocaleDateString("fr-FR")}
                </Text>
              </View>
              <View style={[styles.balanceStatItem, styles.statDivider]}></View>

              <View style={styles.transactionRight}>
                <Text
                  style={[styles.transactionAmount, { color: COLORS.income }]}
                >
                  {item.weight.toFixed(0)}g
                </Text>
                <Text style={styles.transactionDate}>
                  {item.distribution_count} distributions
                </Text>
              </View>
            </View>
          </View>
        )}
      />
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
    // marginVertical: 8,
    // borderRadius: 16,
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
