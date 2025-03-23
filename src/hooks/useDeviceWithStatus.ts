// src/hooks/useDevicesWithStatus.ts
import { useMemo } from 'react';
import useDeviceStatus from './useDeviceStatus'; // Hook personalizado para un solo dispositivo
import { Device } from '../types/types';

interface DeviceWithStatus extends Device {
  status: 'online' | 'offline';
}

const useDevicesWithStatus = (devices: Device[]): DeviceWithStatus[] => {
  // Calcular el estado de cada dispositivo usando un hook personalizado
  const statuses = devices.map((device) => useDeviceStatus(device.ip));

  // Combinar los estados con los dispositivos originales
  return useMemo(() => {
    return devices.map((device, index) => ({
      ...device,
      status: statuses[index],
    }));
  }, [devices, statuses]);
};

export default useDevicesWithStatus;