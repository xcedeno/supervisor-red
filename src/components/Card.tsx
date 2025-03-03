import React from 'react';
import { Device } from '../types/types';

interface CardProps {
device: Device;
}

const Card: React.FC<CardProps> = ({ device }) => {
return (
<div
    className={`p-4 rounded-lg shadow-md text-center w-48 ${
    device.status ? 'bg-green-500' : 'bg-red-500'
    } text-white`}
>
    <h3 className="text-lg font-bold">{device.name}</h3>
    <p className="text-sm">{device.ip}</p>
    <p className="text-sm">{device.status ? 'Activo' : 'Inactivo'}</p>
</div>
);
};

export default Card;