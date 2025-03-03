import React from 'react';
import DeviceCard from './DeviceCard';

interface CardListProps {
devices: { id: string; name: string; ip: string }[];
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

export default CardList;