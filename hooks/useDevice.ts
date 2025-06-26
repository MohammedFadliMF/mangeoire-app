import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { deviceService } from "../services/device";
import { Device, DeviceSettings, SensorData } from "../types";

export const useDevice = (deviceId?: string) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [settings, setSettings] = useState<DeviceSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les appareils
  const loadDevices = async () => {
    try {
      const userDevices = await deviceService.getUserDevices();
      setDevices(userDevices);

      if (userDevices.length > 0 && !currentDevice) {
        setCurrentDevice(userDevices[0]);
      }
    } catch (error) {
      console.error("Error loading devices:", error);
    }
  };

  // Charger les données du capteur
  const loadSensorData = async (deviceId: string) => {
    try {
      const data = await deviceService.getLatestSensorData(deviceId);
      setSensorData(data);
    } catch (error) {
      console.error("Error loading sensor data:", error);
    }
  };

  // Charger les paramètres
  const loadSettings = async (deviceId: string) => {
    try {
      const deviceSettings = await deviceService.getDeviceSettings(deviceId);
      setSettings(deviceSettings);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  // Contrôler le servo
  const controlServo = async (position: number) => {
    if (!currentDevice) return;

    try {
      await deviceService.controlServo(currentDevice.id, position);
    } catch (error) {
      console.error("Error controlling servo:", error);
      throw error;
    }
  };

  // Ajouter un appareil
  const addDevice = async (name: string, deviceCode: string) => {
    try {
      const newDevice = await deviceService.addDevice(name, deviceCode);
      setDevices((prev) => [newDevice, ...prev]);
      return newDevice;
    } catch (error) {
      console.error("Error adding device:", error);
      throw error;
    }
  };

  // Mettre à jour les paramètres
  const updateSettings = async (newSettings: Partial<DeviceSettings>) => {
    if (!currentDevice) return;

    try {
      const updated = await deviceService.updateDeviceSettings(
        currentDevice.id,
        newSettings
      );
      setSettings(updated);
      return updated;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadDevices().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (currentDevice) {
      loadSensorData(currentDevice.id);
      loadSettings(currentDevice.id);

      // S'abonner aux mises à jour en temps réel
      const subscription = deviceService.subscribeToSensorData(
        currentDevice.id,
        (newData) => {
          setSensorData(newData);
        }
      );

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [currentDevice]);

  return {
    devices,
    currentDevice,
    sensorData,
    settings,
    loading,
    setCurrentDevice,
    controlServo,
    addDevice,
    updateSettings,
    refreshData: () => {
      if (currentDevice) {
        loadSensorData(currentDevice.id);
      }
    },
  };
};
