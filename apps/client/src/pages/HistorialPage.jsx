import { useState, useMemo, useEffect } from 'react';
import {
  ArrowDownToLine, ArrowUpFromLine, Settings2,
  Calendar, Search, ShoppingCart,
  Box, User, History, ChevronDown, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const FILTROS = [
  { key: 'todos',   label: 'Todos' },
  { key: 'entrada', label: 'Entradas' },
  { key: 'salida',  label: 'Salidas' },
  { key: 'ajuste',  label: 'Ajustes' },
];

const TIPO_CONFIG = {
  entrada: {
    icon:   <ArrowDownToLine size={14} strokeWidth={3} className="text-emerald-600" />,
    bgNode: 'bg-emerald-100 border-emerald-300',
    badge:  'bg-emerald-100 text-emerald-700 border-emerald-200',
    label:  'ENTRADA',
  },
  salida: {
    icon:   <ArrowUpFromLine size={14} strokeWidth={3} className="text-rose-600" />,
    bgNode: 'bg-rose-100 border-rose-300',
    badge:  'bg-rose-100 text-rose-700 border-rose-200',
    label:  'SALIDA',
  },
  ajuste: {
    icon:   <Settings2 size={14} strokeWidth={3} className="text-blue-600" />,
    bgNode: 'bg-blue-100 border-blue-300',
    badge:  'bg-blue-100 text-blue-700 border-blue-200',
    label:  'AJUSTE',
  },
};

const POR_PAGINA = 10;

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
          <div className="absolute top-9 bottom-[-24px] w-[2px] bg-slate-200" />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white p-3 lg:p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 group-hover:border-slate-300 group-hover:shadow-md">

        {/* Cabecera */}
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <span className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded border uppercase ${cfg.badge}`}>
            {cfg.label}
          </span>
          <div className="flex items-center gap-1 text-slate-500 text-[9px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Calendar size={10} />
            {movimiento.tiempo}
          </div>
        </div>

        {/* Descripción */}
        <p className="text-xs text-slate-700 leading-relaxed">
          {movimiento.descripcion}
        </p>
      </div>
    </div>
  );
};

// ── Paginación ────────────────────────────────────────────
const Paginacion = ({ pagina, totalPaginas, onChange }) => {
  if (totalPaginas <= 1) return null;

  // Generar páginas visibles: siempre muestra max 5
  const paginas = [];
  let inicio = Math.max(1, pagina - 2);
  let fin    = Math.min(totalPaginas, inicio + 4);
  if (fin - inicio < 4) inicio = Math.max(1, fin - 4);
  for (let i = inicio; i <= fin; i++) paginas.push(i);

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(pagina - 1)}
        disabled={pagina === 1}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={13} />
      </button>

      {inicio > 1 && (
        <>
          <button onClick={() => onChange(1)} className="w-7 h-7 rounded-lg text-[10px] font-bold border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all">1</button>
          {inicio > 2 && <span className="text-slate-400 text-xs px-0.5">…</span>}
        </>
      )}

      {paginas.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all border ${
            p === pagina
              ? 'bg-[#135bec] text-white border-[#135bec] shadow-sm shadow-[#135bec]/20'
              : 'border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {p}
        </button>
      ))}

      {fin < totalPaginas && (
        <>
          {fin < totalPaginas - 1 && <span className="text-slate-400 text-xs px-0.5">…</span>}
          <button onClick={() => onChange(totalPaginas)} className="w-7 h-7 rounded-lg text-[10px] font-bold border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all">{totalPaginas}</button>
        </>
      )}

      <button
        onClick={() => onChange(pagina + 1)}
        disabled={pagina === totalPaginas}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
};

// ── Página principal ─────────────────────────────────────
export const HistorialPage = () => {
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [busqueda, setBusqueda]         = useState('');
  const [movimientos, setMovimientos]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [pagina, setPagina]             = useState(1);

  // Filtros de fecha
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [mostrarFechas, setMostrarFechas] = useState(false);

  const limpiarFechas = () => { setFechaDesde(''); setFechaHasta(''); };
  const hayFiltroFecha = fechaDesde || fechaHasta;

  useEffect(() => {
    fetch('/api/historial')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          const formatted = res.data.map(m => {
            let iconoInterno = <Box size={12} />;
            let colorCnt = 'text-emerald-700';

            let sign = m.tipo === 'salida' ? '-' : '+';
            let displayCantidad = Math.abs(m.cantidad);
            if (m.tipo === 'ajuste') sign = m.cantidad < 0 ? '-' : '+';

            if (m.tipo === 'salida')      { iconoInterno = <ShoppingCart size={12} />; colorCnt = 'text-rose-600'; }
            else if (m.tipo === 'ajuste') { iconoInterno = <User size={12} />;         colorCnt = 'text-blue-700'; }

            return {
              ...m,
              descripcion: (
                <>
                  <span className="font-semibold text-slate-900">{m.usuario}</span>{' '}
                  <span className="text-slate-500">{m.tipo_original}</span>:{' '}
                  <span className={`font-black ${colorCnt}`}>{sign}{displayCantidad} {m.producto}</span>
                </>
              ),
              iconoInterno,
              // fecha_iso esperada del backend: "2025-12-31" o "2025-12-31T..."
              fecha_iso: m.fecha_iso ?? m.fecha ?? '',
            };
          });
          setMovimientos(formatted);
        }
      })
      .catch(err => console.error('Error cargando historial', err))
      .finally(() => setLoading(false));
  }, []);

  // Reset de página al cambiar filtros
  useEffect(() => { setPagina(1); }, [filtroActivo, busqueda, fechaDesde, fechaHasta]);

  const filtrados = useMemo(() => {
    let lista = movimientos;

    if (filtroActivo !== 'todos') lista = lista.filter(m => m.tipo === filtroActivo);

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(m =>
        m.producto.toLowerCase().includes(q) ||
        m.usuario.toLowerCase().includes(q) ||
        m.tipo_original.toLowerCase().includes(q)
      );
    }

    // Filtro por fecha usando fecha_iso (YYYY-MM-DD)
    if (fechaDesde) {
      lista = lista.filter(m => m.fecha_iso && m.fecha_iso.slice(0, 10) >= fechaDesde);
    }
    if (fechaHasta) {
      lista = lista.filter(m => m.fecha_iso && m.fecha_iso.slice(0, 10) <= fechaHasta);
    }

    return lista;
  }, [filtroActivo, busqueda, movimientos, fechaDesde, fechaHasta]);

  const totalPaginas  = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaSegura  = Math.min(pagina, totalPaginas);
  const paginados     = filtrados.slice((paginaSegura - 1) * POR_PAGINA, paginaSegura * POR_PAGINA);

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
        </div>

        {/* ── Filtros y Buscador ── */}
        <div className="flex flex-col gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-20">

          {/* Fila 1: tabs + buscador */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex bg-slate-100 p-0.5 rounded-lg w-full sm:w-auto overflow-x-auto">
              {FILTROS.map(f => {
                const count = f.key === 'todos'
                  ? movimientos.length
                  : movimientos.filter(m => m.tipo === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFiltroActivo(f.key)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      filtroActivo === f.key
                        ? 'bg-white text-[#135bec] shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {f.label}
                    <span className={`px-1 py-0.5 rounded text-[8px] ${
                      filtroActivo === f.key
                        ? 'bg-[#135bec]/10 text-[#135bec]'
                        : 'bg-slate-200 text-slate-600'
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
                className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-[#135bec] rounded-lg text-[11px] font-semibold outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Fila 2: botón fecha + inputs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <button
              onClick={() => setMostrarFechas(v => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all ${
                hayFiltroFecha
                  ? 'bg-[#135bec]/10 text-[#135bec] border-[#135bec]/30'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <Calendar size={11} />
              Filtrar por Fecha
              {hayFiltroFecha && (
                <span className="bg-[#135bec] text-white text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center ml-0.5">
                  ✓
                </span>
              )}
            </button>

            {mostrarFechas && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Desde</label>
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={e => setFechaDesde(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 px-2 py-1 outline-none focus:border-[#135bec] transition-all"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Hasta</label>
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={e => setFechaHasta(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 px-2 py-1 outline-none focus:border-[#135bec] transition-all"
                  />
                </div>
                {hayFiltroFecha && (
                  <button
                    onClick={limpiarFechas}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-bold hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all"
                  >
                    <X size={10} />
                    Limpiar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          {loading ? (
            <div className="flex justify-center text-slate-500 font-bold text-xs py-8">
              Cargando movimientos...
            </div>
          ) : paginados.length > 0 ? (
            <div className="relative">
              {paginados.map((mov, i) => (
                <MovimientoItem
                  key={mov.id}
                  movimiento={mov}
                  isLast={i === paginados.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 mb-1">
                <History className="text-slate-400" size={18} />
              </div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Sin resultados</h3>
              <p className="text-[10px] font-medium text-slate-500">
                No hay movimientos para este filtro en este momento.
              </p>
            </div>
          )}
        </div>

        {/* ── Paginación ── */}
        {filtrados.length > POR_PAGINA && (
          <div className="flex flex-col items-center gap-2">
            <Paginacion
              pagina={paginaSegura}
              totalPaginas={totalPaginas}
              onChange={p => { setPagina(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Mostrando {(paginaSegura - 1) * POR_PAGINA + 1}–{Math.min(paginaSegura * POR_PAGINA, filtrados.length)} de {filtrados.length} movimientos
            </p>
          </div>
        )}

      </div>
    </main>
  );
};