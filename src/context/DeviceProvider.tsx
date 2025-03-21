// src/context/DeviceProvider.tsx
import React, { useState, useCallback } from 'react';
import { DeviceContext } from './DeviceContext';

interface Device {
id: string;
name: string;
ip: string;
torre: string;
status: 'online' | 'offline';
}

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [devices, setDevices] = useState<Device[]>([]);

// Función para actualizar el estado de un dispositivo
const updateDeviceStatus = useCallback((id: string, newStatus: 'online' | 'offline') => {
console.log(`Actualizando estado del dispositivo ${id}: ${newStatus}`);
setDevices(prevDevices =>
    prevDevices.map(device =>
    device.id === id ? { ...device, status: newStatus } : device
    )
);
}, []);

return (
<DeviceContext.Provider value={{ devices, updateDeviceStatus }}>
    {children}
</DeviceContext.Provider>
);
};