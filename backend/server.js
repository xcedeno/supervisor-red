// Archivo: server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import { getAllDevices, addDevice } from './database.js';

// Configuración de __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Ruta para obtener todos los dispositivos
app.get('/api/devices', (req, res) => {
  try {
    const devices = getAllDevices();
    res.json(devices);
  } catch (error) {
    console.error('Error al obtener dispositivos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para agregar un nuevo dispositivo
app.post('/api/devices', (req, res) => {
  try {
    const newDevice = req.body;

    // Validación básica
    if (!newDevice.id || !newDevice.name || !newDevice.ip || !newDevice.torre) {
      return res.status(400).send('Faltan campos requeridos (id, name, ip, torre)');
    }

    try {
      addDevice(newDevice);
      res.status(201).json(newDevice);
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
        return res.status(409).send('El ID del dispositivo ya existe');
      }
      throw err;
    }
  } catch (error) {
    console.error('Error al guardar dispositivo:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Pool de workers limitado
const MAX_WORKERS = 5;
const workerPool = [];
const requestQueue = []; // Cola de solicitudes pendientes

const processNextRequest = () => {
  if (requestQueue.length === 0) return;

  const worker = workerPool.find((w) => !w.busy);
  if (!worker) return;

  const { ip, res } = requestQueue.shift();
  worker.busy = true;
  worker.currentIp = ip; // Track IP for logging
  worker.postMessage(ip);

  // Asignar el listener de respuesta solo para esta solicitud
  // Usamos 'once' pero necesitamos limpiar si hay timeout externo, 
  // pero el worker.js maneja su propia logica de respuesta.
  // Simplificación: Asignamos callback al worker

  worker.currentRes = res;

  // Timeout de seguridad en el servidor principal
  worker.timeout = setTimeout(() => {
    if (worker.busy && worker.currentIp === ip) {
      console.error(`Timeout forzado en server para IP: ${ip}`);
      worker.busy = false;
      // No podemos cancelar el worker thread facilmente sin terminarlo,
      // pero podemos ignorar su respuesta y liberar el worker.
      // Lo ideal sería worker.terminate() y crear uno nuevo, pero es costoso.
      // Simplemente enviamos 504 al cliente.
      try {
        if (!res.headersSent) res.status(504).send('Timeout');
      } catch (e) { }
      processNextRequest();
    }
  }, 12000); // 12 seg (mayor que el timeout del ping)
};


for (let i = 0; i < MAX_WORKERS; i++) {
  const worker = new Worker(path.join(__dirname, 'pingWorker.js'));
  worker.busy = false;

  worker.on('message', (response) => {
    clearTimeout(worker.timeout);
    worker.busy = false;
    // console.log(`Worker ${i} libre. IP: ${response.ip}, Status: ${response.status}`);

    if (worker.currentRes) {
      try {
        if (!worker.currentRes.headersSent) {
          worker.currentRes.json(response);
        }
      } catch (e) { console.error("Error enviando respuesta", e); }
      worker.currentRes = null;
    }

    processNextRequest();
  });

  worker.on('error', (error) => {
    clearTimeout(worker.timeout);
    worker.busy = false;
    console.error(`Error en worker ${i}:`, error.message || error);

    if (worker.currentRes) {
      try {
        if (!worker.currentRes.headersSent) worker.currentRes.status(500).send('Worker Error');
      } catch (e) { }
      worker.currentRes = null;
    }
    processNextRequest();
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker terminó con código de salida ${code}`);
    }
    // Deberíamos reemplazar el worker muerto, pero por simplicidad omitimos
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
    // Si no hay workers libres, encolar
    console.log(`Todos los workers ocupados. Encolando petición para ${ip}. Cola: ${requestQueue.length}`);
    requestQueue.push({ ip, res });
    return;
  }

  // Si hay worker libre, usarlo (la logica esta centralizada en processNextRequest si quisieramos,
  // pero aqui podemos optimizar tomando el worker directo)
  // Para mantener consistencia, empujamos a queue y procesamos inmediato.
  requestQueue.push({ ip, res });
  processNextRequest();
});

// Iniciar el servidor
app.listen(3002, () => console.log('Servidor corriendo en http://localhost:3002'));