import { useState, useEffect } from 'react';
import axios from 'axios';

export const useBandwidthTest = (ip: string) => {
const [bandwidth, setBandwidth] = useState<number | null>(null); // Tiempo de respuesta en milisegundos
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<boolean>(false);

useEffect(() => {
const testBandwidth = async () => {
    try {
    const startTime = Date.now(); // Tiempo inicial
    await axios.get(`http://${ip}`, { timeout: 5000 }); // Realiza una solicitud GET a la IP
    const endTime = Date.now(); // Tiempo final
    const responseTime = endTime - startTime; // Calcula el tiempo de respuesta
    setBandwidth(responseTime);
    setError(false);
    } catch  {
    setError(true); // Marca como error si no se puede conectar
    setBandwidth(null);
    } finally {
    setLoading(false); // Finaliza el estado de carga
    }
};

testBandwidth();
}, [ip]);

return { bandwidth, loading, error };
};