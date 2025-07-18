import { useState, useEffect } from "react";
import { esp32Api } from "@/utils/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { SensorDataRow } from "@/types/index";

export function useRealtimeSensorData(deviceId: string | null) {
  const [sensorData, setSensorData] = useState<SensorDataRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let subscription: RealtimeChannel | null = null;

    const initializeData = async () => {
      if (!deviceId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Charger les données initiales
        const initialData = await esp32Api.getLatestSensorData(deviceId);
        if (initialData) {
          setSensorData(initialData);
        }

        // S'abonner aux mises à jour temps réel
        subscription = esp32Api.subscribeToSensorData(deviceId, (newData) => {
          console.log("📡 Nouvelles données reçues:", newData);
          setSensorData(newData);
          setIsConnected(true);
        });

        // Écouter les événements de connexion
        subscription.on("system", {}, (payload) => {
          if (payload.extension === "postgres_changes") {
            setIsConnected(payload.status === "ok");
          }
        });

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de connexion");
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    // Nettoyage
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [deviceId]);

  const sendCommand = async (command: string): Promise<boolean> => {
    if (!deviceId) return false;

    try {
      const success = await esp32Api.sendCommand(deviceId, command);
      if (!success) {
        setError("Impossible d'envoyer la commande");
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'envoi");
      return false;
    }
  };

  const refreshData = async () => {
    if (!deviceId) return;

    try {
      const data = await esp32Api.getLatestSensorData(deviceId);
      if (data) {
        setSensorData(data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur de rafraîchissement"
      );
    }
  };

  return {
    sensorData,
    loading,
    error,
    isConnected,
    sendCommand,
    refreshData,
  };
}
