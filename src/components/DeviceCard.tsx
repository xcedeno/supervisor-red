// src/components/DeviceCard.tsx
import React from 'react';
import useBandwidthTest from '../hooks/useBandwidthTest'; // Importación con nombre
import './DeviceCard.css'; // Importa el archivo CSS

interface DeviceCardProps {
  device: { id: string; name: string; ip: string };
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { bandwidth, loading, error } = useBandwidthTest(device.ip); // Usa el hook
  const isOnline = !error && bandwidth !== null;

  return (
    <div className={`device-card ${isOnline ? 'online' : 'offline'}`}>
      {/* Nombre del dispositivo */}
      <h3>{device.name}</h3>

      {/* Dirección IP */}
      <p>{device.ip}</p>

      {/* Estado del dispositivo */}
      <p>{isOnline ? 'Activo' : 'Inactivo'}</p>

      {/* Resultado de la prueba de ancho de banda */}
      <div>
        {loading && <p className="bandwidth-loading">Probando ancho de banda...</p>}
        {error && <p className="bandwidth-error">Error al medir ancho de banda</p>}
        {bandwidth !== null && (
          <p className="bandwidth-result">Ancho de banda: {bandwidth} ms</p>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;