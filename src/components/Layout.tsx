// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import {
AppBar,
Box,
CssBaseline,
Drawer,
IconButton,
Toolbar,
Typography,
ThemeProvider,
createTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface LayoutProps {
children: ReactNode;
drawerContent: ReactNode;
}

const drawerWidth = 240;

const Layout: React.FC<LayoutProps> = ({ children, drawerContent }) => {
const [mobileOpen, setMobileOpen] = React.useState(false);

const handleDrawerToggle = () => {
setMobileOpen(!mobileOpen);
};

return (
<ThemeProvider theme={createTheme()}>
    <CssBaseline />
    <AppBar
    position="fixed"
    sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#2c3e50',
    }}
    >
    <Toolbar>
        <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: 'none' } }}
        >
        <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
        Sistema de Monitoreo
        </Typography>
    </Toolbar>
    </AppBar>

    {/* Drawer para desktop */}
    <Drawer
    variant="permanent"
    sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#2c3e50',
        color: 'white',
        },
        display: { xs: 'none', sm: 'block' },
    }}
    >
    {drawerContent}
    </Drawer>

    {/* Drawer para mobile */}
    <Drawer
    variant="temporary"
    open={mobileOpen}
    onClose={handleDrawerToggle}
    ModalProps={{
        keepMounted: true,
    }}
    sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        width: drawerWidth,
        backgroundColor: '#2c3e50',
        color: 'white',
        },
    }}
    >
    {drawerContent}
    </Drawer>

    {/* Contenido principal */}
    <Box
    component="main"
    sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        marginLeft: { sm: `${drawerWidth}px` },
        marginTop: '64px', // Altura del AppBar
    }}
    >
    <Toolbar />
    {children}
    </Box>
</ThemeProvider>
);
};

export default Layout;