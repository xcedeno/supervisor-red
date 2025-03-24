// src/context/DeviceProvider.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DeviceContext } from './DeviceContext';

interface Device {
  id: string;
  name: string;
  ip: string;
  torre: string;
  status?: 'online' | 'offline'; // Campo opcional
}

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);

  // Efecto para cargar dispositivos al montar el componente
  useEffect(() => {
    console.log('Iniciando carga de dispositivos...');

    const fetchDevices = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/devices');
        if (!response.ok) throw new Error('Error al cargar los dispositivos');
        const data = await response.json();

        // Determinar el estado de cada dispositivo
        const devicesWithStatus = await Promise.all(
          data.map(async (device: Device) => {
            try {
              await axios.get(`http://${device.ip}`, { timeout: 5000 }); // Realiza una solicitud GET a la IP
              return { ...device, status: 'online' }; // Actualiza el estado a "online"
            } catch {
              console.error(`Dispositivo ${device.name} (${device.ip}) está fuera de línea`);
              return { ...device, status: 'offline' }; // Actualiza el estado a "offline"
            }
          })
        );

        setDevices(devicesWithStatus); // Inicializa con estados actualizados
      } catch (error) {
        console.error('Error al cargar dispositivos:', error);
      }
    };

    fetchDevices();
  }, []);

  // Precalcula métricas
  const onlineDevices = devices.filter((device) => device.status === 'online');
  const offlineDevices = devices.filter((device) => device.status === 'offline');
  const totalDevices = devices.length;

  return (
    <DeviceContext.Provider
      value={{
        devices,
        onlineDevices,
        offlineDevices,
        totalDevices,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};