import { useState, useEffect, useCallback } from 'react';

// Interfaz para los dispositivos
interface Device {
  id: string;
  name: string;
  ip: string;
  torre: string;
  status?: 'online' | 'offline'; // Campo opcional
}

// Interfaz para la respuesta del backend (/api/ping/:ip)
interface PingResponse {
  ip: string;
  status: 'online' | 'offline';
}

const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  // Función para verificar el estado de un dispositivo con retries
  const checkDeviceStatus = useCallback(async (device: Device, retries = 3): Promise<Device> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos

    for (let attempt = 1; attempt <= retries; attempt++) {
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

        const data: PingResponse = await response.json(); // Tipar la respuesta
        return { ...device, status: data.status };
      } catch {
        if (attempt === retries) {
          console.error(
            `Error al verificar el estado del dispositivo ${device.name} (${device.ip}) tras ${retries} intentos`
          );
          return { ...device, status: 'offline' };
        }
        console.warn(`Reintentando (${attempt}/${retries}) para ${device.name} (${device.ip})`);
      } finally {
        clearTimeout(timeoutId); // Asegúrate de limpiar el timeout en cualquier caso
      }
    }
    return { ...device, status: 'offline' };
  }, []);

  // Función para procesar solicitudes en lotes
  const processInBatches = useCallback(async <T>(
    items: T[],
    processFn: (item: T) => Promise<T>,
    batchSize: number
  ): Promise<T[]> => {
    const results: T[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(processFn));
      results.push(...batchResults);
    }
    return results;
  }, []);

  // Función para cargar dispositivos
  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/devices');
      if (!response.ok) throw new Error('Error al cargar los dispositivos');
      const data: Device[] = await response.json(); // Tipar la respuesta

      // Procesar las solicitudes en lotes de 5 dispositivos a la vez
      const batchSize = 5; // Máximo 5 solicitudes simultáneas
      const devicesWithStatus = await processInBatches(data, checkDeviceStatus, batchSize);

      setDevices(devicesWithStatus); // Actualiza el estado con los dispositivos y sus estados
    } catch (error) {
      console.error('Error al cargar los dispositivos:', error);
    } finally {
      setLoading(false);
    }
  }, [checkDeviceStatus, processInBatches]);

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