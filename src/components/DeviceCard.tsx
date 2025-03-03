import React from 'react';
import useDevicePing from '../hooks/useDevicePing';
import { useBandwidthTest } from '../hooks/useBandwidthTest'; // Importa como exportación con nombre

interface DeviceCardProps {
device: { id: string; name: string; ip: string };
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
const status = useDevicePing(device);
const { bandwidth, loading, error } = useBandwidthTest(device.ip);

return (
<div className={`device-card ${status ? 'active' : ''}`}>
    <h3>{device.name}</h3>
    <p>{device.ip}</p>
    <p>{status ? 'Activo' : 'Inactivo'}</p>
    <div>
    {loading && <p>Probando ancho de banda...</p>}
    {error && <p>Error al medir ancho de banda</p>}
    {bandwidth !== null && (
        <p>Ancho de banda: {bandwidth} ms</p>
    )}
    </div>
</div>
);
};

export default DeviceCard;