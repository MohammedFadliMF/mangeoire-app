import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

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
// 📡 Fonctions pour interagir avec l'ESP32 (simulation)
export const esp32Api = {
  // Obtenir les données des capteurs
  async getSensorData() {
    // En réalité, l'ESP32 enverra ces données à Supabase
    // ou tu peux utiliser une API REST
    return {
      weight: Math.random() * 1000, // Poids simulé
      isContainerPresent: Math.random() > 0.5, // IR simulé
      lastUpdate: new Date().toISOString(),
    };
  },

  // Commande manuelle du servo
  async triggerServo() {
    console.log("🔄 Servo activé manuellement");
    // Ici tu enverrais une commande à l'ESP32
    return { success: true, message: "Servo activé" };
  },

  // Obtenir l'historique
  async getHistory() {
    // Données simulées d'historique
    const history = [];
    for (let i = 0; i < 7; i++) {
      history.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        weight: Math.random() * 1000,
        distributions: Math.floor(Math.random() * 5),
      });
    }
    return history;
  },
};
