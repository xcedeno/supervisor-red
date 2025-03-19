// src/components/Card.tsx
import React, { memo } from 'react';
import { Device } from '../types/types';
import './Card.css'; // Importa el archivo CSS

interface CardProps {
device: Device;
}

const Card: React.FC<CardProps> = ({ device }) => {
const status = device.status || 'offline'; // Asegura un valor predeterminado

return (
<div
    className={`card ${status === 'online' ? 'online' : 'offline'}`}
>
    <h3>{device.name}</h3>
    <p>{device.ip}</p>
    <p>{status === 'online' ? 'Activo' : 'Inactivo'}</p>
</div>
);
};

export default memo(Card);