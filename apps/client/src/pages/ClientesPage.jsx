import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Users, MoreVertical, Building2, MapPin, Calendar, CreditCard, X } from 'lucide-react';

// ── Datos ────────────────────────────────────────────────
const clientesIniciales = [
  { id: 1, nombre: 'Talleres Pérez S.A.', ubicacion: 'Av. Libertador, Caracas', ultimaCompra: '12 Oct 2023', saldo: 0, estado: 'aldia', iniciales: 'TP', tipo: 'Taller', telefono: '+58 414-1234567' },
  { id: 2, nombre: 'Mecánica Rápida Juan', ubicacion: 'Av. Las Delicias, Maracay', ultimaCompra: '05 Oct 2023', saldo: 1540.25, estado: 'pendiente', iniciales: 'MJ', tipo: 'Mecánico', telefono: '+58 412-9876543' },
  { id: 3, nombre: 'Autoservicio El Rayo', ubicacion: 'Av. Bolívar, Valencia', ultimaCompra: '08 Oct 2023', saldo: 0, estado: 'aldia', iniciales: 'AR', tipo: 'Servicio', telefono: '+58 424-3456789' },
  { id: 4, nombre: 'Frenos & Embragues', ubicacion: 'Zona Industrial, Valencia', ultimaCompra: '01 Oct 2023', saldo: 450.00, estado: 'pendiente', iniciales: 'FE', tipo: 'Especializado', telefono: '+58 414-0987654' },
  { id: 5, nombre: 'Lubricentro Norte', ubicacion: 'Calle 72, Maracaibo', ultimaCompra: '28 Sep 2023', saldo: 0, estado: 'aldia', iniciales: 'LN', tipo: 'Servicio', telefono: '+58 412-2345678' },
  { id: 6, nombre: 'Taller Los Amigos', ubicacion: 'Av. Intercomunal, Barquisimeto', ultimaCompra: '15 Oct 2023', saldo: 0, estado: 'premium', iniciales: 'LA', tipo: 'Taller', telefono: '+58 424-8765432' },
  { id: 7, nombre: 'Escapes Pepe', ubicacion: 'Centro, San Cristóbal', ultimaCompra: '10 Oct 2023', saldo: 3120.00, estado: 'pendiente', iniciales: 'EP', tipo: 'Especializado', telefono: '+58 414-5678901' },
  { id: 8, nombre: 'Detailing Profesional', ubicacion: 'Las Mercedes, Caracas', ultimaCompra: '14 Oct 2023', saldo: 0, estado: 'aldia', iniciales: 'DP', tipo: 'Servicio', telefono: '+58 412-3450987' },
];

const TABS = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'premium', label: 'Premium' },
  { key: 'aldia', label: 'Al Día' },
];

// ── Config de estado ────────
const ESTADO_CONFIG = {
  pendiente: {
    badge: 'bg-red-50 text-red-600 border border-red-200',
    label: 'Pendiente',
    avatar: 'bg-red-50 text-red-600',
    saldo: 'text-red-600',
  },
  aldia: {
    badge: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    label: 'Al día',
    avatar: 'bg-emerald-50 text-emerald-600',
    saldo: 'text-slate-900',
  },
  premium: {
    badge: 'bg-amber-50 text-amber-600 border border-amber-200',
    label: 'Premium',
    avatar: 'bg-amber-50 text-amber-600',
    saldo: 'text-slate-900',
  },
};

const EstadoBadge = ({ estado }) => {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.aldia;
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${cfg.badge}`}>
      {cfg.label}
    </span>
  );
};

const Avatar = ({ iniciales, estado }) => {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.aldia;
  return (
    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${cfg.avatar}`}>
      {iniciales}
    </div>
  );
};

