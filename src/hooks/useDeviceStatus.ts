// src/hooks/useDeviceStatus.ts
import { useState, useEffect } from 'react';

const useDeviceStatus = (ip: string): 'online' | 'offline' => {
const [status, setStatus] = useState<'online' | 'offline'>('offline');

useEffect(() => {
const testDeviceStatus = async () => {
    try {
    // Simular una solicitud HTTP para medir el ancho de banda
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`http://${ip}/ping`, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error('No se pudo medir el ancho de banda');
    }

    // Si la respuesta es exitosa, el dispositivo está en línea
    setStatus('online');
    } catch {
    // Si hay un error, el dispositivo está fuera de línea
    setStatus('offline');
    }
};

testDeviceStatus();
}, [ip]);

return status;
};

export default useDeviceStatus;