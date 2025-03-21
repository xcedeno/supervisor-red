// src/components/Dashboard.tsx
import React, { useContext, useMemo } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { DeviceContext } from '../context/DeviceContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
const { devices } = useContext(DeviceContext);

const onlineDevices = useMemo(
() => devices.filter(device => device.status === 'online'),
[devices]
);

const offlineDevices = useMemo(
() => devices.filter(device => device.status === 'offline'),
[devices]
);

const doughnutData = useMemo(() => ({
labels: ['En línea', 'Fuera de línea'],
datasets: [{
    data: [onlineDevices.length, offlineDevices.length],
    backgroundColor: ['#4caf50', '#f44336'], // Verde para en línea, rojo para fuera de línea
    borderWidth: 0,
}]
}), [onlineDevices, offlineDevices]);

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