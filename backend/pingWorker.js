// Archivo: pingWorker.js
const { parentPort } = require('worker_threads');
const ping = require('ping');

parentPort.on('message', async (ip) => {
  try {
    // Realizar el ping al dispositivo
    const result = await ping.promise.probe(ip, {
      timeout: 5,
      extra: ['-i', '2'], // Opciones adicionales para el ping
    });

    // Enviar el resultado al hilo principal
    parentPort.postMessage({ ip, status: result.alive ? 'online' : 'offline' });
  } catch (error) {
    // Enviar un mensaje de error al hilo principal
    parentPort.postMessage({ ip, status: 'offline', error: error.message });
  }
});