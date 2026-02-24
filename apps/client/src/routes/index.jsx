import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InventarioPage } from '../pages/InventarioPage';
// import { ClientesPage } from '../pages/ClientesPage';
// import { ProveedoresPage } from '../pages/ProveedoresPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <LoginPage />, 
            },
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
            {
                path: 'inventario',
                element: <InventarioPage />,
            },
            // {
            //     path: 'clientes',
            //     element: <ClientesPage />,
            // },
            // {
            //     path: 'proveedores',
            //     element: <ProveedoresPage />,
            // },
        ],
    },
]);
