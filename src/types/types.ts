export interface Device {
    id: string;
    name: string;
    ip: string;
    torre: string; // Nuevo campo
    status?: boolean; // Estado opcional (activo/inactivo)
}