import React, { useMemo } from 'react';
import { Grid, Card, CardContent, Typography, useTheme } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Device } from '../types/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardProps {
devices: Device[];
loading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ devices, loading }) => {
const theme = useTheme();

// Calcular dispositivos con memoización
const onlineDevices = useMemo(
() => devices.filter(device => device.status === 'online'),
[devices]
);

const offlineDevices = useMemo(
() => devices.filter(device => device.status !== 'online'),
[devices]
);

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