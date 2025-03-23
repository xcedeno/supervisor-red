// src/components/DeviceCard.tsx
import React from 'react';
import { useBandwidthTest } from '../hooks/useBandwidthTest'; // Importa como exportación con nombre
import './DeviceCard.css'; // Importa el archivo CSS

interface DeviceCardProps {
  device: { id: string; name: string; ip: string };
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { bandwidth, loading, error } = useBandwidthTest(device.ip); // Prueba de ancho de banda

  // Determinar el estado del dispositivo basado en el ancho de banda
  const isActive = !error && bandwidth !== null;

  return (
    <div className={`device-card ${isActive ? 'active' : 'inactive'}`}>
      {/* Nombre del dispositivo */}
      <h3>{device.name}</h3>

      {/* Dirección IP */}
      <p className="device-ip">{device.ip}</p>

      {/* Estado del dispositivo */}
      <p className="device-status">
        {loading ? (
          <span className="status-loading">Cargando...</span>
        ) : isActive ? (
          <span className="status-active">Activo</span>
        ) : (
          <span className="status-inactive">Inactivo</span>
        )}
      </p>

      {/* Resultado de la prueba de ancho de banda */}
      <div className="bandwidth-info">
        {loading && <p className="bandwidth-loading">Probando ancho de banda...</p>}
        {error && <p className="bandwidth-error">Error al medir ancho de banda</p>}
        {bandwidth !== null && (
          <p className="bandwidth-result">Tiempo de respuesta: {bandwidth} ms</p>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;