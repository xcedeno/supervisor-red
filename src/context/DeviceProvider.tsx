// src/context/DeviceProvider.tsx
import React, { useState, useCallback, useMemo } from 'react';
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
setDevices((prevDevices) =>
    prevDevices.map((device) =>
    device.id === id ? { ...device, status: newStatus } : device
    )
);
}, []);

// Precalculamos los dispositivos en línea y fuera de línea
const onlineDevices = useMemo(() => devices.filter((device) => device.status === 'online'), [devices]);
const offlineDevices = useMemo(() => devices.filter((device) => device.status === 'offline'), [devices]);
const totalDevices = devices.length;

return (
<DeviceContext.Provider value={{ devices, onlineDevices, offlineDevices, totalDevices, updateDeviceStatus }}>
    {children}
</DeviceContext.Provider>
);
};