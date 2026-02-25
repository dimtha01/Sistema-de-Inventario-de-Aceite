import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { NotificacionesPanel } from './NotificacionesPanel';

const navLinks = [
  { to: '/inventario',  label: 'Inventario' },
  { to: '/clientes',    label: 'Clientes' },
  { to: '/proveedores', label: 'Proveedores' },
  { to: '/categorias',  label: 'Categorias' },
  { to: '/pos',         label: 'Ventas' },
  { to: '/historial',   label: 'Historial' },
];

export const Header = () => {
  const navigate = useNavigate();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [showNotif,  setShowNotif]  = useState(false);
  const [alerts,     setAlerts]     = useState([]);

  const [isDark, setIsDark] = useState(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    fetch('/api/inventory/alerts')
      .then(res => res.json())
      .then(data => { if (data.success) setAlerts(data.data); })
      .catch(err => console.error('Error fetching alerts:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mp_token');
    localStorage.removeItem('mp_user');
    navigate('/');
  };

  const closeMobile = () => setMenuOpen(false);

  return (
    <>
      {showNotif && (
        <NotificacionesPanel onClose={() => setShowNotif(false)} alerts={alerts} />
      )}

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-300 px-4 md:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

          {/* Logo + Nav desktop */}
          <div className="flex items-center gap-8">
            <NavLink to="/dashboard" onClick={closeMobile} className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-black tracking-tight text-slate-900">ICON</span>
            </NavLink>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-[11px] font-bold uppercase tracking-widest transition-colors pb-0.5 whitespace-nowrap ${
                      isActive
                        ? 'text-[#135bec] border-b-2 border-[#135bec]'
                        : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Botón Bell con badge */}
            <button
              onClick={() => setShowNotif(p => !p)}
              className={`relative p-2 rounded-full transition-colors group ${
                showNotif
                  ? 'bg-[#135bec]/10 text-[#135bec]'
                  : 'hover:bg-slate-100 text-slate-500'
              }`}
              aria-label="Notificaciones"
            >
              <Bell
                size={18}
                strokeWidth={2}
                className={`transition-colors ${showNotif ? 'text-[#135bec]' : 'group-hover:text-[#135bec]'}`}
              />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-[8px] font-black text-white leading-none px-0.5">
                    {alerts.length}
                  </span>
                </span>
              )}
            </button>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full border-2 border-[#135bec]/30 bg-cover bg-center flex-shrink-0"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWaqHB6_TK5ht3TPFr9YoN_FxLdAlu9BWq6RXcksRE4uBtiBOMlcPAK7KIGnaQHcFRGjGaIZcdo46zVMYNVXOfBgSBAeXxnlDJUTNmD6ShEszvo-JWpbNqJMbkvRO_RHbkx4hKrtY-jpdqRcgSHvOL4iVhYtb-ke2z4dCgPeYut8Bah5mdhaOQ7NI3coG0-imb_eYnXLnqKmbkExd8dGGkAAm54kSrHfijPL-wEHihiSzm-2aW1bx3zt7kIRZk0o-V9eHWhCHiuHg')"
              }}
            />

            {/* Logout desktop */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors group hidden sm:block"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={18} strokeWidth={2} className="text-slate-500 group-hover:text-red-600 transition-colors" />
            </button>

            {/* Hamburguesa móvil */}
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Menú"
            >
              {menuOpen
                ? <X    size={18} strokeWidth={2} className="text-slate-700" />
                : <Menu size={18} strokeWidth={2} className="text-slate-600" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Menú móvil ── */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] md:hidden"
            onClick={closeMobile}
          />
          <nav className="fixed top-[57px] left-0 right-0 z-40 md:hidden bg-white border-b border-slate-200 shadow-lg px-4 pb-4 pt-2 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-[#135bec]/10 text-[#135bec]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="border-t border-slate-200 my-1" />

            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 border border-slate-200 placeholder:text-slate-400 text-slate-700"
              />
            </div>

            <button
              onClick={() => { closeMobile(); handleLogout(); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
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