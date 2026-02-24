import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';

const navLinks = [
    { to: '/inventario', label: 'Inventario' },
    { to: '/clientes', label: 'Clientes' },
    { to: '/proveedores', label: 'Proveedores' },
    { to: '/categorias', label: 'Categorias' },
    { to: '/historial', label: 'Historial' },
];

export const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('mp_token');
        localStorage.removeItem('mp_user');
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

                {/* Logo + Nav */}
                <div className="flex items-center gap-8">

                    {/* Logo */}
                    <NavLink to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-black tracking-tight text-slate-800 hidden sm:block">
                            ICON
                        </span>
                    </NavLink>

                    {/* Nav links */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `text-[11px] font-semibold uppercase tracking-widest transition-colors pb-0.5 ${isActive
                                        ? 'text-[#135bec] border-b-2 border-[#135bec]'
                                        : 'text-slate-400 hover:text-slate-700 border-b-2 border-transparent'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-3">

                    {/* Buscador */}
                    <div className="relative hidden sm:block">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="pl-8 pr-3 py-1.5 bg-slate-100 rounded-full text-xs w-40 focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 border-none"
                        />
                    </div>

                    {/* Alertas de stock */}
                    <button
                        className="relative p-2 rounded-full hover:bg-slate-100 transition-colors group"
                        aria-label="Alertas de stock"
                    >
                        <Bell size={18} strokeWidth={2} className="text-slate-400 group-hover:text-[#135bec] transition-colors" />
                        {/* Badge de notificación */}
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    </button>

                    {/* Avatar */}
                    <div
                        className="w-8 h-8 rounded-full border-2 border-[#135bec]/20 bg-cover bg-center flex-shrink-0"
                        style={{
                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWaqHB6_TK5ht3TPFr9YoN_FxLdAlu9BWq6RXcksRE4uBtiBOMlcPAK7KIGnaQHcFRGjGaIZcdo46zVMYNVXOfBgSBAeXxnlDJUTNmD6ShEszvo-JWpbNqJMbkvRO_RHbkx4hKrtY-jpdqRcgSHvOL4iVhYtb-ke2z4dCgPeYut8Bah5mdhaOQ7NI3coG0-imb_eYnXLnqKmbkExd8dGGkAAm54kSrHfijPL-wEHihiSzm-2aW1bx3zt7kIRZk0o-V9eHWhCHiuHg')"
                        }}
                    />

                    {/* Botón Cerrar Sesión */}
                    <button
                        onClick={handleLogout}
                        className="p-2 ml-1 rounded-full hover:bg-slate-100 transition-colors group"
                        aria-label="Cerrar sesión"
                        title="Cerrar sesión"
                    >
                        <LogOut size={18} strokeWidth={2} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>
            </div>
        </header>
    );
};