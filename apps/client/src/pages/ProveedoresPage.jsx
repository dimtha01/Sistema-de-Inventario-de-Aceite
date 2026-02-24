import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, MapPin, Building2, X } from 'lucide-react';

const FILTROS = [{ key: 'todos', label: 'Todos' }];
const formInicial = { nombre_empresa: '', direccion: '', telefono: '' };

// ── Modal Nuevo Proveedor ─────────────────────────────────
const ModalNuevoProveedor = ({ onClose, onGuardar }) => {
  const [form, setForm] = useState(formInicial);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre_empresa.trim()) return;
    try {
      const resp = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await resp.json();
      if (json.success) { onGuardar(json.data); onClose(); }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#135bec]/5 text-[#135bec]">
              <Building2 size={15} />
            </div>
            <div>
              <h2 className="text-[11px] font-extrabold tracking-widest text-slate-900 uppercase">AutoPart Pro</h2>
              <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">Sistema de Gestión Premium</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <div className="mb-5 text-center">
            <h1 className="text-lg font-extrabold text-slate-900">Nuevo Proveedor</h1>
            <p className="mt-1 text-[11px] text-slate-500">Ingrese los detalles del socio comercial.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* Nombre */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nombre de la Empresa</label>
              <input
                required type="text"
                value={form.nombre_empresa} onChange={e => set('nombre_empresa', e.target.value)}
                placeholder="Ej. Brembo S.p.A."
                className="w-full rounded-xl border-2 border-transparent bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Dirección */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Dirección</label>
              <div className="relative">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#135bec]/50" />
                <input
                  type="text"
                  value={form.direccion} onChange={e => set('direccion', e.target.value)}
                  placeholder="Ej. Av. Principal, Edif. Pro, Local 1"
                  className="w-full rounded-xl border-2 border-transparent bg-slate-50 pl-8 pr-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Teléfono</label>
              <input
                type="text"
                value={form.telefono} onChange={e => set('telefono', e.target.value)}
                placeholder="Ej. +58 412-1234567"
                className="w-full rounded-xl border-2 border-transparent bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                Cancelar
              </button>
              <button type="submit" className="rounded-xl bg-[#135bec] px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-md shadow-[#135bec]/20 hover:bg-[#1048bc] transition-all">
                Registrar Proveedor
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

// ── Tarjeta de proveedor ──────────────────────────────────
const ProveedorCard = ({ proveedor }) => (
  <div className="group flex flex-col bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-[#135bec]/5 transition-all duration-300">
    <div className="p-3.5 flex flex-col flex-1">
      <div className="flex items-center gap-1 text-slate-400 mb-2">
        <MapPin size={11} />
        <span className="text-[9px] font-bold uppercase tracking-wider truncate">{proveedor.direccion}</span>
      </div>

      <h3 className="text-sm font-black text-slate-900 leading-tight mb-1.5 group-hover:text-[#135bec] transition-colors truncate">
        {proveedor.nombre}
      </h3>

      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-auto">
        <div>
          <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Catálogo</span>
          <span className="text-xs font-black text-slate-900">{proveedor.productos} ref.</span>
        </div>
      </div>
    </div>
  </div>
);

// ── Página principal ─────────────────────────────────────
export const ProveedoresPage = () => {
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [busqueda, setBusqueda]         = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [proveedores, setProveedores]   = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    fetch('/api/providers')
      .then(res => res.json())
      .then(res => { if (res.success) setProveedores(res.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    let lista = proveedores;
    if (filtroActivo !== 'todos') lista = lista.filter(p => p.categoria === filtroActivo);
    if (busqueda) {
      const b = busqueda.toLowerCase();
      lista = lista.filter(p =>
        p.nombre.toLowerCase().includes(b) || p.direccion.toLowerCase().includes(b)
      );
    }
    return lista;
  }, [filtroActivo, busqueda, proveedores]);

  const handleGuardar = (nuevo) => setProveedores(prev => [nuevo, ...prev]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto p-3 lg:p-5">

      {showModal && (
        <ModalNuevoProveedor
          onClose={() => setShowModal(false)}
          onGuardar={handleGuardar}
        />
      )}

      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            Proveedores
          </h1>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5 max-w-xl">
            Gestiona tu red global de fabricantes automotrices de alto rendimiento.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex justify-center flex-shrink-0 items-center gap-1.5 bg-[#135bec] hover:bg-[#1048bc] text-white px-4 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md shadow-[#135bec]/25 uppercase tracking-widest"
        >
          <Plus size={13} strokeWidth={3} />
          Nuevo Proveedor
        </button>
      </div>

      {/* ── Filtros y Buscador ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm sticky top-4 z-20">
        <div className="flex bg-slate-50 p-0.5 rounded-lg w-full lg:w-auto overflow-x-auto">
          {FILTROS.map(f => {
            const count = f.key === 'todos'
              ? proveedores.length
              : proveedores.filter(p => p.categoria === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFiltroActivo(f.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  filtroActivo === f.key
                    ? 'bg-white text-[#135bec] shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {f.label}
                <span className={`px-1 py-0.5 rounded text-[8px] ${
                  filtroActivo === f.key
                    ? 'bg-[#135bec]/10 text-[#135bec]'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border-2 border-transparent focus:border-[#135bec] rounded-lg text-[11px] font-medium outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-xs font-bold">
          Cargando proveedores...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtrados.map(p => (
            <ProveedorCard key={p.id} proveedor={p} />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {filtrados.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-slate-100 text-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
            <Building2 size={18} className="text-slate-300" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">No hay resultados</h3>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5">Verifica tu búsqueda o selecciona otra categoría.</p>
        </div>
      )}

    </div>
  );
};