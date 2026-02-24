import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { LoginPage } from '../pages/LoginPage';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <LoginPage />, 
            },
        ],
    },
]);
