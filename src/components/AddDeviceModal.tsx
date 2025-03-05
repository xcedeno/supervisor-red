import React, { useState } from 'react';

interface AddDeviceModalProps {
isOpen: boolean;
onClose: () => void;
onAddDevice: (newDevice: { id: string; name: string; ip: string; torre: string }) => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onAddDevice }) => {
const [formData, setFormData] = useState({
id: '',
name: '',
ip: '',
torre: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
onAddDevice(formData); // Envía los datos al componente padre
setFormData({ id: '', name: '', ip: '', torre: '' }); // Limpia el formulario
onClose(); // Cierra el modal
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 bg-gray-900 flex justify-center items-center z-50">
    {/* Contenedor del modal */}
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-fade-in">
    {/* Encabezado */}
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Agregar Nuevo Dispositivo</h2>
        <button
        title="Close"
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        </button>
    </div>

    {/* Formulario */}
    <form onSubmit={handleSubmit}>
        <div className="space-y-4">
        {/* Campo ID */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="Enter ID"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>

        {/* Campo Nombre */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Nombre"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>

        {/* Campo IP */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IP</label>
            <input
            type="text"
            name="ip"
            value={formData.ip}
            onChange={handleChange}
            placeholder="Enter IP"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>

        {/* Campo Torre */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Torre</label>
            <input
            type="text"
            name="torre"
            value={formData.torre}
            onChange={handleChange}
            placeholder="Enter Torre"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex justify-end gap-4">
        <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"
        >
            Cancelar
        </button>
        <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
            Guardar
        </button>
        </div>
    </form>
    </div>
</div>
);
};

export default AddDeviceModal;