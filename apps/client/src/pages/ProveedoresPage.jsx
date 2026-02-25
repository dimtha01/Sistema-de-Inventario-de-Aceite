import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, MapPin, Building2, X, Trash2, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

const FILTROS = [{ key: 'todos', label: 'Todos' }];
const formInicial = { nombre_empresa: '', direccion: '', telefono: '' };

// ── Modal Notificación (reemplaza alert) ──────────────────
const ModalNotificacion = ({ tipo, mensaje, onClose }) => {
  const esError = tipo === 'error';
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-xs rounded-2xl shadow-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-5 flex flex-col items-center text-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
            esError ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
          }`}>
            {esError
              ? <AlertCircle size={22} className="text-rose-500" />
              : <CheckCircle2 size={22} className="text-emerald-500" />
            }
          </div>
          <p className="text-sm font-bold text-slate-800 leading-snug">{mensaje}</p>
        </div>
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-center">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${
              esError
                ? 'bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/20'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20'
            }`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Modal Nuevo Proveedor ─────────────────────────────────
const ModalNuevoProveedor = ({ onClose, onGuardar, onNotificar }) => {
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
      else onNotificar('error', json.message || 'Error al crear proveedor');
    } catch (error) {
      console.error(error);
      onNotificar('error', 'Error de conexión con el servidor');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#135bec]/10 text-[#135bec]">
              <Building2 size={15} />
            </div>
            <div>
              <h2 className="text-[11px] font-extrabold tracking-widest text-slate-900 uppercase">AutoPart Pro</h2>
              <p className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">Sistema de Gestión Premium</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
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
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Nombre de la Empresa</label>
              <input
                required type="text"
                value={form.nombre_empresa} onChange={e => set('nombre_empresa', e.target.value)}
                placeholder="Ej. Brembo S.p.A."
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Dirección</label>
              <div className="relative">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#135bec]/60" />
                <input
                  type="text"
                  value={form.direccion} onChange={e => set('direccion', e.target.value)}
                  placeholder="Ej. Av. Principal, Edif. Pro, Local 1"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-8 pr-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Teléfono</label>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#135bec]/60" />
                <input
                  type="text"
                  value={form.telefono} onChange={e => set('telefono', e.target.value)}
                  placeholder="Ej. +58 412-1234567"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-8 pr-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
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

// ── Modal Confirmar Eliminación ───────────────────────────
const ModalEliminar = ({ proveedor, onClose, onConfirmar }) => {
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    setLoading(true);
    await onConfirmar(proveedor.id);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-xs rounded-2xl shadow-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Eliminar Proveedor</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5 flex flex-col items-center text-center gap-3">
          <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200">
            <Trash2 size={18} className="text-rose-600" />
          </div>
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            ¿Eliminar el proveedor{' '}
            <span className="font-black text-slate-900">"{proveedor.nombre}"</span>?
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-slate-200 transition-colors text-xs border border-slate-200">
            Cancelar
          </button>
          <button
            onClick={handleEliminar} disabled={loading}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-rose-500/20"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Tarjeta de proveedor ──────────────────────────────────
const ProveedorCard = ({ proveedor, onEliminar }) => (
  <div className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-[#135bec]/5 hover:border-slate-300 transition-all duration-300">
    <div className="p-3.5 flex flex-col flex-1 gap-2">

      {/* Nombre */}
      <h3 className="text-sm font-black text-slate-900 leading-tight group-hover:text-[#135bec] transition-colors truncate">
        {proveedor.nombre}
      </h3>

      {/* Dirección */}
      <div className="flex items-center gap-1 text-slate-500">
        <MapPin size={10} className="flex-shrink-0" />
        <span className="text-[9px] font-bold uppercase tracking-wider truncate">
          {proveedor.direccion || '—'}
        </span>
      </div>

      {/* Teléfono */}
      <div className="flex items-center gap-1 text-slate-500">
        <Phone size={10} className="flex-shrink-0" />
        <span className="text-[9px] font-bold tracking-wide truncate">
          {proveedor.telefono || '—'}
        </span>
      </div>

      {/* Separador + Catálogo + Eliminar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 mt-auto">
        <div>
          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Catálogo</span>
          <span className="text-xs font-black text-slate-900">{proveedor.productos} ref.</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onEliminar(proveedor); }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all duration-200"
        >
          <Trash2 size={10} />
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

// ── Página principal ─────────────────────────────────────
export const ProveedoresPage = () => {
  const [filtroActivo, setFiltroActivo]             = useState('todos');
  const [busqueda, setBusqueda]                     = useState('');
  const [showModal, setShowModal]                   = useState(false);
  const [proveedores, setProveedores]               = useState([]);
  const [loading, setLoading]                       = useState(true);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
  const [notificacion, setNotificacion]             = useState(null); // { tipo, mensaje }

  const notificar = (tipo, mensaje) => setNotificacion({ tipo, mensaje });

  useEffect(() => {
    fetch('/api/providers')
      .then(res => res.json())
      .then(res => { if (res.success) setProveedores(res.data); })
      .catch(() => notificar('error', 'No se pudo cargar la lista de proveedores'))
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

  const handleEliminar = async (id) => {
    try {
      const resp = await fetch(`/api/providers/${id}`, { method: 'DELETE' });
      const json = await resp.json();
      if (resp.ok && json.success) {
        setProveedores(prev => prev.filter(p => p.id !== id));
        notificar('exito', 'Proveedor eliminado correctamente');
      } else {
        notificar('error', json.message || 'Error al eliminar proveedor');
      }
    } catch (error) {
      console.error(error);
      notificar('error', 'Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto p-3 lg:p-5">

      {/* ── Modales ── */}
      {notificacion && (
        <ModalNotificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {showModal && (
        <ModalNuevoProveedor
          onClose={() => setShowModal(false)}
          onGuardar={handleGuardar}
          onNotificar={notificar}
        />
      )}

      {proveedorAEliminar && (
        <ModalEliminar
          proveedor={proveedorAEliminar}
          onClose={() => setProveedorAEliminar(null)}
          onConfirmar={handleEliminar}
        />
      )}

      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">Proveedores</h1>
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-20">
        <div className="flex bg-slate-100 p-0.5 rounded-lg w-full lg:w-auto overflow-x-auto">
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
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border-2 border-slate-200 focus:border-[#135bec] rounded-lg text-[11px] font-medium outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 text-xs font-bold">
          Cargando proveedores...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtrados.map(p => (
            <ProveedorCard
              key={p.id}
              proveedor={p}
              onEliminar={(prov) => setProveedorAEliminar(prov)}
            />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {filtrados.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-slate-200 text-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 border border-slate-200">
            <Building2 size={18} className="text-slate-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">No hay resultados</h3>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5">Verifica tu búsqueda o selecciona otra categoría.</p>
        </div>
      )}

    </div>
  );
};