// src/hooks/useDevicePing.ts
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { DeviceContext } from '../context/DeviceContext';
import { sendTelegramMessage } from '../services/telegram';

const useDevicePing = (device: { id: string; name: string; ip: string }) => {
const { updateDeviceStatus } = useContext(DeviceContext);
const [status, setStatus] = useState<'online' | 'offline'>('offline');
const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);

useEffect(() => {
const ping = async () => {
    try {
    console.log(`Haciendo ping a ${device.name} (${device.ip})...`);
    const response = await axios.get(`http://${device.ip}`, { timeout: 4000 });
    const newStatus = response.status === 200 ? 'online' : 'offline';

    if (newStatus !== status) {
        console.log(`Estado cambiado para ${device.name}: ${status} -> ${newStatus}`);
        setStatus(newStatus);
        updateDeviceStatus(device.id, newStatus); // Actualiza el estado global

        if (newStatus === 'online') {
        sendTelegramMessage(`El equipo ${device.name} (${device.ip}) está en línea.`);
        } else {
        const currentTime = Date.now();
        const fiveMinutesInMilliseconds = 5 * 60 * 1000;

        if (currentTime - lastNotificationTime > fiveMinutesInMilliseconds) {
            sendTelegramMessage(`El equipo ${device.name} (${device.ip}) se ha desconectado.`);
            setLastNotificationTime(currentTime);
        }
        }
    }
    } catch (error) {
    console.error(`Error al hacer ping a ${device.name} (${device.ip}):`, error);
    const newStatus = 'offline';

    if (newStatus !== status) {
        setStatus(newStatus);
        updateDeviceStatus(device.id, newStatus); // Actualiza el estado global

        const currentTime = Date.now();
        const fiveMinutesInMilliseconds = 5 * 60 * 1000;

        if (currentTime - lastNotificationTime > fiveMinutesInMilliseconds) {
        sendTelegramMessage(`El equipo ${device.name} (${device.ip}) se ha desconectado.`);
        setLastNotificationTime(currentTime);
        }
    }
    }
};

const intervalId = setInterval(ping, 10000); // Realizar ping cada 10 segundos
return () => clearInterval(intervalId); // Limpieza al desmontar
}, [device, status, lastNotificationTime, updateDeviceStatus]);

return status;
};

export default useDevicePing;