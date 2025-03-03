import { useState, useEffect } from 'react';
import axios from 'axios';
import { sendTelegramMessage } from '../services/telegram';

const useDevicePing = (device: { id: string; name: string; ip: string }) => {
const [status, setStatus] = useState<boolean>(false);
const [lastStatus, setLastStatus] = useState<boolean | null>(null); // Estado anterior
const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);

useEffect(() => {
const ping = async () => {
    try {
    const response = await axios.get(`http://${device.ip}`, { timeout: 2000 });
    const newStatus = response.status === 200;

    // Verificar si el estado ha cambiado
    if (newStatus !== lastStatus) {
        setStatus(newStatus);

        // Enviar notificación si el estado cambia
        if (newStatus) {
        sendTelegramMessage(`El equipo ${device.name} (${device.ip}) está en línea.`);
        } else {
        const currentTime = Date.now();
        const fiveMinutesInMilliseconds = 5 * 60 * 1000;

        // Verificar si han pasado al menos 5 minutos desde la última notificación
        if (currentTime - lastNotificationTime > fiveMinutesInMilliseconds) {
            sendTelegramMessage(`El equipo ${device.name} (${device.ip}) se ha desconectado.`);
            setLastNotificationTime(currentTime);
        }
        }

        // Actualizar el estado anterior
        setLastStatus(newStatus);
    }
    } catch {
    const newStatus = false;

    // Verificar si el estado ha cambiado
    if (newStatus !== lastStatus) {
        setStatus(newStatus);

        const currentTime = Date.now();
        const fiveMinutesInMilliseconds = 5 * 60 * 1000;

        // Verificar si han pasado al menos 5 minutos desde la última notificación
        if (currentTime - lastNotificationTime > fiveMinutesInMilliseconds) {
        sendTelegramMessage(`El equipo ${device.name} (${device.ip}) se ha desconectado.`);
        setLastNotificationTime(currentTime);
        }

        // Actualizar el estado anterior
        setLastStatus(newStatus);
    }
    }
};

const intervalId = setInterval(ping, 10000); // Realizar ping cada 10 segundos
return () => clearInterval(intervalId);
}, [device, lastStatus, lastNotificationTime]);

return status;
};

export default useDevicePing;