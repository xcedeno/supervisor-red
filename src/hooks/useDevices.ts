// src/hooks/useDevices.ts
import { useState, useEffect } from 'react';

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

// Función para cargar dispositivos
const fetchDevices = async () => {
setLoading(true);
try {
    const response = await fetch('http://localhost:3001/api/devices');
    if (!response.ok) throw new Error('Error al cargar los dispositivos');
    const data = await response.json();
    setDevices(data);
} catch (error) {
    console.error('Error al cargar los dispositivos:', error);
} finally {
    setLoading(false);
}
};

// Función para agregar un nuevo dispositivo
const addDevice = async (newDevice: Device) => {
try {
    const response = await fetch('http://localhost:3001/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDevice),
    });
    if (!response.ok) throw new Error('Error al agregar el dispositivo');
    const data = await response.json();
    setDevices(prevDevices => [...prevDevices, data]);
} catch (error) {
    console.error('Error al agregar el dispositivo:', error);
}
};

// Actualización única después de 20 segundos
useEffect(() => {
fetchDevices(); // Carga inicial
const timeout = setTimeout(fetchDevices, 20000); // Actualiza una vez después de 20 segundos
return () => clearTimeout(timeout); // Limpieza al desmontar
}, []);

return { devices, loading, addDevice };
};

export default useDevices;