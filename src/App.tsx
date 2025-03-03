import React, { useEffect, useState } from 'react';
import CardList from './components/CardList';
import './styles/styles.css';

interface Device {
  id: string;
  name: string;
  ip: string;
}

const App: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Cargar los datos del archivo JSON
    fetch('/devices.json') // Ruta relativa al archivo JSON en la carpeta public
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error('Error al cargar los dispositivos:', error));
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Supervisor de Red</h1>
      {devices.length > 0 ? (
        <CardList devices={devices} />
      ) : (
        <p className="text-center text-gray-600">Cargando dispositivos...</p>
      )}
    </div>
  );
};

export default App;