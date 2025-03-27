import React from 'react';
import './DeviceCard.css'; // Importa el archivo CSS

interface DeviceCardProps {
  device: { id: string; name: string; ip: string; status?: 'online' | 'offline' }; // Agrega el campo `status`
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  // Determinar si el dispositivo está activo basado en su estado (`online` o `offline`)
  const isActive = device.status === 'online';

  return (
    <div className={`device-card ${isActive ? 'active' : 'inactive'}`}>
      {/* Nombre del dispositivo */}
      <h3>{device.name}</h3>

      {/* Dirección IP */}
      <p className="device-ip">{device.ip}</p>

      {/* Estado del dispositivo */}
      <p className="device-status">
        {device.status === undefined ? (
          <span className="status-loading">Cargando...</span>
        ) : isActive ? (
          <span className="status-active">Activo</span>
        ) : (
          <span className="status-inactive">Inactivo</span>
        )}
      </p>

      {/* Información adicional (opcional) */}
      <div className="ping-info">
        {device.status === undefined && <p className="ping-loading">Realizando ping...</p>}
        {device.status === 'online' && <p className="ping-success">Dispositivo en línea</p>}
        {device.status === 'offline' && <p className="ping-error">Dispositivo fuera de línea</p>}
      </div>
    </div>
  );
};

export default DeviceCard;