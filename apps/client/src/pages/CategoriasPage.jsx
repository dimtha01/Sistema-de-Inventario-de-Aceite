import { useState, useMemo, useEffect } from 'react';
import { ModalNuevaCategoria } from '../components/ModalNuevaCategoria';
import { Search, Plus, Layers, Tags, Package, X, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

// ── Modal Notificación (reemplaza alert) ──────────────────
const ModalNotificacion = ({ tipo, mensaje, onClose }) => {
  const esError = tipo === 'error';
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-xs rounded-2xl shadow-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-5 flex flex-col items-center text-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${esError ? 'bg-rose-100 border-rose-200' : 'bg-emerald-100 border-emerald-200'
            }`}>
            {esError
              ? <AlertCircle size={22} className="text-rose-600" />
              : <CheckCircle2 size={22} className="text-emerald-600" />
            }
          </div>
          <p className="text-sm font-bold text-slate-800 leading-snug">{mensaje}</p>
        </div>
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-center">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${esError
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

// ── Modal Confirmar Eliminación ───────────────────────────
const ModalEliminar = ({ categoria, onClose, onConfirmar }) => {
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    setLoading(true);
    await onConfirmar(categoria.id);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-xs rounded-2xl shadow-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Eliminar Categoría</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5 flex flex-col items-center text-center gap-3">
          <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200">
            <Trash2 size={18} className="text-rose-600" />
          </div>
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            ¿Eliminar la categoría{' '}
            <span className="font-black text-slate-900">"{categoria.nombre}"</span>?
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

// ── Tarjeta de categoría ──────────────────────────────────
const CategoriaCard = ({ categoria, onEliminar }) => (
  <div className="group bg-white flex flex-col rounded-xl border border-slate-200 p-3 transition-all duration-300 hover:shadow-md hover:border-[#135bec]/40 hover:-translate-y-0.5">

    {/* Nombre */}
    <h3 className="text-sm font-black text-slate-900 leading-tight mb-3 group-hover:text-[#135bec] transition-colors duration-300 truncate">
      {categoria.nombre}
    </h3>

    {/* Stats */}
    <div className="grid grid-cols-2 gap-1.5 mb-3">
      <div className="bg-slate-100 rounded-lg p-2 border border-slate-200 flex flex-col justify-center">
        <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
          <Package size={10} />
          <span>Items</span>
        </div>
        <p className="text-xs font-black text-slate-900">{categoria.productos}</p>
      </div>
      <div className="bg-slate-100 rounded-lg p-2 border border-slate-200 flex flex-col justify-center">
        <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
          <Tags size={10} />
          <span>Valor</span>
        </div>
        <p className="text-xs font-black text-slate-900 truncate">{categoria.stockValor}</p>
      </div>
    </div>

    {/* Botón eliminar */}
    <button
      onClick={(e) => { e.stopPropagation(); onEliminar(categoria); }}
      className="w-full flex items-center justify-center gap-1 py-2 bg-slate-100 border border-slate-200 text-slate-500 font-bold rounded-lg text-[9px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all duration-300"
    >
      <Trash2 size={10} />
      Eliminar
    </button>
  </div>
);

// ── Página principal ─────────────────────────────────────
export const CategoriasPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [notificacion, setNotificacion] = useState(null); // { tipo, mensaje }

  const notificar = (tipo, mensaje) => setNotificacion({ tipo, mensaje });

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(res => { if (res.success && res.data) setCategorias(res.data); })
      .catch(() => notificar('error', 'No se pudo cargar la lista de categorías'))
      .finally(() => setLoading(false));
  }, []);

  const filtradas = useMemo(() => {
    if (!busqueda) return categorias;
    const b = busqueda.toLowerCase();
    return categorias.filter(c => c.nombre.toLowerCase().includes(b));
  }, [busqueda, categorias]);

  const handleGuardar = (nueva) => setCategorias(prev => [nueva, ...prev]);

  const handleEliminar = async (id) => {
    try {
      const resp = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const json = await resp.json();
      if (resp.ok && json.success) {
        setCategorias(prev => prev.filter(c => c.id !== id));
        notificar('exito', 'Categoría eliminada correctamente');
      } else {
        notificar('error', json.message || 'Error al eliminar categoría');
      }
    } catch (error) {
      console.error(error);
      notificar('error', 'Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full p-3 lg:p-5 mx-auto max-w-7xl">

      {/* ── Modales ── */}
      {notificacion && (
        <ModalNotificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}

      {showModal && (
        <ModalNuevaCategoria
          onClose={() => setShowModal(false)}
          onGuardar={handleGuardar}
          onNotificar={notificar}
        />
      )}

      {categoriaAEliminar && (
        <ModalEliminar
          categoria={categoriaAEliminar}
          onClose={() => setCategoriaAEliminar(null)}
          onConfirmar={handleEliminar}
        />
      )}

      {/* ── Encabezado ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="text-[#135bec] w-5 h-5" />
            Categorías
          </h1>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5 max-w-xl">
            Clasifica y gestiona tu inventario mediante familias de repuestos.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex justify-center flex-shrink-0 items-center gap-1.5 bg-[#135bec] hover:bg-[#1048bc] text-white px-4 py-2 rounded-lg text-[11px] font-bold transition-all shadow-md shadow-[#135bec]/20 uppercase tracking-widest"
        >
          <Plus size={14} strokeWidth={3} />
          Nueva Categoría
        </button>
      </div>

      {/* ── Buscador ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-20">
        <div className="flex items-center gap-2 w-full sm:min-w-[280px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-[#135bec] rounded-lg text-[11px] font-semibold outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center px-2.5 py-1 gap-1 text-[9px] font-black uppercase tracking-widest text-[#135bec] bg-[#135bec]/10 rounded-lg whitespace-nowrap border border-[#135bec]/20 w-full sm:w-auto justify-center">
          <Layers size={10} />
          <span>{filtradas.length} {filtradas.length === 1 ? 'Resultado' : 'Resultados'}</span>
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 text-xs font-bold">
          Cargando categorías...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtradas.map(c => (
            <CategoriaCard
              key={c.id}
              categoria={c}
              onEliminar={(cat) => setCategoriaAEliminar(cat)}
            />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {filtradas.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-slate-200 text-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 border border-slate-200">
            <Layers size={18} className="text-slate-400" />
          </div>
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Sin resultados</h3>
        </div>
      )}

    </div>
  );
};