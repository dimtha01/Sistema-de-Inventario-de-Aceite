import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';

export const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isPosPage = location.pathname === '/pos';

  return (
    <div className={isPosPage ? "w-full min-h-screen bg-background-light text-slate-900 font-[Manrope,sans-serif]" : "min-h-screen w-full bg-[#f6f6f8] text-slate-900 font-[Manrope,sans-serif]"}>
      {!isLoginPage && <Header />}
      <main className={isPosPage ? "w-full h-[calc(100vh-57px)]" : "max-w-6xl mx-auto px-4 md:px-8 py-8"}>
        <Outlet />
      </main>
    </div>
  );
};