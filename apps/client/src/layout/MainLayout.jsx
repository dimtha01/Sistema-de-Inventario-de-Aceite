import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <>
            {/* Aquí se renderizan las rutas hijas */}
            <Outlet />
        </>
    )
}