// src/context/DeviceContext.ts
import { createContext } from 'react';

interface Device {
id: string;
name: string;
ip: string;
torre: string;
status: 'online' | 'offline';
}

interface DeviceContextType {
devices: Device[];
updateDeviceStatus: (id: string, newStatus: 'online' | 'offline') => void;
}

export const DeviceContext = createContext<DeviceContextType>({
devices: [],
updateDeviceStatus: () => {},
});