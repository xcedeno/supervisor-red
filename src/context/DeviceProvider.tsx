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
        // Obtener la lista de dispositivos desde el backend
        const response = await axios.get('http://localhost:3001/api/devices', { timeout: 15000 });
        if (response.status !== 200) throw new Error('Error al cargar los dispositivos');
        const data = response.data;

        // Variable temporal para almacenar los dispositivos procesados
        const processedDevices: Device[] = [];

        // Procesar cada dispositivo individualmente
        for (const device of data) {
          try {
            // Llamar al endpoint /api/ping/:ip para verificar el estado del dispositivo
            const pingResponse = await axios.get(`http://localhost:3001/api/ping/${device.ip}`, { timeout: 5000 });
            const { status } = pingResponse.data;

            // Agregar el dispositivo procesado a la lista temporal
            processedDevices.push({ ...device, status });
          } catch (error) {
            console.error(`Error al verificar el estado del dispositivo ${device.name} (${device.ip}):`, error);
            // Si hay un error, asumir que el dispositivo está offline
            processedDevices.push({ ...device, status: 'offline' });
          }
        }

        // Actualizar el estado con todos los dispositivos procesados
        setDevices(processedDevices);
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