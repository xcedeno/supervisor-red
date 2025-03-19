export interface Device {
    id: string;
    name: string;
    ip: string;
    torre: string;
    //status: boolean;
    status?: 'online' | 'offline'; // Agrega esto si usas el campo status
}