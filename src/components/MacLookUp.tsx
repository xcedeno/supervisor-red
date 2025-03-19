import { useState } from 'react';

function MacLookup() {
const [ip, setIp] = useState('');
const [mac, setMac] = useState('');

const fetchMac = async () => {
// Validar formato de IP
if (!/^192\.168\.17\.\d+$/.test(ip)) {
    return setMac('Error: IP debe ser 192.168.17.x');
}

try {
    const response = await fetch(`http://localhost:3001/api/mac/${ip}`);
    if (!response.ok) {
    const errorData = await response.json(); // Parsear error como JSON
    throw new Error(errorData.error || 'Error desconocido');
    }
    const data = await response.json();
    setMac(data.mac);
} catch (error) {
    if (error instanceof Error) {
    setMac(`Error: ${error.message}`);
    } else {
    setMac('Error desconocido');
    }
}
};

return (
<div>
    <input
    type="text"
    placeholder="IP (ej. 192.168.17.7)"
    value={ip}
    onChange={(e) => setIp(e.target.value)}
    />
    <button onClick={fetchMac}>Obtener MAC</button>
    {mac && <p>MAC: {mac}</p>}
</div>
);
}

export default MacLookup;