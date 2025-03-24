// src/context/DeviceContext.tsx
import { createContext } from 'react';

export interface Device {
  id: string;
  name: string;
  ip: string;
  torre: string;
  status?: 'online' | 'offline'; // Campo opcional
}

export interface DeviceContextType {
  devices: Device[];
  onlineDevices: Device[];
  offlineDevices: Device[];
  totalDevices: number;
  updateDeviceStatus?: (deviceId: string, newStatus: 'online' | 'offline') => void; // Función opcional
}

export const DeviceContext = createContext<DeviceContextType>({
  devices: [],
  onlineDevices: [],
  offlineDevices: [],
  totalDevices: 0,
  updateDeviceStatus: undefined, // Valor predeterminado
});