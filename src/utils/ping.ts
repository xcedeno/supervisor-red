// src/utils/ping.ts
const pingDevice = async (ip: string): Promise<'online' | 'offline'> => {
    try {
      console.log(`Realizando ping al dispositivo con IP: ${ip}`);
  
      // Configuración del timeout para evitar esperas infinitas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // Timeout de 2 segundos
  
      // Intentar realizar una solicitud HTTP HEAD al dispositivo
      const response = await fetch(`http://${ip}/ping`, {
        method: 'HEAD', // Usamos HEAD para minimizar el tráfico
        signal: controller.signal, // Cancelar la solicitud si se excede el timeout
      });
  
      clearTimeout(timeoutId); // Limpiar el timeout si la solicitud termina antes
  
      if (!response.ok) {
        throw new Error('Respuesta no válida');
      }
  
      console.log(`Dispositivo con IP ${ip} está online`);
      return 'online';
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Dispositivo con IP ${ip} está offline:`, error.message);
      } else {
        console.log(`Dispositivo con IP ${ip} está offline:`, error);
      }
      return 'offline';
    }
  };
  
  export default pingDevice;