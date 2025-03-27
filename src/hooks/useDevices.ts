import { useState, useEffect, useCallback } from 'react';

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // Timeout de 20 segundos

    try {
      // Validar que la IP sea válida
      if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(device.ip)) {
        console.error(`IP no válida: ${device.ip}`);
        return { ...device, status: 'offline' };
      }

      const response = await fetch(`http://localhost:3001/api/ping/${device.ip}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId); // Limpia el timeout si la solicitud termina antes

      if (!response.ok) throw new Error('Error al verificar el estado del dispositivo');

      const data = await response.json();
      return { ...device, status: data.status };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`Timeout al verificar el estado del dispositivo ${device.name} (${device.ip})`);
      } else {
        console.error(`Error al verificar el estado del dispositivo ${device.name} (${device.ip}):`, error);
      }
      return { ...device, status: 'offline' };
    } finally {
      clearTimeout(timeoutId); // Asegúrate de limpiar el timeout en cualquier caso
    }
  }, []);

  // Función para cargar dispositivos
  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/devices');
      if (!response.ok) throw new Error('Error al cargar los dispositivos');
      const data = await response.json();

      // Realiza todas las verificaciones de estado en paralelo
      const devicesWithStatus = await Promise.all(
        data.map((device: Device) => checkDeviceStatus({ ...device, status: undefined }))
      );

      setDevices(devicesWithStatus); // Actualiza el estado con los dispositivos y sus estados
    } catch (error) {
      console.error('Error al cargar los dispositivos:', error);
    } finally {
      setLoading(false);
    }
  }, [checkDeviceStatus]);

  // Cargar dispositivos al montar el hook (solo una vez)
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Calcular estadísticas
  const onlineDevices = devices.filter((device) => device.status === 'online');
  const offlineDevices = devices.filter((device) => device.status === 'offline');
  const totalDevices = devices.length;

  return {
    devices,
    loading,
    onlineDevices,
    offlineDevices,
    totalDevices,
  };
};

export default useDevices;