import { List, ListItem, ListItemButton, ListItemText, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';
const Sidebar = () => {
const navigate = useNavigate();

return (
<Drawer
    variant="permanent"
    sx={{
    width: 240,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: 240,
        boxSizing: 'border-box',
        backgroundColor: '#2c3e50',
        color: 'white',
    },
    }}
>
    <List>
    import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';

// Dentro del componente
<ListItem disablePadding>
<ListItemButton onClick={() => navigate('/')}>
<HomeIcon sx={{ marginRight: '10px' }} />
<ListItemText primary="Inicio" />
</ListItemButton>
</ListItem>
<ListItem disablePadding>
<ListItemButton onClick={() => navigate('/devices')}>
<DevicesIcon sx={{ marginRight: '10px' }} />
<ListItemText primary="Dispositivos" />
</ListItemButton>
</ListItem>
{/* Agrega más opciones aquí */}
</List>
</Drawer>
);
};


export default Sidebar;