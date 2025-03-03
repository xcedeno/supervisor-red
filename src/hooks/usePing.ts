import { useEffect, useState } from 'react';
import axios from 'axios';

const usePing = (ip: string, interval: number = 5000) => {
const [status, setStatus] = useState<boolean>(false);

useEffect(() => {
const ping = async () => {
    try {
    const response = await axios.get(`http://${ip}`, { timeout: 2000 });
    setStatus(response.status === 200);
    } catch {
    setStatus(false);
    }
};

const intervalId = setInterval(ping, interval);
return () => clearInterval(intervalId);
}, [ip, interval]);

return status;
};

export default usePing;