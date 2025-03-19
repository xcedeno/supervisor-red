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
    console.log(`Haciendo ping a ${device.name} (${device.ip})...`); // Depuración: Verifica que se intenta hacer ping
    const response = await axios.get(`http://${device.ip}`, { timeout: 4000 });
    const newStatus = response.status === 200;

    console.log(`${device.name} respondió con estado 200. Nuevo estado: ${newStatus}`); // Depuración: Muestra el resultado del ping

    // Verificar si el estado ha cambiado
    if (newStatus !== lastStatus) {
        console.log(`Estado cambiado para ${device.name}: ${lastStatus} -> ${newStatus}`); // Depuración: Detecta cambios de estado
        setStatus(newStatus);

        // Enviar notificación si el estado cambia
        if (newStatus) {
        console.log(`Enviando notificación de dispositivo en línea para ${device.name}`); // Depuración: Notificación en línea
        sendTelegramMessage(`El equipo ${device.name} (${device.ip}) está en línea.`);
        } else {
        const currentTime = Date.now();
        const fiveMinutesInMilliseconds = 5 * 60 * 1000;

        // Verificar si han pasado al menos 5 minutos desde la última notificación
        if (currentTime - lastNotificationTime > fiveMinutesInMilliseconds) {
            console.log(`Enviando notificación de dispositivo desconectado para ${device.name}`); // Depuración: Notificación offline
            sendTelegramMessage(`El equipo ${device.name} (${device.ip}) se ha desconectado.`);
            setLastNotificationTime(currentTime);
        }
        }

        // Actualizar el estado anterior
        setLastStatus(newStatus);
    }
    } catch (error) {
    console.error(`Error al hacer ping a ${device.name} (${device.ip}):`, error); // Depuración: Captura errores
    const newStatus = false;

    // Verificar si el estado ha cambiado
    if (newStatus !== lastStatus) {
        console.log(`Estado cambiado para ${device.name}: ${lastStatus} -> ${newStatus}`); // Depuración: Detecta cambios de estado
        setStatus(newStatus);

        const currentTime = Date.now();
        const fiveMinutesInMilliseconds = 5 * 60 * 1000;

        // Verificar si han pasado al menos 5 minutos desde la última notificación
        if (currentTime - lastNotificationTime > fiveMinutesInMilliseconds) {
        console.log(`Enviando notificación de dispositivo desconectado para ${device.name}`); // Depuración: Notificación offline
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