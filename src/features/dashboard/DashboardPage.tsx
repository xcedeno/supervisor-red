import React, { useMemo, useState } from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AddIcon from '@mui/icons-material/Add';
import useDevices from './hooks/useDevices';
import CardList from './components/CardList';
import AddDeviceModal from './components/AddDeviceModal';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage: React.FC = () => {
  const { devices, loading, onlineDevices, offlineDevices, totalDevices } = useDevices();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const chartData = useMemo(() => ({
    labels: ['En línea', 'Fuera de línea'],
    datasets: [
      {
        data: [onlineDevices.length, offlineDevices.length],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 0,
      },
    ],
  }), [onlineDevices.length, offlineDevices.length]);

  if (loading && totalDevices === 0) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 4 }}>
        Cargando dispositivos...
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom component="div">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Agregar Dispositivo
        </Button>
      </Grid>

      {/* Gráfico principal */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent sx={{ height: 350, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Estado de Dispositivos
            </Typography>
            <div style={{ height: '250px', width: '100%', position: 'relative' }}>
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Métricas adicionales */}
      <Grid item xs={12} md={4}>
        <Grid container spacing={3}>
          {/* Total de dispositivos */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
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
              <CardContent sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                {/* bgcolor used instead of style for MUI integration, though custom colors easier with sx */}
                <Typography variant="subtitle1">
                  En línea
                </Typography>
                <Typography variant="h4">
                  {onlineDevices.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Dispositivos fuera de línea */}
          <Grid item xs={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
                <Typography variant="subtitle1">
                  Fuera de línea
                </Typography>
                <Typography variant="h4">
                  {offlineDevices.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
          Todos los dispositivos
        </Typography>
        <CardList devices={devices} />
      </Grid>

      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Grid>
  );
};

export default DashboardPage;