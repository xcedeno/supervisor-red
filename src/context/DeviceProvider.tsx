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

  // Función para verificar el estado de un dispositivo
  const checkDeviceStatus = async (device: Device): Promise<Device> => {
    try {
      // Validar que la IP sea válida
      if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(device.ip)) {
        console.error(`IP no válida: ${device.ip}`);
        return { ...device, status: 'offline' };
      }

      // Realizar el ping al dispositivo
      const response = await axios.get(`http://localhost:3001/api/ping/${device.ip}`, { timeout: 10000 });
      const { status } = response.data;

      // Validar que el campo "status" tenga un valor válido
      if (status !== 'online' && status !== 'offline') {
        console.warn(`Respuesta inesperada del backend para la IP ${device.ip}:`, status);
        return { ...device, status: 'offline' };
      }

      return { ...device, status };
    } catch (error) {
      console.error(
        `Error al verificar el estado del dispositivo ${device.name} (${device.ip}):`,
        axios.isAxiosError(error) ? error.response?.data || error.message : String(error)
      );
      return { ...device, status: 'offline' };
    }
  };

  // Efecto para cargar dispositivos al montar el componente
  useEffect(() => {
    console.log('Iniciando carga de dispositivos...');

    const fetchDevices = async () => {
      try {
        // Obtener la lista de dispositivos desde el backend
        const response = await axios.get('http://localhost:3001/api/devices', { timeout: 15000 });
        if (response.status !== 200) throw new Error('Error al cargar los dispositivos');
        const data = response.data;

        // Procesar las solicitudes en lotes de 5 dispositivos a la vez
        const batchSize = 5;
        const devicesWithStatus: Device[] = [];

        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          const batchResults = await Promise.all(batch.map(checkDeviceStatus));
          devicesWithStatus.push(...batchResults);
        }

        // Actualizar el estado con todos los dispositivos procesados
        setDevices(devicesWithStatus);
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