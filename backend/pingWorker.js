// Archivo: pingWorker.js
import { parentPort } from 'worker_threads';
import { exec } from 'child_process';
import util from 'util';
import net from 'net';

const execPromise = util.promisify(exec);

// Function to check TCP port
const checkPort = (ip, port) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1500); // 1.5s timeout

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', (err) => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, ip);
  });
};

// Function to check ICMP Ping (OS native)
const pingSystem = async (ip) => {
  try {
    // Windows ping command: ping -n 1 -w 2000 <ip>
    console.log(`[Worker] Pinging ${ip}...`);
    const { stdout } = await execPromise(`ping -n 1 -w 2000 ${ip}`);

    console.log(`[Worker] Ping stdout for ${ip}: "${stdout.trim()}"`); // DEBUG LOG
    const output = stdout.toLowerCase();

    // Check for "TTL=" which works for both English ("TTL=") and Spanish ("TTL=")
    if (output.includes('ttl=')) {
      console.log(`[Worker] ICMP Success for ${ip}`);
      return true;
    }

    console.log(`[Worker] ICMP Failed for ${ip} (No TTL)`);
    return false;
  } catch (e) {
    console.log(`[Worker] Ping Exec Error for ${ip}:`, e.message);
    return false;
  }
};

parentPort.on('message', async (ip) => {
  try {
    // 1. Try System Ping (ICMP) with robust parsing
    const isAliveICMP = await pingSystem(ip);

    if (isAliveICMP) {
      parentPort.postMessage({ ip, status: 'online', method: 'icmp' });
      return;
    }

    // 2. Fallback: Try TCP Connect if ICMP failed
    // Many firewalls block ICMP but allow service ports.
    console.log(`[Worker] ICMP failed for ${ip}, trying TCP fallback...`);
    const [port80, port3000, port3001] = await Promise.all([
      checkPort(ip, 80),
      checkPort(ip, 3000),
      checkPort(ip, 3001)
    ]);

    if (port80 || port3000 || port3001) {
      console.log(`[Worker] TCP Success for ${ip}`);
      parentPort.postMessage({ ip, status: 'online', method: 'tcp' });
      return;
    }

    console.log(`[Worker] All checks failed for ${ip}`);
    // If both fail
    parentPort.postMessage({ ip, status: 'offline' });

  } catch (error) {
    // Basic error handling
    console.error(`[Worker] Error for ${ip}:`, error);
    parentPort.postMessage({ ip, status: 'offline', error: error.message });
  }
});