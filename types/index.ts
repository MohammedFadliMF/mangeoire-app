// export interface User {
//   id: string;
//   email: string;
//   name?: string;
//   avatar_url?: string;
// }

// export interface Device {
//   id: string;
//   user_id: string;
//   name: string;
//   device_code: string;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
// }

// export interface SensorData {
//   id: string;
//   device_id: string;
//   weight: number;
//   ir_status: boolean;
//   servo_position: number;
//   battery_level?: number;
//   temperature?: number;
//   humidity?: number;
//   created_at: string;
// }

// export interface DeviceCommand {
//   id: string;
//   device_id: string;
//   command_type: "servo" | "calibrate" | "reset";
//   command_value: any;
//   status: "pending" | "sent" | "executed" | "failed";
//   created_at: string;
// }

// export interface DeviceSettings {
//   id: string;
//   device_id: string;
//   auto_distribution: boolean;
//   weight_threshold: number;
//   distribution_interval: number;
//   notifications_enabled: boolean;
// }

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface SensorData {
  weight: number;
  isContainerPresent: boolean;
  lastUpdate: string;
}

export interface HistoryEntry {
  date: string;
  weight: number;
  distributions: number;
}

export interface Schedule {
  id: string;
  time: string;
  enabled: boolean;
  name: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}