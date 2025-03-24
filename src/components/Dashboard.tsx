// src/components/Dashboard.tsx
import React, { useContext } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { DeviceContext } from '../context/DeviceContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { onlineDevices, offlineDevices, totalDevices } = useContext(DeviceContext);

  // Logs para depurar
  console.log('Datos recibidos en Dashboard:', { onlineDevices, offlineDevices, totalDevices });

  // Validar que los valores no sean undefined
  if (!Array.isArray(onlineDevices) || !Array.isArray(offlineDevices)) {
    console.error('Error: onlineDevices o offlineDevices no son arrays válidos.');
    return (
      <Typography variant="h5" align="center">
        Error al cargar datos de dispositivos.
      </Typography>
    );
  }

  // Mostrar un indicador de carga si no hay dispositivos
  if (totalDevices === 0) {
    return (
      <Typography variant="h5" align="center">
        Cargando dispositivos...
      </Typography>
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
              data={{
                labels: ['En línea', 'Fuera de línea'],
                datasets: [
                  {
                    data: [onlineDevices.length, offlineDevices.length],
                    backgroundColor: ['#4caf50', '#f44336'], // Verde para en línea, rojo para fuera de línea
                    borderWidth: 0,
                  },
                ],
              }}
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
                  {totalDevices}
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