import React, { memo } from 'react';
import DeviceCard from './DeviceCard';
import { Device } from '../types/types';
import './CardList.css'; // Importa el archivo CSS

interface CardListProps {
devices: Device[];
}

const CardList: React.FC<CardListProps> = ({ devices }) => {
// Validar que los dispositivos estén presentes
console.log('Dispositivos recibidos en CardList:', devices);

if (!devices || devices.length === 0) {
return <p>No hay dispositivos disponibles.</p>;
}

// Conteo de dispositivos en línea, fuera de línea y total
const onlineCount = devices.filter((device) => device.status === 'online').length;
const offlineCount = devices.filter((device) => device.status === 'offline').length;
const totalCount = devices.length; // Total de dispositivos

return (
<div className="card-list-container">
    {/* Sección de conteo */}
    <div className="count-section">
    <p className="count-total">
        Total de dispositivos: <span>{totalCount}</span>
    </p>
    <p className="count-online">
        En línea: <span>{onlineCount}</span>
    </p>
    <p className="count-offline">
        Fuera de línea: <span>{offlineCount}</span>
    </p>
    </div>

    {/* Lista de dispositivos */}
    <div className="card-list">
    {devices.map((device) => (
        <DeviceCard key={device.id} device={device} />
    ))}
    </div>
</div>
);
};

export default memo(CardList);