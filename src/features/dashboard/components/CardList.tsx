import React, { memo } from 'react';
import DeviceCard from './DeviceCard';
import { Device } from '../../../types/device';


interface CardListProps {
    devices: Device[];
}


const CardList: React.FC<CardListProps> = ({ devices }) => {
    console.log('CardList - Received Devices:', devices);

    if (!devices || devices.length === 0) {
        return <p className="text-center text-gray-500 mt-4 text-lg">No hay dispositivos disponibles.</p>;
    }

    const onlineCount = devices.filter((device) => device.status === 'online').length;
    const offlineCount = devices.filter((device) => device.status === 'offline').length;
    const totalCount = devices.length;

    return (
        <div className="max-w-[1400px] mx-auto p-5">
            <div className="flex flex-wrap justify-center gap-6 mb-8 bg-white p-4 rounded-xl shadow-sm">
                <p className="text-lg font-bold text-gray-700">
                    Total: <span className="ml-2 text-2xl text-blue-600">{totalCount}</span>
                </p>
                <p className="text-lg font-bold text-gray-700">
                    En línea: <span className="ml-2 text-2xl text-green-600">{onlineCount}</span>
                </p>
                <p className="text-lg font-bold text-gray-700">
                    Fuera de línea: <span className="ml-2 text-2xl text-red-600">{offlineCount}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {devices.map((device) => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>
        </div>
    );
};

export default memo(CardList);