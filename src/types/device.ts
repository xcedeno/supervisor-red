export interface Device {
    id: string;
    name: string;
    ip: string;
    torre: string;
    status?: 'online' | 'offline';
}

export interface PingResponse {
    ip: string;
    status: 'online' | 'offline';
}
