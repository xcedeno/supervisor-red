// src/components/CardList.tsx
import React, { memo } from 'react';
import DeviceCard from './DeviceCard';
import { Device } from '../types/types';
import './CardList.css'; // Importa el archivo CSS

interface CardListProps {
devices: Device[];
}

const CardList: React.FC<CardListProps> = ({ devices }) => {
return (
<div className="card-list">
    {devices.map((device) => (
    <DeviceCard key={device.id} device={device} />
    ))}
</div>
);
};

export default memo(CardList);