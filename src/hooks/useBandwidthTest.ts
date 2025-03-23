// src/hooks/useBandwidthTest.ts
import { useState, useEffect } from 'react';

interface BandwidthTestResult {
bandwidth: number | null; // Valor del ancho de banda en ms (o null si no se pudo medir)
loading: boolean; // Indica si la prueba está en progreso
error: boolean; // Indica si ocurrió un error durante la prueba
}

const useBandwidthTest = (ip: string): BandwidthTestResult => {
const [bandwidth, setBandwidth] = useState<number | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

useEffect(() => {
const testBandwidth = async () => {
    try {
    setLoading(true);
    setError(false);

    // Simular una solicitud HTTP para medir el ancho de banda
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`http://${ip}/ping`, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);
    const endTime = Date.now();

    if (!response.ok) {
        throw new Error('No se pudo medir el ancho de banda');
    }

    // Calcular el tiempo de respuesta (en milisegundos)
    const latency = endTime - startTime;
    setBandwidth(latency);
    } catch {
    setError(true);
    setBandwidth(null);
    } finally {
    setLoading(false);
    }
};

testBandwidth();
}, [ip]);

return { bandwidth, loading, error };
};

export default useBandwidthTest;