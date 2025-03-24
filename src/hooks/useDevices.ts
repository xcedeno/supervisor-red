// src/hooks/useDevices.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Device {
id: string;
name: string;
ip: string;
torre: string;
status?: 'online' | 'offline'; // Campo opcional
}

const useDevices = () => {
const [devices, setDevices] = useState<Device[]>([]);
const [loading, setLoading] = useState(false);

// Función para verificar el estado de un dispositivo
const checkDeviceStatus = useCallback(async (device: Device): Promise<Device> => {
try {
    const startTime = Date.now(); // Tiempo inicial
    await axios.get(`http://${device.ip}`, { timeout: 5000 }); // Realiza una solicitud GET a la IP
    const endTime = Date.now(); // Tiempo final
    const responseTime = endTime - startTime; // Calcula el tiempo de respuesta

    console.log(`Dispositivo ${device.name} (${device.ip}) está en línea: ${responseTime} ms`);
    return { ...device, status: 'online' }; // Actualiza el estado a "online"
} catch (error) {
    if (error instanceof Error) {
    console.error(`Dispositivo ${device.name} (${device.ip}) está fuera de línea:`, error.message);
    } else {
    console.error(`Dispositivo ${device.name} (${device.ip}) está fuera de línea:`, error);
    }
    return { ...device, status: 'offline' }; // Actualiza el estado a "offline"
}
}, []);

// Función para cargar dispositivos
const fetchDevices = useCallback(async () => {
setLoading(true);
try {
    const response = await fetch('http://localhost:3001/api/devices');
    if (!response.ok) throw new Error('Error al cargar los dispositivos');
    const data = await response.json();
    const devicesWithStatus = await Promise.all(
    data.map((device: Device) => checkDeviceStatus({ ...device, status: 'offline' }))
    );
    setDevices(devicesWithStatus); // Inicializa con estados actualizados
} catch (error) {
    console.error('Error al cargar los dispositivos:', error);
} finally {
    setLoading(false);
}
}, [checkDeviceStatus]);

// Función para agregar un nuevo dispositivo
const addDevice = useCallback(async (newDevice: Device) => {
try {
    const response = await fetch('http://localhost:3001/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDevice),
    });
    if (!response.ok) throw new Error('Error al agregar el dispositivo');
    const data = await response.json();
    setDevices((prevDevices) => [...prevDevices, { ...data, status: 'offline' }]);
} catch (error) {
    console.error('Error al agregar el dispositivo:', error);
}
}, []);

// Cargar dispositivos al montar el hook (solo una vez)
useEffect(() => {
fetchDevices(); // Carga los dispositivos iniciales
}, [fetchDevices]); // Dependencia estable gracias a useCallback

// Calcular estadísticas
const onlineDevices = devices.filter((device) => device.status === 'online');
const offlineDevices = devices.filter((device) => device.status === 'offline');
const totalDevices = devices.length;

return {
devices,
loading,
addDevice,
onlineDevices,
offlineDevices,
totalDevices,
};
};

export default useDevices;