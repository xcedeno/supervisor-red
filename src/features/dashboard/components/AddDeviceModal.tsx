import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Alert
} from '@mui/material';
import { useAddDevice } from '../hooks/useDevices';

interface AddDeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose }) => {
    const { mutate: addDevice, isPending, error, isError } = useAddDevice();

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
        addDevice(formData, {
            onSuccess: () => {
                setFormData({ id: '', name: '', ip: '', torre: '' });
                onClose();
            }
        });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Agregar Nuevo Dispositivo</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        {isError && (
                            <Grid item xs={12}>
                                <Alert severity="error">{error?.message || 'Error al agregar dispositivo'}</Alert>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="id"
                                label="ID del Dispositivo"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.id}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                name="name"
                                label="Nombre"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                name="ip"
                                label="Dirección IP"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.ip}
                                onChange={handleChange}
                                required
                                placeholder="192.168.1.1"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                name="torre"
                                label="Torre / Ubicación"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.torre}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit" disabled={isPending}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isPending}>
                        {isPending ? <CircularProgress size={24} /> : 'Guardar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddDeviceModal;