import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
let data;
if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
} else {
    data = []; // Crea un array vacío si el archivo no existe
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
res.json(data); // Devuelve los dispositivos como JSON
} catch (error) {
console.error('Error al leer devices.json:', error);
res.status(500).send('Error interno del servidor');
}
});

// Proxy dinámico para IPs en cualquier segmento
app.get('/proxy/:ip', async (req, res) => {
const { ip } = req.params;

try {
const response = await fetch(`http://${ip}/`);
const data = await response.text(); // O .json() si la respuesta es JSON
res.send(data);
} catch (error) {
console.error('Error al hacer proxy:', error);
res.status(500).send('Error interno del servidor');
}
});

app.listen(3001, () => console.log('Servidor corriendo en http://localhost:3001'));