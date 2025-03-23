// src/context/DeviceContext.ts
import { createContext } from 'react';
import { Device } from '../types/types';


interface DeviceContextType {
devices: Device[];
onlineDevices: Device[];
offlineDevices: Device[];
totalDevices: number;
updateDeviceStatus: (id: string, newStatus: 'online' | 'offline') => void;
}

export const DeviceContext = createContext<DeviceContextType>({
devices: [],
onlineDevices: [],
offlineDevices: [],
totalDevices: 0,
updateDeviceStatus: () => {},
});