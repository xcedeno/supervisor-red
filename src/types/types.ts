export interface Device {
    id: string;       // Identificador único
    name: string;     // Nombre del equipo (e.g., "Habitación 1")
    ip: string;       // Dirección IP del equipo
    status: boolean;  // Estado del equipo (true = activo, false = inactivo)
}