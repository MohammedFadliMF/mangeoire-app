import { supabase } from "@/utils/supabase";
// import { Device, DeviceCommand, DeviceSettings, SensorData } from "../types";

class DeviceService {
  // // Obtenir les appareils de l'utilisateur
  // async getUserDevices(): Promise<Device[]> {
  //   try {
  //     const { data, error } = await supabase
  //       .from("devices")
  //       .select("*")
  //       .eq("is_active", true)
  //       .order("created_at", { ascending: false });

  //     if (error) throw error;
  //     return data || [];
  //   } catch (error) {
  //     console.error("Error fetching devices:", error);
  //     throw error;
  //   }
  // }

  // // Ajouter un nouvel appareil
  // async addDevice(name: string, deviceCode: string): Promise<Device> {
  //   try {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (!user) throw new Error("User not authenticated");

  //     const { data, error } = await supabase
  //       .from("devices")
  //       .insert({
  //         user_id: user.id,
  //         name,
  //         device_code: deviceCode,
  //       })
  //       .select()
  //       .single();

  //     if (error) throw error;

  //     // Créer les paramètres par défaut
  //     await this.createDefaultSettings(data.id);

  //     return data;
  //   } catch (error) {
  //     console.error("Error adding device:", error);
  //     throw error;
  //   }
  // }

  // // Obtenir les données du capteur
  // async getLatestSensorData(deviceId: string): Promise<SensorData | null> {
  //   try {
  //     const { data, error } = await supabase
  //       .from("sensor_data")
  //       .select("*")
  //       .eq("device_id", deviceId)
  //       .order("created_at", { ascending: false })
  //       .limit(1)
  //       .single();

  //     if (error && error.code !== "PGRST116") throw error;
  //     return data || null;
  //   } catch (error) {
  //     console.error("Error fetching sensor data:", error);
  //     throw error;
  //   }
  // }

  // // Obtenir l'historique des données
  // async getSensorHistory(
  //   deviceId: string,
  //   days: number = 7
  // ): Promise<SensorData[]> {
  //   try {
  //     const dateFrom = new Date();
  //     dateFrom.setDate(dateFrom.getDate() - days);

  //     const { data, error } = await supabase
  //       .from("sensor_data")
  //       .select("*")
  //       .eq("device_id", deviceId)
  //       .gte("created_at", dateFrom.toISOString())
  //       .order("created_at", { ascending: true });

  //     if (error) throw error;
  //     return data || [];
  //   } catch (error) {
  //     console.error("Error fetching sensor history:", error);
  //     throw error;
  //   }
  // }

  // // Envoyer une commande au dispositif
  // async sendCommand(
  //   deviceId: string,
  //   commandType: DeviceCommand["command_type"],
  //   commandValue: any
  // ): Promise<DeviceCommand> {
  //   try {
  //     const { data, error } = await supabase
  //       .from("device_commands")
  //       .insert({
  //         device_id: deviceId,
  //         command_type: commandType,
  //         command_value: commandValue,
  //       })
  //       .select()
  //       .single();

  //     if (error) throw error;
  //     return data;
  //   } catch (error) {
  //     console.error("Error sending command:", error);
  //     throw error;
  //   }
  // }

  // // Contrôler le servo
  // async controlServo(deviceId: string, position: number): Promise<void> {
  //   await this.sendCommand(deviceId, "servo", { position });
  // }

  // // Obtenir les paramètres de l'appareil
  // async getDeviceSettings(deviceId: string): Promise<DeviceSettings | null> {
  //   try {
  //     const { data, error } = await supabase
  //       .from("device_settings")
  //       .select("*")
  //       .eq("device_id", deviceId)
  //       .single();

  //     if (error && error.code !== "PGRST116") throw error;
  //     return data || null;
  //   } catch (error) {
  //     console.error("Error fetching device settings:", error);
  //     throw error;
  //   }
  // }

  // // Mettre à jour les paramètres
  // async updateDeviceSettings(
  //   deviceId: string,
  //   settings: Partial<DeviceSettings>
  // ): Promise<DeviceSettings> {
  //   try {
  //     const { data, error } = await supabase
  //       .from("device_settings")
  //       .update(settings)
  //       .eq("device_id", deviceId)
  //       .select()
  //       .single();

  //     if (error) throw error;
  //     return data;
  //   } catch (error) {
  //     console.error("Error updating device settings:", error);
  //     throw error;
  //   }
  // }

  // // Créer les paramètres par défaut
  // private async createDefaultSettings(deviceId: string): Promise<void> {
  //   try {
  //     await supabase.from("device_settings").insert({
  //       device_id: deviceId,
  //       auto_distribution: true,
  //       weight_threshold: 20,
  //       distribution_interval: 6,
  //       notifications_enabled: true,
  //     });
  //   } catch (error) {
  //     console.error("Error creating default settings:", error);
  //   }
  // }

  // // S'abonner aux mises à jour en temps réel
  // subscribeToSensorData(
  //   deviceId: string,
  //   callback: (data: SensorData) => void
  // ) {
  //   return supabase
  //     .channel(`sensor_data:${deviceId}`)
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "INSERT",
  //         schema: "public",
  //         table: "sensor_data",
  //         filter: `device_id=eq.${deviceId}`,
  //       },
  //       (payload) => {
  //         callback(payload.new as SensorData);
  //       }
  //     )
  //     .subscribe();
  // }
}

export const deviceService = new DeviceService();
