import { useState, useMemo, useEffect } from 'react';
import {
  ArrowDownToLine, ArrowUpFromLine, Settings2,
  MapPin, Calendar, Search, ShoppingCart,
  Box, User, History, ChevronDown
} from 'lucide-react';

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'entrada', label: 'Entradas' },
  { key: 'salida', label: 'Salidas' },
  { key: 'ajuste', label: 'Ajustes' },
];

const TIPO_CONFIG = {
  entrada: {
    icon: <ArrowDownToLine size={14} strokeWidth={3} className="text-emerald-500" />,
    bgNode: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    label: 'ENTRADA',
  },
  salida: {
    icon: <ArrowUpFromLine size={14} strokeWidth={3} className="text-rose-500" />,
    bgNode: 'bg-rose-50 border-rose-200',
    badge: 'bg-rose-50 text-rose-600 border-rose-100',
    label: 'SALIDA',
  },
  ajuste: {
    icon: <Settings2 size={14} strokeWidth={3} className="text-blue-500" />,
    bgNode: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-50 text-blue-600 border-blue-100',
    label: 'AJUSTE',
  },
};

// ── Item de timeline ──────────────────────────────────────
const MovimientoItem = ({ movimiento, isLast }) => {
  const cfg = TIPO_CONFIG[movimiento.tipo];

  return (
    <div className={`relative flex gap-3.5 group ${!isLast ? 'pb-6' : ''}`}>
      {/* Node & Line */}
      <div className="flex flex-col items-center flex-shrink-0 relative">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm relative z-10 transition-transform group-hover:scale-105 ${cfg.bgNode}`}>
          {cfg.icon}
        </div>
        {!isLast && (
          <div className="absolute top-9 bottom-[-24px] w-[2px] bg-slate-100" />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white p-3 lg:p-4 rounded-xl border border-slate-100 shadow-sm transition-all duration-300 group-hover:border-slate-200 group-hover:shadow-md">

        {/* Cabecera */}
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <span className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded border uppercase ${cfg.badge}`}>
            {cfg.label}
          </span>
          <div className="flex items-center gap-1 text-slate-400 text-[9px] font-bold uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            <Calendar size={10} />
            {movimiento.tiempo}
          </div>
        </div>

        {/* Descripción */}
        <p className="text-xs text-slate-700 leading-relaxed mb-2.5">
          {movimiento.descripcion}
        </p>

        {/* Info Extra */}
        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold bg-slate-50/50 px-2 py-1.5 rounded-lg border border-slate-50 w-fit">
          <div className="flex items-center gap-1 text-slate-500 border-r border-slate-200 pr-1.5">
            {movimiento.iconoInterno}
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={10} />
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
            let iconoInterno = <Box size={12} />;
            let colorCnt = 'text-emerald-600';

            // Determinar signo y cantidad absoluta
            let sign = m.tipo === 'salida' ? '-' : '+';
            let displayCantidad = m.cantidad;

            if (m.tipo === 'ajuste') {
              sign = m.cantidad < 0 ? '-' : '+';
              displayCantidad = Math.abs(m.cantidad);
            } else if (m.tipo === 'entrada') {
              displayCantidad = Math.abs(m.cantidad); // por si acaso
            } else if (m.tipo === 'salida') {
              displayCantidad = Math.abs(m.cantidad);
            }

            if (m.tipo === 'salida') { iconoInterno = <ShoppingCart size={12} />; colorCnt = 'text-rose-500'; }
            else if (m.tipo === 'ajuste') { iconoInterno = <User size={12} />; colorCnt = 'text-blue-600'; }

            return {
              ...m,
              descripcion: (
                <>
                  <span className="font-semibold text-slate-900">{m.usuario}</span>{' '}
                  <span className="text-slate-500">{m.tipo_original}</span>:{' '}
                  <span className={`font-black ${colorCnt}`}>{sign}{displayCantidad} {m.producto}</span>
                </>
              ),
              iconoInterno
            };
          });
          setMovimientos(formatted);
        }
      })
      .catch(err => console.error('Error cargando historial', err))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    let filtradosAc = movimientos;
    if (filtroActivo !== 'todos') filtradosAc = filtradosAc.filter(m => m.tipo === filtroActivo);
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
    <main className="flex-1 w-full px-3 sm:px-5 py-5 flex justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-4">

        {/* ── Encabezado ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2">
              <History className="text-[#135bec]" size={22} />
              Historial de Movimientos
            </h1>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              Registro detallado de actividades, entradas y salidas en tiempo real.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg w-fit">
            <span className="relative flex h-1.5 w-1.5 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Sincronizado
          </div>
        </div>

        {/* ── Filtros y Buscador ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm sticky top-4 z-20">
          <div className="flex bg-slate-50 p-0.5 rounded-lg w-full sm:w-auto overflow-x-auto">
            {FILTROS.map(f => {
              const count = f.key === 'todos'
                ? movimientos.length
                : movimientos.filter(m => m.tipo === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setFiltroActivo(f.key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filtroActivo === f.key
                      ? 'bg-white text-[#135bec] shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {f.label}
                  <span className={`px-1 py-0.5 rounded text-[8px] ${filtroActivo === f.key
                      ? 'bg-[#135bec]/10 text-[#135bec]'
                      : 'bg-slate-200 text-slate-500'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
            <input
              type="text"
              placeholder="Buscar movimiento..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border-2 border-transparent focus:border-[#135bec] rounded-lg text-[11px] font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm">
          {loading ? (
            <div className="flex justify-center text-slate-400 font-bold text-xs py-8">
              Cargando movimientos...
            </div>
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
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-1">
                <History className="text-slate-300" size={18} />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Sin resultados</h3>
              <p className="text-[10px] font-medium text-slate-500">
                No hay movimientos para este filtro en este momento.
              </p>
            </div>
          )}
        </div>

        {/* ── Cargar más ── */}
        {filtrados.length > 0 && (
          <button className="flex justify-center items-center gap-1.5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#135bec] hover:bg-[#135bec]/5 rounded-xl transition-colors mx-auto px-5">
            Cargar Anteriores
            <ChevronDown size={12} strokeWidth={3} />
          </button>
        )}

      </div>
    </main>
  );
};