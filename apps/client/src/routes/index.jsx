import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InventarioPage } from '../pages/InventarioPage';
import { ClientesPage } from '../pages/ClientesPage';
import { ProveedoresPage } from '../pages/ProveedoresPage';
import { HistorialPage } from '../pages/HistorialPage';
import { CategoriasPage } from '../pages/CategoriasPage';
import { PosPage } from '../pages/PosPage';

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
            {
                path: 'clientes',
                element: <ClientesPage />,
            },
            {
                path: 'proveedores',
                element: <ProveedoresPage />,
            },
            {
                path: 'historial',
                element: <HistorialPage />,
            },
            {
                path: 'categorias',
                element: <CategoriasPage />,
            },
            {
                path: 'pos',
                element: <PosPage />,
            },
        ],
    },
]);
