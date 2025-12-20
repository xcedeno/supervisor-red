import React from 'react';
import { Device } from '../../../types/device';


interface DeviceCardProps {
  device: Device;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const isActive = device.status === 'online';

  return (
    <div className={`p-4 m-2 border rounded-lg text-center shadow-md transition-all duration-300 ${isActive
      ? 'bg-green-50 border-green-500 hover:shadow-lg'
      : 'bg-red-50 border-red-500 hover:shadow-lg'
      }`}>
      <h3 className="text-lg font-bold mb-2 text-gray-800">{device.name}</h3>
      <p className="text-sm font-mono text-gray-600 mb-4">{device.ip}</p>

      <div className="mb-2">
        {device.status === undefined ? (
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-600">
            Cargando...
          </span>
        ) : isActive ? (
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800">
            Activo
          </span>
        ) : (
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-red-200 text-red-800">
            Inactivo
          </span>
        )}
      </div>

      <div className="text-xs mt-2">
        {device.status === undefined && <p className="text-blue-500 italic">Realizando ping...</p>}
        {device.status === 'online' && <p className="text-green-600 font-medium">Dispositivo en línea</p>}
        {device.status === 'offline' && <p className="text-red-600 font-medium">Dispositivo fuera de línea</p>}
      </div>
    </div>
  );
};

export default DeviceCard;