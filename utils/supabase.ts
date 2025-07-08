import { Device, DeviceSchedule, SensorDataRow } from "@/types/index";
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
// export interface SensorDataRow {
//   id: number;
//   device_id: string;
//   weight: number;
//   is_container_present: boolean;
//   servo_active: boolean;
//   distribution_count: number;
//   timestamp: string;
// }

// export interface DeviceCommand {
//   device_id: string;
//   command: string;
// }

// 🏠 API pour gérer les devices de l'utilisateur
export const devicesApi = {
  // Obtenir tous les devices de l'utilisateur connecté
  async getUserDevices(): Promise<Device[]> {
    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erreur récupération devices:", error);
      return [];
    }

    return data || [];
  },

  // Obtenir un device spécifique
  async getDevice(deviceId: string): Promise<Device | null> {
    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("id", deviceId)
      .single();

    if (error) {
      console.error("Erreur récupération device:", error);
      return null;
    }

    return data;
  },

  // Créer un nouveau device
  async createDevice(name: string, location?: string): Promise<Device | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Générer un code unique
    const deviceCode = `MANG_${Date.now().toString(36).toUpperCase()}`;

    const { data, error } = await supabase
      .from("devices")
      .insert({
        name,
        device_code: deviceCode,
        location: location || "Non spécifié",
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur création device:", error);
      return null;
    }

    return data;
  },

  // Mettre à jour un device
  async updateDevice(
    deviceId: string,
    updates: Partial<Pick<Device, "name" | "location">>
  ): Promise<boolean> {
    const { error } = await supabase
      .from("devices")
      .update(updates)
      .eq("id", deviceId);

    if (error) {
      console.error("Erreur mise à jour device:", error);
      return false;
    }

    return true;
  },

  // Supprimer un device (soft delete)
  async deleteDevice(deviceId: string): Promise<boolean> {
    const { error } = await supabase
      .from("devices")
      .update({ is_active: false })
      .eq("id", deviceId);

    if (error) {
      console.error("Erreur suppression device:", error);
      return false;
    }

    return true;
  },
};

// 📡 API ESP32 mis à jour avec gestion des devices
export const esp32Api = {
  // Obtenir les dernières données des capteurs pour un device
  async getLatestSensorData(deviceId: string): Promise<SensorDataRow | null> {
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

  // S'abonner aux changements temps réel pour un device
  subscribeToSensorData(
    deviceId: string,
    callback: (data: SensorDataRow) => void
  ) {
    return supabase
      .channel(`sensor_updates_${deviceId}`)
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

  // Envoyer une commande à un device
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

  // Obtenir l'historique d'un device
  async getHistory(
    deviceId: string,
    days: number = 7
  ): Promise<SensorDataRow[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .eq("device_id", deviceId)
      .gte("timestamp", startDate.toISOString())
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Erreur historique:", error);
      return [];
    }

    return data || [];
  },

  // Obtenir les statistiques d'un device
  // async getStatistics(deviceId: string): Promise<{
  //   totalDistributions: number;
  //   averageWeight: number;
  //   lastDistribution: string | null;
  // }> {
  //   const { data, error } = await supabase
  //     .from("sensor_data")
  //     .select("distribution_count, weight, timestamp")
  //     .eq("device_id", deviceId)
  //     .order("timestamp", { ascending: false })
  //     .limit(100);

  //   if (error || !data) {
  //     return {
  //       totalDistributions: 0,
  //       averageWeight: 0,
  //       lastDistribution: null,
  //     };
  //   }

  //   const totalDistributions = Math.max(
  //     ...data.map((d) => d.distribution_count),
  //     0
  //   );
  //   const averageWeight =
  //     data.reduce((sum, d) => sum + d.weight, 0) / data.length;
  //   const lastDistribution =
  //     data.find((d) => d.distribution_count > 0)?.timestamp || null;

  //   return {
  //     totalDistributions,
  //     averageWeight,
  //     lastDistribution,
  //   };
  // },

  // fonction pour récupérer l'historique des distributions
  async getDistributionHistory(
    deviceId: string
    // days: number = 7
  ): Promise<any[]> {
    // const startDate = new Date();
    // startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("distribution_history")
      .select("*")
      .eq("device_id", deviceId)
      // .gte("timestamp", startDate.toISOString())
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Erreur historique distributions:", error);
      return [];
    }

    return data || [];
  },
};

// API pour gérer les programmations
export const schedulesApi = {
  // Obtenir les programmations d'un device
  async getDeviceSchedules(deviceId: string): Promise<DeviceSchedule[]> {
    const { data, error } = await supabase
      .from("device_schedules")
      .select("*")
      .eq("device_id", deviceId)
      .order("time", { ascending: true });

    if (error) {
      console.error("Erreur récupération programmations:", error);
      return [];
    }

    return data || [];
  },

  // Créer une programmation
  async createSchedule(
    deviceId: string,
    name: string,
    time: string
  ): Promise<boolean> {
    const { error } = await supabase.from("device_schedules").insert({
      device_id: deviceId,
      name,
      time,
      enabled: true,
      created_at: new Date().toISOString(), // horodatage actuel
    });

    if (error) {
      console.error("Erreur création programmation:", error);
      return false;
    }

    return true;
  },

  // Mettre à jour une programmation
  async updateSchedule(
    scheduleId: string,
    updates: Partial<Pick<DeviceSchedule, "name" | "time" | "enabled">>
  ): Promise<boolean> {
    const { error } = await supabase
      .from("device_schedules")
      .update(updates)
      .eq("id", scheduleId);

    if (error) {
      console.error("Erreur mise à jour programmation:", error);
      return false;
    }

    return true;
  },

  // Supprimer une programmation
  async deleteSchedule(scheduleId: string): Promise<boolean> {
    const { error } = await supabase
      .from("device_schedules")
      .delete()
      .eq("id", scheduleId);

    if (error) {
      console.error("Erreur suppression programmation:", error);
      return false;
    }

    return true;
  },
};
