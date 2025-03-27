// src/hooks/useBandwidthTest.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useBandwidthTest = (ip: string) => {
  const [bandwidth, setBandwidth] = useState<number | null>(null); // Tiempo de respuesta en milisegundos
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const testBandwidth = async () => {
      try {
        setLoading(true);
        setError(false);

        const startTime = Date.now(); // Tiempo inicial
        // Llama al endpoint /api/ping/:ip para verificar el estado del dispositivo
        const response = await axios.get(`http://localhost:3001/api/ping/${ip}`, { timeout: 80000 });
        const endTime = Date.now(); // Tiempo final

        const { status } = response.data; // Obtiene el estado del dispositivo (online/offline)

        if (status === 'online') {
          const responseTime = endTime - startTime; // Calcula el tiempo de respuesta
          setBandwidth(responseTime); // Guarda el tiempo de respuesta
          setError(false); // No hay error
        } else {
          setError(true); // Marca como error si el dispositivo está offline
          setBandwidth(null); // Limpia el ancho de banda
        }
      } catch (err) {
        console.error(`Error al medir ancho de banda para ${ip}:`, err);
        setError(true); // Marca como error si no se puede conectar
        setBandwidth(null); // Limpia el ancho de banda
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    if (ip) {
      testBandwidth();
    } else {
      setLoading(false); // Si no hay IP, finaliza el estado de carga
      setError(false); // No hay error si no hay IP
    }
  }, [ip]); // Dependencia: se ejecuta cuando cambia la IP

  return { bandwidth, loading, error };
};