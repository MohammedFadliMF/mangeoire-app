import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://hkqvjmetsklsawwyjvap.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcXZqbWV0c2tsc2F3d3lqdmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODEyNjQsImV4cCI6MjA2NTc1NzI2NH0.SVCT4CwpBrWvLdlAriSo_jhqR2Aow3xpN6PTG0dITYU";

export const supabase = createClient(
  // Config.SUPABASE_URL as string,
  // Config.SUPABASE_ANON_KEY as string,
  supabaseUrl,
  supabaseAnonKey,

  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
// Types pour les données
export interface SensorDataRow {
  id: number;
  device_id: string;
  weight: number;
  is_container_present: boolean;
  servo_active: boolean;
  distribution_count: number;
  timestamp: string;
}

export interface DeviceCommand {
  device_id: string;
  command: string;
}

// 📡 API ESP32 avec Supabase temps réel
export const esp32Api = {
  // Obtenir les dernières données des capteurs
  async getLatestSensorData(
    deviceId: string = "mangeoire_01"
  ): Promise<SensorDataRow | null> {
    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .eq("device_id", deviceId)
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Erreur récupération données:", error);
      return null;
    }

    return data;
  },

  // S'abonner aux changements temps réel
  subscribeToSensorData(
    deviceId: string,
    callback: (data: SensorDataRow) => void
  ) {
    return supabase
      .channel("sensor_updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_data",
          filter: `device_id=eq.${deviceId}`,
        },
        (payload) => {
          callback(payload.new as SensorDataRow);
        }
      )
      .subscribe();
  },

  // Envoyer une commande à l'ESP32
  async sendCommand(deviceId: string, command: string): Promise<boolean> {
    const { error } = await supabase.from("device_commands").insert({
      device_id: deviceId,
      command: command,
    });

    if (error) {
      console.error("Erreur envoi commande:", error);
      return false;
    }

    return true;
  },

  // Obtenir l'historique
  async getHistory(
    deviceId: string,
    days: number = 7
  ): Promise<SensorDataRow[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      // .eq("device_id", deviceId)
      .gte("timestamp", startDate.toISOString())
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Erreur historique:", error);
      return [];
    }
    console.log("Historique récupéré:", data);
    return data || [];
  },

  // Obtenir les statistiques
  async getStatistics(deviceId: string): Promise<{
    totalDistributions: number;
    averageWeight: number;
    lastDistribution: string | null;
  }> {
    const { data, error } = await supabase
      .from("sensor_data")
      .select("distribution_count, weight, timestamp")
      // .eq("device_id", deviceId)
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error || !data) {
      return {
        totalDistributions: 0,
        averageWeight: 0,
        lastDistribution: null,
      };
    }

    const totalDistributions = Math.max(
      ...data.map((d) => d.distribution_count)
    );
    const averageWeight =
      data.reduce((sum, d) => sum + d.weight, 0) / data.length;
    const lastDistribution =
      data.find((d) => d.distribution_count > 0)?.timestamp || null;

    return {
      totalDistributions,
      averageWeight,
      lastDistribution,
    };
  },
};
