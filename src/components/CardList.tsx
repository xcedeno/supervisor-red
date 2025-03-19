// src/components/CardList.tsx
import React, { memo } from 'react';
import Card from './Card';
import { Device } from '../types/types';

interface CardListProps {
devices: Device[];
}

const CardList: React.FC<CardListProps> = ({ devices }) => {
return (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {devices.map((device) => (
    <Card key={device.id} device={device} />
    ))}
</div>
);
};

export default memo(CardList);