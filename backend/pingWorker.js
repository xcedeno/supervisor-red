// Importar módulos usando import en lugar de require
import { parentPort } from 'worker_threads';
import ping from 'ping';

// Realizar el ping ICMP
const performPing = async (ip) => {
try {
console.log(`Realizando ping ICMP a la IP: ${ip}`);
const result = await ping.promise.probe(ip, { timeout: 3 }); // Timeout de 3 segundos
const status = result.alive ? 'online' : 'offline';
parentPort.postMessage({ ip, status });
} catch (error) {
console.error(`Error al hacer ping ICMP a la IP ${ip}:`, error.message || error);
parentPort.postMessage({ ip, status: 'offline' });
}
};

// Escuchar mensajes del hilo principal
parentPort.on('message', (ip) => {
performPing(ip);
});