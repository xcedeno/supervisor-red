// src/components/Card.tsx
import React from 'react';
import useDevicePing from '../hooks/useDevicePing';
import { Device } from '../types/types';

interface CardProps {
device: Device;
}

const Card: React.FC<CardProps> = ({ device }) => {
const isOnline = useDevicePing(device); // Usa el hook para obtener el estado en tiempo real

return (
<div className={`card ${isOnline ? 'online' : 'offline'}`}>
    <h3>{device.name}</h3>
    <p>{device.ip}</p>
    <p>{isOnline ? 'Activo' : 'Inactivo'}</p>
</div>
);
};

export default Card;