import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { Device, PingResponse } from '../../../types/device';

// Fetch all devices
const fetchDevices = async (): Promise<Device[]> => {
  const response = await fetch('http://localhost:3002/api/devices');
  if (!response.ok) throw new Error('Error fetching devices');
  return response.json();
};

// Ping a single device
const pingDevice = async (ip: string): Promise<PingResponse> => {
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    return { ip, status: 'offline' };
  }
  const response = await fetch(`http://localhost:3002/api/ping/${ip}`);
  if (!response.ok) throw new Error('Error pinging device');
  return response.json();
};

// Add new device
const addDevice = async (newDevice: Omit<Device, 'status'>): Promise<Device> => {
  const response = await fetch('http://localhost:3002/api/devices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newDevice),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error adding device');
  }
  return response.json();
};

export const useDevices = () => {
  // 1. Get Base Devices
  const devicesQuery = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  });

  const devices = devicesQuery.data || [];

  // 2. Identify Unique IPs to query
  // Filter out duplicate IPs so we don't violate React Query's duplicate key rule
  // and to save bandwidth/resources.
  const uniqueIps = Array.from(new Set(devices.map(d => d.ip).filter(ip => !!ip)));

  // 3. Get Statuses for UNIQUE IPs
  const statusQueries = useQueries({
    queries: uniqueIps.map(ip => ({
      queryKey: ['ping', ip],
      queryFn: () => pingDevice(ip),
      staleTime: 30000,
      refetchInterval: 60000,
    }))
  });



  const isAnyQueryLoading = statusQueries.some(q => q.isLoading && q.fetchStatus !== 'idle');

  // Re-map with more granular loading state if desired, matching original behavior:
  // Original: status: statusQuery.isLoading ? undefined : status
  const finalDevices = devices.map(device => {
    const index = uniqueIps.indexOf(device.ip);
    const query = index !== -1 ? statusQueries[index] : null;
    const isLoading = query ? (query.isLoading && query.fetchStatus !== 'idle') : false;
    const status = query?.data?.status || 'offline';

    return {
      ...device,
      status: isLoading ? undefined : status
    };
  });


  const isLoading = devicesQuery.isLoading || isAnyQueryLoading;

  // Debug logs
  console.log('useDevices - Raw Devices:', devices);
  console.log('useDevices - Unique IPs:', uniqueIps);
  console.log('useDevices - Final Devices with Status:', finalDevices);
  console.log('useDevices - Loading:', isLoading);

  return {
    devices: finalDevices,
    loading: isLoading,
    onlineDevices: finalDevices.filter(d => d.status === 'online'),
    offlineDevices: finalDevices.filter(d => d.status === 'offline'),
    totalDevices: devices.length
  };
};

export const useAddDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDevice,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};

export default useDevices;