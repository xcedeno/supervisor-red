import React, { useEffect, useState } from 'react';
import CardList from './components/CardList';
import AddDeviceModal from './components/AddDeviceModal';
import './styles/styles.css';

interface Device {
  id: string;
  name: string;
  ip: string;
  torre: string; // Campo agregado
}

const App: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar dispositivos desde la API
  useEffect(() => {
    fetch('http://localhost:3001/api/devices') // Endpoint GET
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los dispositivos');
        }
        return response.json();
      })
      .then((data) => setDevices(data))
      .catch((error) => console.error('Error al cargar los dispositivos:', error));
  }, []);

  // Función para agregar un nuevo dispositivo
  const handleAddDevice = async (newDevice: { id: string; name: string; ip: string; torre: string }) => {
    try {
      const response = await fetch('http://localhost:3001/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDevice),
      });
  
      if (!response.ok) {
        throw new Error('Error al agregar el dispositivo');
      }
  
      const data = await response.json();
      console.log('Dispositivo agregado:', data);
    } catch (error) {
      console.error('Error al agregar el dispositivo:', error);
    }
  };
  

  // Agrupar dispositivos por torre
  const groupedDevices = devices.reduce((acc, device) => {
    if (!acc[device.torre]) {
      acc[device.torre] = [];
    }
    acc[device.torre].push(device);
    return acc;
  }, {} as Record<string, Device[]>);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Supervisor de Red</h1>

      {/* Botón para abrir el modal */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Agregar Dispositivo
        </button>
      </div>

      {/* Modal */}
      <AddDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddDevice={handleAddDevice}
      />

      {/* Lista de dispositivos */}
      {Object.keys(groupedDevices).length > 0 ? (
        Object.entries(groupedDevices).map(([torre, devicesInTower]) => (
          <div key={torre} className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">{`Torre ${torre}`}</h2>
            <CardList devices={devicesInTower} />
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">Cargando dispositivos...</p>
      )}
    </div>
  );
};

export default App;