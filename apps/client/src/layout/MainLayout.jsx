import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export const MainLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[#f6f6f8] text-slate-900 font-[Manrope,sans-serif]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};