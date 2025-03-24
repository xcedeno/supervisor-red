// src/utils/bandwidthTest.ts
import axios from 'axios';

export const testBandwidth = async (ip: string): Promise<{ bandwidth: number | null; error: boolean }> => {
try {
const startTime = Date.now(); // Tiempo inicial
await axios.get(`http://${ip}`, { timeout: 5000 }); // Realiza una solicitud GET a la IP
const endTime = Date.now(); // Tiempo final
const responseTime = endTime - startTime; // Calcula el tiempo de respuesta

return { bandwidth: responseTime, error: false }; // Retorna el tiempo de respuesta y sin error
} catch (err) {
console.error(`Error al medir ancho de banda para ${ip}:`, err);
return { bandwidth: null, error: true }; // Retorna error si no se puede conectar
}
};