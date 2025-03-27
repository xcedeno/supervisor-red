import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import ping from 'ping'; // Usamos el módulo `ping` para realizar mediciones ICMP

// Configuración de __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors({
origin: '*', // Permite solicitudes desde cualquier origen
methods: ['GET', 'POST'], // Métodos HTTP permitidos
allowedHeaders: ['Content-Type'], // Encabezados permitidos
}));

// Ruta para obtener todos los dispositivos
const filePath = path.join(__dirname, 'public', 'devices.json'); // Archivo JSON con los datos

app.get('/api/devices', (req, res) => {
try {
console.log('Solicitud GET recibida en /api/devices');
if (fs.existsSync(filePath)) {
    console.log('Archivo devices.json encontrado:', filePath);
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    readStream.pipe(res);
} else {
    console.log('Archivo devices.json no encontrado. Creando uno nuevo...');
    const data = [];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json(data); // Devuelve los dispositivos como JSON
}
} catch (error) {
console.error('Error al leer devices.json:', error);
res.status(500).send('Error interno del servidor');
}
});

// Cache temporal para almacenar estados de dispositivos
const deviceCache = new Map();

// Función para limpiar la caché después de un tiempo
const clearCacheAfter = (ip, ttl = 10000) => {
setTimeout(() => {
deviceCache.delete(ip);
console.log(`Cache eliminada para la IP: ${ip}`);
}, ttl);
};

// Ruta para verificar el estado de un dispositivo mediante ICMP ping
app.get('/api/ping/:ip', async (req, res) => {
const { ip } = req.params;

// Validar que la IP sea válida
if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
return res.status(400).send('IP no válida');
}

// Verificar si el estado está en caché
if (deviceCache.has(ip)) {
    console.log(`Estado de la IP ${ip} obtenido desde la caché`);
    return res.json(deviceCache.get(ip));
}
try {
console.log(`Realizando ping ICMP a la IP: ${ip}`);
const result = await ping.promise.probe(ip, { timeout: 3 }); // Timeout de 5 segundos

const status = result.alive ? 'online' : 'offline';
const response = { ip, status };

// Almacenar en caché
deviceCache.set(ip, response);
clearCacheAfter(ip); // Eliminar de la caché después de 10 segundos

res.json(response);
} catch (error) {
console.error(`Error al hacer ping ICMP a la IP ${ip}:`, error.message || error);
res.status(500).send('Error interno del servidor');
}
});

// Función para verificar el estado de un dispositivo usando ICMP ping
const checkDeviceStatus = async (deviceIp) => {
try {
console.log(`Realizando ping ICMP al dispositivo ${deviceIp}`);
const result = await ping.promise.probe(deviceIp, { timeout: 5 }); // Timeout de 5 segundos

if (result.alive) {
    console.log(`Dispositivo ${deviceIp} está en línea`);
    return { status: 'online' };
} else {
    console.log(`Dispositivo ${deviceIp} está fuera de línea`);
    return { status: 'offline' };
}
} catch (error) {
console.error(`Error al verificar el estado del dispositivo ${deviceIp}:`, error);
return { status: 'offline' };
}
};

// Ejemplo de uso de checkDeviceStatus en una ruta
app.get('/api/check-status/:ip', async (req, res) => {
const { ip } = req.params;

// Validar que la IP sea válida
if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
return res.status(400).send('IP no válida');
}

try {
const status = await checkDeviceStatus(ip);
res.json({ ip, status: status.status });
} catch (error) {
console.error(`Error al verificar el estado del dispositivo ${ip}:`, error);
res.status(500).send('Error interno del servidor');
}
});

// Iniciar el servidor
app.listen(3001, () => console.log('Servidor corriendo en http://localhost:3001'));