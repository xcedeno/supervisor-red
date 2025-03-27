// Archivo: server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Worker } from 'worker_threads';

// Configuración de __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Ruta para obtener todos los dispositivos
const filePath = path.join(__dirname, 'public', 'devices.json');

app.get('/api/devices', (req, res) => {
  try {
    if (fs.existsSync(filePath)) {
      const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
      readStream.pipe(res);
    } else {
      const data = [];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.json(data);
    }
  } catch (error) {
    console.error('Error al leer devices.json:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Pool de workers limitado
const MAX_WORKERS = 5;
const workerPool = [];

for (let i = 0; i < MAX_WORKERS; i++) {
  const worker = new Worker(path.join(__dirname, 'pingWorker.js'));
  worker.busy = false;

  worker.on('message', (response) => {
    worker.busy = false;
    console.log(`Worker libre después de procesar IP: ${response.ip}`);
  });

  worker.on('error', (error) => {
    worker.busy = false;
    console.error(`Error en worker:`, error.message || error);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker terminó con código de salida ${code}`);
    }
  });

  workerPool.push(worker);
}

// Ruta para verificar el estado de un dispositivo mediante ICMP ping usando workers
app.get('/api/ping/:ip', async (req, res) => {
  const { ip } = req.params;

  // Validar que la IP sea válida
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    return res.status(400).send('IP no válida');
  }

  // Encontrar un worker disponible
  const worker = workerPool.find((w) => !w.busy);
  if (!worker) {
    return res.status(503).send('Servidor ocupado, inténtelo más tarde');
  }

  worker.busy = true;
  worker.postMessage(ip);

  const timeout = setTimeout(() => {
    worker.busy = false;
    console.error(`Timeout para la solicitud de ping a la IP: ${ip}`);
    res.status(504).send('Timeout al procesar la solicitud');
  }, 10000); // Timeout de 10 segundos

  worker.once('message', (response) => {
    clearTimeout(timeout); // Limpiar el timeout si se recibe una respuesta
    console.log(`Ping realizado para la IP ${ip}:`, response);
    res.json(response); // Enviar la respuesta al cliente
  });

  worker.once('error', (error) => {
    clearTimeout(timeout); // Limpiar el timeout si ocurre un error
    worker.busy = false;
    console.error(`Error en worker para IP ${ip}:`, error.message || error);
    res.status(500).send('Error interno del servidor');
  });
});

// Iniciar el servidor
app.listen(3001, () => console.log('Servidor corriendo en http://localhost:3001'));