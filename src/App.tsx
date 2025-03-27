// src/App.tsx
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

import CardList from './components/CardList';
import useDevices from './hooks/useDevices';
import { DeviceProvider } from './context/DeviceProvider';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const App: React.FC = () => {
const { devices, loading } = useDevices();
// Removed unused isModalOpen state
const [selectedTorre, setSelectedTorre] = useState<string | null>(null);

// Filtrar dispositivos según torre seleccionada
const filteredDevices = selectedTorre
  ? devices.filter(device => device.torre === selectedTorre)
  : devices;

// Validar que filteredDevices sea un array
if (!Array.isArray(filteredDevices)) {
  console.error('filteredDevices no es un array:', filteredDevices);
}

// Contenido del drawer
  // Contenido del drawer
  const drawerContent = (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSelectedTorre(null)}>
            <ListItemText primary="Ver todas las torres" />
          </ListItemButton>
        </ListItem>
        {Array.from(new Set(devices.map(device => device.torre))).map(torre => (
          <ListItemButton
            key={torre}
            selected={selectedTorre === torre}
            onClick={() => setSelectedTorre(torre)}
          >
            <ListItemText primary={`Torre ${torre}`} />
          </ListItemButton>
        ))}
        <ListItemButton>
          <ListItemText primary="Agregar Dispositivo" />
        </ListItemButton>
      </List>
    </>
  );

return (
    <DeviceProvider>
    <Layout drawerContent={drawerContent}>
      <Dashboard /> {/* Ya no se pasan props */}
      
      {loading ? (
        <p className="text-center text-gray-600">Cargando dispositivos...</p>
      ) : filteredDevices.length > 0 ? (
        <CardList devices={filteredDevices} />
      ) : (
        <p className="text-center text-gray-600">No hay dispositivos disponibles</p>
      )}
    </Layout>
  </DeviceProvider>
);
};

export default App;