// ── Drawer lateral de Detalles ────────────────────────────
const ClienteContent = ({ clienteSel, onDeselect }) => {
  if (!clienteSel) return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-2.5 py-10">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
        <Users className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-xs font-semibold text-slate-400">Selecciona un cliente</p>
      <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
        Haz clic en cualquier cliente del listado para ver su historial y contacto
      </p>
    </div>
  );

  return (
    <>
      <div className="p-5 flex flex-col gap-5">

        {/* Encabezado Perfil */}
        <div className="flex flex-col items-center text-center gap-3">
          <Avatar iniciales={clienteSel.iniciales} estado={clienteSel.estado} />
          <div>
            <EstadoBadge estado={clienteSel.estado} />
            <h3 className="text-lg font-black text-slate-900 mt-2 mb-1">{clienteSel.nombre}</h3>
            <p className="text-xs font-medium text-slate-500 flex items-center justify-center gap-1">
              <Building2 size={12} /> {clienteSel.tipo}
            </p>
          </div>
        </div>

        {/* Métricas e info rápida */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Saldo</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[10px] text-slate-400 font-medium">$</span>
              <span className={`text-xl font-black tracking-tighter leading-tight ${ESTADO_CONFIG[clienteSel.estado]?.saldo || 'text-slate-900'}`}>
                {clienteSel.saldo.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="bg-[#135bec]/5 p-3 rounded-2xl border border-[#135bec]/10">
            <span className="text-[9px] font-bold text-[#135bec]/70 uppercase tracking-wider block mb-1">Últ. Compra</span>
            <div className="flex items-center gap-1.5 h-full">
              <Calendar size={14} className="text-[#135bec]" />
              <span className="text-sm font-bold text-[#135bec]">{clienteSel.ultimaCompra}</span>
            </div>
          </div>
        </div>

        {/* Detalles de contacto */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#135bec] mb-1 pl-1">Contacto</h4>
          <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <MapPin size={14} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Ubicación</p>
              <p className="text-xs font-semibold text-slate-700">{clienteSel.ubicacion}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Users size={14} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Teléfono</p>
              <p className="text-xs font-semibold text-slate-700">{clienteSel.telefono}</p>
            </div>
          </div>
        </div>

        <button
          className="w-full mt-2 bg-[#135bec] text-white font-bold py-3.5 rounded-2xl text-xs transition-all hover:bg-[#135bec]/90 active:scale-[0.98] uppercase tracking-wider shadow-lg shadow-[#135bec]/25 flex items-center justify-center gap-2"
        >
          <CreditCard size={14} /> Registrar Pago
        </button>

      </div>
    </>
  );
};

// ── Página principal ─────────────────────────────────────
export const ClientesPage = () => {
  const [tabActiva, setTabActiva] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [clienteSel, setClienteSel] = useState(null);

  const clientesFiltrados = useMemo(() => {
    let filtrados = clientesIniciales;
    if (tabActiva !== 'todos') {
      filtrados = filtrados.filter(c => c.estado === tabActiva);
    }
    if (busqueda) {
      const b = busqueda.toLowerCase();
      filtrados = filtrados.filter(c => c.nombre.toLowerCase().includes(b));
    }
    return filtrados;
  }, [tabActiva, busqueda]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col gap-6 w-full">

        {/* Header de Página */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Directorio de Clientes
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {clientesIniciales.length} clientes registrados en total.
            </p>
          </div>
          <button className="flex justify-center items-center gap-2 bg-[#135bec] hover:bg-[#1048bc] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#135bec]/25">
            <Plus size={16} strokeWidth={3} />
            NUEVO CLIENTE
          </button>
        </div>

        {/* ── Filtros y Buscador ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">

          {/* Tabs */}
          <div className="flex bg-slate-50 p-1 rounded-xl w-full lg:w-auto overflow-x-auto">
            {TABS.map(tab => {
              const count = tab.key === 'todos' ? clientesIniciales.length : clientesIniciales.filter(c => c.estado === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setTabActiva(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${tabActiva === tab.key
                      ? 'bg-white text-[#135bec] shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${tabActiva === tab.key ? 'bg-[#135bec]/10 text-[#135bec]' : 'bg-slate-200 text-slate-500'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Buscador */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-[#135bec] rounded-xl text-sm font-medium outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* ── Lista de Clientes en formato Tabla/Grid interactivo ── */}
        {clientesFiltrados.length > 0 ? (
          <div className="flex flex-col gap-3">
            {clientesFiltrados.map(cliente => {
              const cfg = ESTADO_CONFIG[cliente.estado] || ESTADO_CONFIG.aldia;
              const isSelected = clienteSel?.id === cliente.id;

              return (
                <div
                  key={cliente.id}
                  onClick={() => setClienteSel(cliente)}
                  className={`group relative bg-white rounded-2xl p-4 transition-all duration-300 cursor-pointer overflow-hidden border-2 ${isSelected ? 'border-[#135bec] shadow-md' : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'
                    } flex flex-col sm:flex-row items-start sm:items-center gap-4`}
                >
                  <Avatar iniciales={cliente.iniciales} estado={cliente.estado} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-[#135bec] transition-colors">{cliente.nombre}</h3>
                      <EstadoBadge estado={cliente.estado} />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {cliente.ubicacion}</span>
                      <span className="flex items-center gap-1"><Building2 size={12} /> {cliente.tipo}</span>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1 sm:gap-1 pl-0 sm:pl-4 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <div className="text-right flex flex-col items-start sm:items-end w-1/2 sm:w-auto">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Saldo</span>
                      <span className={`text-sm font-black tracking-tighter leading-none ${cfg.saldo}`}>
                        ${cliente.saldo.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-right flex flex-col items-end w-1/2 sm:w-auto">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Últ. Mov.</span>
                      <span className="text-[11px] font-bold text-slate-700 leading-none">{cliente.ultimaCompra}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
              <Users size={24} className="text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">No hay resultados</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Intenta con otros términos u otra categoría.</p>
          </div>
        )}
      </div>

      {/* ── Sidebar de Detalles (Desktop) ── */}
      <aside className="w-full lg:w-[320px] bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden sticky top-24 flex-shrink-0 hidden lg:flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-[10px] text-[#135bec] uppercase tracking-[0.2em]">Info del Cliente</h2>
          {clienteSel && (
            <button
              onClick={() => setClienteSel(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
        <ClienteContent clienteSel={clienteSel} />
      </aside>

      {/* Drawer móvil */}
      {clienteSel && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setClienteSel(null)} />
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-[10px] text-[#135bec] uppercase tracking-[0.2em]">Info del Cliente</h2>
              <button onClick={() => setClienteSel(null)} className="text-slate-400 p-1">
                <X size={14} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 pb-10">
              <ClienteContent clienteSel={clienteSel} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};