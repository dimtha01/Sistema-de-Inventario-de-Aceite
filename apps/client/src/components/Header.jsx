import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/inventario',  label: 'Inventario'  },
  { to: '/clientes',    label: 'Clientes'    },
  { to: '/proveedores', label: 'Proveedores' },
  { to: '/categorias',  label: 'Categorias'  },
  { to: '/historial',   label: 'Historial'   },
];

export const Header = () => {
  const navigate   = useNavigate();
  const [open, setOpen] = useState(false); // menú móvil

  const handleLogout = () => {
    localStorage.removeItem('mp_token');
    localStorage.removeItem('mp_user');
    navigate('/');
  };

  const closeMobile = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

          {/* ── Logo + Nav desktop ── */}
          <div className="flex items-center gap-8">

            {/* Logo */}
            <NavLink
              to="/dashboard"
              onClick={closeMobile}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <span className="text-sm font-black tracking-tight text-slate-800">
                ICON
              </span>
            </NavLink>

            {/* Nav desktop (md+) */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-[11px] font-semibold uppercase tracking-widest transition-colors pb-0.5 whitespace-nowrap ${
                      isActive
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

          {/* ── Acciones ── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Buscador (sm+) */}
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
                className="pl-8 pr-3 py-1.5 bg-slate-100 rounded-full text-xs w-36 lg:w-44 focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 border-none"
              />
            </div>

            {/* Bell */}
            <button
              className="relative p-2 rounded-full hover:bg-slate-100 transition-colors group"
              aria-label="Alertas de stock"
            >
              <Bell size={18} strokeWidth={2} className="text-slate-400 group-hover:text-[#135bec] transition-colors" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full border-2 border-[#135bec]/20 bg-cover bg-center flex-shrink-0"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWaqHB6_TK5ht3TPFr9YoN_FxLdAlu9BWq6RXcksRE4uBtiBOMlcPAK7KIGnaQHcFRGjGaIZcdo46zVMYNVXOfBgSBAeXxnlDJUTNmD6ShEszvo-JWpbNqJMbkvRO_RHbkx4hKrtY-jpdqRcgSHvOL4iVhYtb-ke2z4dCgPeYut8Bah5mdhaOQ7NI3coG0-imb_eYnXLnqKmbkExd8dGGkAAm54kSrHfijPL-wEHihiSzm-2aW1bx3zt7kIRZk0o-V9eHWhCHiuHg')"
              }}
            />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors group hidden sm:block"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={18} strokeWidth={2} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            </button>

            {/* ── Hamburguesa (solo < md) ── */}
            <button
              onClick={() => setOpen(p => !p)}
              className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Menú"
            >
              {open
                ? <X size={18} strokeWidth={2} className="text-slate-600" />
                : <Menu size={18} strokeWidth={2} className="text-slate-500" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Menú móvil (desplegable) ── */}
      {open && (
        <>
          {/* Overlay para cerrar al tocar fuera */}
          <div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] md:hidden"
            onClick={closeMobile}
          />

          <nav className="fixed top-[57px] left-0 right-0 z-40 md:hidden bg-white border-b border-slate-100 shadow-lg shadow-slate-200/60 px-4 pb-4 pt-2 flex flex-col gap-1">

            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-[#135bec]/8 text-[#135bec]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Divisor */}
            <div className="border-t border-slate-100 my-1" />

            {/* Buscador móvil */}
            <div className="relative px-0">
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
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 border border-slate-100"
              />
            </div>

            {/* Cerrar sesión móvil */}
            <button
              onClick={() => { closeMobile(); handleLogout(); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={14} strokeWidth={2} />
              Cerrar sesión
            </button>
          </nav>
        </>
      )}
    </>
  );
};
