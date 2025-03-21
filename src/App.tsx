// src/App.tsx
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AddDeviceModal from './components/AddDeviceModal';
import CardList from './components/CardList';
import useDevices from './hooks/useDevices';
import { DeviceProvider } from './context/DeviceProvider';

const App: React.FC = () => {
const { devices, loading, addDevice } = useDevices();
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedTorre] = useState<string | null>(null);

// Filtrar dispositivos según torre seleccionada
const filteredDevices = selectedTorre
  ? devices.filter(device => device.torre === selectedTorre)
  : devices;

// Contenido del drawer
const drawerContent = (
  <>
    {/* ... contenido del drawer ... */}
  </>
);

return (
  <DeviceProvider>
    <Layout drawerContent={drawerContent}>
      <Dashboard /> {/* Ya no se pasan props */}
      <AddDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddDevice={addDevice}
      />
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