import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fetch from 'node-fetch';
import { exec } from 'child_process'; // Agregado para ejecutar

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

// Proxy dinámico para IPs en cualquier segmento
// Proxy dinámico para IPs en cualquier segmento
app.get('/proxy/:ip', async (req, res) => {
const { ip } = req.params;

try {
    console.log(`Realizando solicitud al proxy para IP: ${ip}`);
    const response = await fetch(`http://${ip}/`, { timeout: 5000 }); // Timeout de 5 segundos

    if (!response.ok) {
    throw new Error('Error al hacer proxy');
    }

    // Agregar encabezados CORS manualmente
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite cualquier origen
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Encabezados permitidos

    // Redirigir la respuesta del dispositivo al frontend
    response.body.pipe(res);
} catch (error) {
    console.error(`Error al hacer proxy para IP ${ip}:`, error);
    res.status(500).send('Error interno del servidor');
}
});

// Nueva ruta para obtener la MAC address de una IP
app.get('/api/mac/:ip', (req, res) => {
const { ip } = req.params;

// Validar que la IP pertenezca al segmento 192.168.17.x
if (!/^192\.168\.17\.\d+$/.test(ip)) {
return res.status(403).send('IP no permitida');
}

// Ejecutar comando ARP para buscar la MAC address
exec(`arp -a ${ip}`, (error, stdout, stderr) => {
if (error) {
console.error('Error al ejecutar ARP:', error);
return res.status(500).send('Error al obtener la MAC address');
}

// Extraer la MAC address del resultado
const macMatch = stdout.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
if (macMatch) {
res.json({ ip, mac: macMatch[0] });
} else {
res.status(404).send('MAC address no encontrada');
}
});
});
const checkDeviceStatus = async (deviceIp) => {
try {
const response = await fetch(`http://localhost:3001/proxy/${deviceIp}`, { method: 'GET' });

if (response.ok) {
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

app.listen(3001, () => console.log('Servidor corriendo en http://localhost:3001'));