import { useState, useMemo, useEffect } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings2,
  MapPin,
  Calendar,
  Search,
  ShoppingCart,
  Box,
  Truck,
  User,
  History,
  ChevronDown
} from 'lucide-react';

// ── Datos ────────────────────────────────────────────────
// ── Datos eliminados (cargando de API) ───────────────────

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'entrada', label: 'Entradas' },
  { key: 'salida', label: 'Salidas' },
  { key: 'ajuste', label: 'Ajustes' },
];

// ── Config visual por tipo ────────────────────────────────
const TIPO_CONFIG = {
  entrada: {
    icon: <ArrowDownToLine size={16} strokeWidth={3} className="text-emerald-500" />,
    bgNode: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    label: 'ENTRADA',
  },
  salida: {
    icon: <ArrowUpFromLine size={16} strokeWidth={3} className="text-rose-500" />,
    bgNode: 'bg-rose-50 border-rose-200',
    badge: 'bg-rose-50 text-rose-600 border-rose-100',
    label: 'SALIDA',
  },
  ajuste: {
    icon: <Settings2 size={16} strokeWidth={3} className="text-blue-500" />,
    bgNode: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-50 text-blue-600 border-blue-100',
    label: 'AJUSTE',
  },
};

// ── Item de timeline compactado ───────────────────────────
const MovimientoItem = ({ movimiento, isLast }) => {
  const cfg = TIPO_CONFIG[movimiento.tipo];

  return (
    <div className={`relative flex gap-5 group ${!isLast ? 'pb-8' : ''}`}>
      {/* Node & Line */}
      <div className="flex flex-col items-center flex-shrink-0 relative">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm relative z-10 transition-transform group-hover:scale-105 ${cfg.bgNode}`}>
          {cfg.icon}
        </div>
        {!isLast && (
          <div className="absolute top-10 bottom-[-32px] w-[2px] bg-slate-100" />
        )}
      </div>

      {/* Card (Más pequeña, sin bordes excesivos) */}
      <div className="flex-1 bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 group-hover:border-slate-200 group-hover:shadow-md">

        {/* Cabecera del item: Config & Fecha */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-md border uppercase ${cfg.badge}`}>
            {cfg.label}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
            <Calendar size={12} />
            {movimiento.tiempo}
          </div>
        </div>

        {/* Descripción Principal */}
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          {movimiento.descripcion}
        </p>

        {/* Info Extra */}
        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold bg-slate-50/50 p-2 rounded-lg border border-slate-50 w-fit">
          <div className="flex items-center gap-1.5 text-slate-500 border-r border-slate-200 pr-2">
            {movimiento.iconoInterno}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} />
            {movimiento.lugar}
          </div>
        </div>

      </div>
    </div>
  );
};

// ── Página principal ─────────────────────────────────────
export const HistorialPage = () => {
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/historial')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          const formatted = res.data.map(m => {
            let iconoInterno = <Box size={14} />;
            let colorCnt = 'text-emerald-600';
            const sign = m.tipo === 'salida' ? '-' : '+';

            if (m.tipo === 'salida') {
              iconoInterno = <ShoppingCart size={14} />;
              colorCnt = 'text-rose-500';
            } else if (m.tipo === 'ajuste') {
              iconoInterno = <User size={14} />;
              colorCnt = 'text-blue-600';
            }

            return {
              ...m,
              descripcion: (
                <>
                  <span className="font-semibold text-slate-900">{m.usuario}</span>{' '}
                  <span className="text-slate-500">{m.tipo_original}</span>:{' '}
                  <span className={`font-black ${colorCnt}`}>{sign}{m.cantidad} {m.producto}</span>
                </>
              ),
              iconoInterno
            };
          });
          setMovimientos(formatted);
        }
      })
      .catch(err => console.error("Error cargando historial", err))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    let filtradosAc = movimientos;
    if (filtroActivo !== 'todos') {
      filtradosAc = filtradosAc.filter(m => m.tipo === filtroActivo);
    }

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      filtradosAc = filtradosAc.filter(m =>
        m.producto.toLowerCase().includes(q) ||
        m.usuario.toLowerCase().includes(q) ||
        m.tipo_original.toLowerCase().includes(q)
      );
    }

    return filtradosAc;
  }, [filtroActivo, busqueda, movimientos]);

  return (
    <main className="flex-1 w-full px-4 sm:px-6 py-8 flex justify-center">

      <div className="w-full max-w-3xl flex flex-col gap-6">

        {/* ── Encabezado ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-3">
              <History className="text-[#135bec]" size={28} />
              Historial de Movimientos
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Registro detallado de actividades, entradas y salidas en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg w-fit">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Sincronizado
          </div>
        </div>

        {/* ── Barra de Filtros y Buscador ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm sticky top-4 z-20">

          <div className="flex bg-slate-50 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {FILTROS.map(f => {
              const count = f.key === 'todos' ? movimientos.length : movimientos.filter(m => m.tipo === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setFiltroActivo(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filtroActivo === f.key
                    ? 'bg-white text-[#135bec] shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {f.label}
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${filtroActivo === f.key ? 'bg-[#135bec]/10 text-[#135bec]' : 'bg-slate-200 text-slate-500'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Buscar movimiento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border-2 border-transparent focus:border-[#135bec] rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* ── Timeline de Resultados ── */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          {loading ? (
            <div className="flex justify-center text-slate-400 font-bold text-xs py-10">Cargando movimientos...</div>
          ) : filtrados.length > 0 ? (
            <div className="relative">
              {filtrados.map((mov, i) => (
                <MovimientoItem
                  key={mov.id}
                  movimiento={mov}
                  isLast={i === filtrados.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-2">
                <History className="text-slate-300" size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Sin resultados</h3>
              <p className="text-xs font-medium text-slate-500">
                No hay movimientos para este filtro en este momento.
              </p>
            </div>
          )}
        </div>

        {/* ── Botón Cargar Más ── */}
        {filtrados.length > 0 && (
          <button className="flex justify-center items-center gap-2 py-3 text-xs font-bold uppercase tracking-widest text-[#135bec] hover:bg-[#135bec]/5 rounded-xl transition-colors mx-auto px-6">
            Cargar Anteriores
            <ChevronDown size={14} strokeWidth={3} />
          </button>
        )}

      </div>
    </main>
  );
};