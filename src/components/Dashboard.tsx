import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Card, CardContent, Typography, useTheme } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Device, DeviceStatus } from '../types/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardProps {
devices: Device[];
loading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ devices, loading }) => {
const theme = useTheme();

// Estado para almacenar los dispositivos con su estado (online/offline)
const [devicesStatus, setDevicesStatus] = useState<DeviceStatus[]>([]);

// Efecto para calcular el estado de los dispositivos
useEffect(() => {
const fetchDeviceStatuses = async () => {
    const updatedDevices = await Promise.all(
    devices.map(async (device) => {
        try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 2 segundos
        const response = await fetch(`http://${device.ip}/ping`, { method: 'GET', signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('No se pudo medir el ancho de banda');
        }

        return { ...device, status: 'online' as const };
        } catch (error) {
        console.error(`Error al hacer ping a ${device.name} (${device.ip}):`, error);
        return { ...device, status: 'offline' as const };
        }
    })
    );

    setDevicesStatus(updatedDevices);
};

fetchDeviceStatuses();
}, [devices]);

// Filtrar dispositivos en línea y fuera de línea
const onlineDevices = useMemo(() => {
return devicesStatus.filter((device) => device.status === 'online');
}, [devicesStatus]);

const offlineDevices = useMemo(() => {
return devicesStatus.filter((device) => device.status === 'offline');
}, [devicesStatus]);

// Datos del gráfico con memoización
const doughnutData = useMemo(() => ({
labels: ['En línea', 'Fuera de línea'],
datasets: [{
    data: [onlineDevices.length, offlineDevices.length],
    backgroundColor: [
    theme.palette.success.main,
    theme.palette.error.main,
    ],
    borderWidth: 0,
}]
}), [onlineDevices, offlineDevices, theme]);

if (loading) {
return (
    <Grid container spacing={3}>
    <Grid item xs={12}>
        <Typography variant="h5" align="center">
        Actualizando datos...
        </Typography>
    </Grid>
    </Grid>
);
}

if (!devices.length) {
return (
    <Grid container spacing={3}>
    <Grid item xs={12}>
        <Typography variant="h5" align="center">
        No hay dispositivos disponibles.
        </Typography>
    </Grid>
    </Grid>
);
}

return (
<Grid container spacing={3}>
    {/* Gráfico principal */}
    <Grid item xs={12} md={8}>
    <Card>
        <CardContent sx={{ height: 350, position: 'relative' }}>
        <Typography variant="h5" gutterBottom>
            Estado de Dispositivos
        </Typography>
        <Doughnut
            data={doughnutData}
            options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                position: 'bottom',
                },
            },
            }}
            style={{ height: '300px' }}
        />
        </CardContent>
    </Card>
    </Grid>

    {/* Métricas adicionales */}
    <Grid item xs={12} md={4}>
    <Grid container spacing={3}>
        {/* Total de dispositivos */}
        <Grid item xs={12}>
        <Card>
            <CardContent sx={{ textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <Typography variant="h5" component="div" color="text.secondary">
                Total Dispositivos
            </Typography>
            <Typography variant="h3" color="primary">
                {devices.length}
            </Typography>
            </CardContent>
        </Card>
        </Grid>

        {/* Dispositivos en línea */}
        <Grid item xs={6}>
        <Card>
            <CardContent sx={{ textAlign: 'center', backgroundColor: '#e8f5e9' }}>
            <Typography variant="h6" color="success.main">
                En línea
            </Typography>
            <Typography variant="h4" color="success.dark">
                {onlineDevices.length}
            </Typography>
            </CardContent>
        </Card>
        </Grid>

        {/* Dispositivos fuera de línea */}
        <Grid item xs={6}>
        <Card>
            <CardContent sx={{ textAlign: 'center', backgroundColor: '#ffebee' }}>
            <Typography variant="h6" color="error.main">
                Fuera de línea
            </Typography>
            <Typography variant="h4" color="error.dark">
                {offlineDevices.length}
            </Typography>
            </CardContent>
        </Card>
        </Grid>
    </Grid>
    </Grid>
</Grid>
);
};

export default Dashboard;