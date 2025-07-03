import { useState, useEffect } from "react";
import { devicesApi  } from "@/utils/supabase";
import { Device } from "@/types/index";

export function useDevice() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const userDevices = await devicesApi.getUserDevices();
      setDevices(userDevices);

      // Sélectionner le premier device par défaut
      if (userDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(userDevices[0]);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const createDevice = async (
    name: string,
    location?: string
  ): Promise<boolean> => {
    try {
      const newDevice = await devicesApi.createDevice(name, location);
      if (newDevice) {
        setDevices((prev) => [...prev, newDevice]);
        setSelectedDevice(newDevice);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de création");
      return false;
    }
  };

  const updateDevice = async (
    deviceId: string,
    updates: Partial<Pick<Device, "name" | "location">>
  ): Promise<boolean> => {
    try {
      const success = await devicesApi.updateDevice(deviceId, updates);
      if (success) {
        setDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId ? { ...device, ...updates } : device
          )
        );
        if (selectedDevice?.id === deviceId) {
          setSelectedDevice((prev) => (prev ? { ...prev, ...updates } : null));
        }
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
      return false;
    }
  };

  const deleteDevice = async (deviceId: string): Promise<boolean> => {
    try {
      const success = await devicesApi.deleteDevice(deviceId);
      if (success) {
        setDevices((prev) => prev.filter((device) => device.id !== deviceId));
        if (selectedDevice?.id === deviceId) {
          const remainingDevices = devices.filter((d) => d.id !== deviceId);
          setSelectedDevice(remainingDevices[0] || null);
        }
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression");
      return false;
    }
  };

  return {
    devices,
    selectedDevice,
    setSelectedDevice,
    loading,
    error,
    loadDevices,
    createDevice,
    updateDevice,
    deleteDevice,
  };
}
