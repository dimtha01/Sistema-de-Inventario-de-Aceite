import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Layers, ArrowRight, Tags, Package, X } from 'lucide-react';

// ── Modal Nueva Categoría (Reducido y Compacto) ───────────
const ModalNuevaCategoria = ({ onClose, onGuardar }) => {
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setLoading(true);

    try {
      const resp = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });

      const json = await resp.json();
      if (resp.ok && json.success) {
        onGuardar(json.data);
        onClose();
      } else {
        alert(json.message || "Error al crear categoría");
      }
    } catch (error) {
      console.error(error);
      alert("Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      {/* Modal más pequeño: max-w-sm en lugar de max-w-xl */}
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Nueva Categoría</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">
              Nombre de la Categoría
            </label>
            <input
              required
              autoFocus
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej. Sistema Eléctrico"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] transition-all outline-none text-sm font-medium"
            />
          </div>

          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors text-xs">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-[#135bec] text-white font-bold hover:bg-[#1048bc] shadow-md shadow-[#135bec]/20 transition-all active:scale-95 text-xs disabled:opacity-50">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Tarjeta de categoría (Más pequeña y sin descripción) ──
const CategoriaCard = ({ categoria }) => (
  <div className="group bg-white flex flex-col rounded-2xl border border-slate-200 p-4 transition-all duration-300 hover:shadow-lg hover:border-[#135bec]/40 hover:-translate-y-1 cursor-pointer">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#135bec]/10 group-hover:text-[#135bec] transition-colors duration-300 flex-shrink-0">
        <Layers size={20} className="group-hover:scale-110 transition-transform duration-300" />
      </div>
      <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border flex items-center gap-1 shadow-sm ${
        categoria.estado === 'Crítico' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
        categoria.estado === 'Revisar stock' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
        'bg-emerald-50 text-emerald-600 border-emerald-100'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          categoria.estado === 'Crítico' ? 'bg-rose-500' : 
          categoria.estado === 'Revisar stock' ? 'bg-amber-500' : 
          'bg-emerald-500'
        }`} />
        {categoria.estado}
      </span>
    </div>

    {/* Nombre central sin descripción debajo */}
    <h3 className="text-base font-black text-slate-900 leading-tight mb-4 group-hover:text-[#135bec] transition-colors duration-300 truncate">
      {categoria.nombre}
    </h3>

    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
          <Package size={12} className="opacity-70" />
          <span>Items</span>
        </div>
        <p className="text-sm font-black text-slate-900">{categoria.productos}</p>
      </div>
      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
          <Tags size={12} className="opacity-70" />
          <span>Valor</span>
        </div>
        <p className="text-sm font-black text-slate-900 truncate">{categoria.stockValor}</p>
      </div>
    </div>

    <button className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 border border-slate-100 text-slate-600 font-bold rounded-xl text-[10px] uppercase tracking-widest group-hover:bg-[#135bec] group-hover:border-[#135bec] group-hover:text-white transition-all duration-300">
      Explorar
      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// ── Card vacía (Ajustada al nuevo tamaño) ─────────────────
const NuevaCategoriaCard = ({ onClick }) => (
  <div
    onClick={onClick}
    className="group flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 p-4 text-center hover:border-[#135bec] hover:bg-[#135bec]/5 transition-all duration-300 cursor-pointer min-h-[220px]"
  >
    <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 mb-3 group-hover:scale-110 group-hover:bg-[#135bec] transition-all duration-300">
      <Plus className="text-[#135bec] group-hover:text-white transition-colors" size={20} strokeWidth={2.5} />
    </div>
    <h3 className="font-bold text-sm text-slate-900">Crear Categoría</h3>
  </div>
);

// ── Página principal ─────────────────────────────────────
export const CategoriasPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Asegúrate de que esta ruta coincida con tu backend
    fetch('/api/categories')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setCategorias(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtradas = useMemo(() => {
    if (!busqueda) return categorias;
    const b = busqueda.toLowerCase();
    return categorias.filter(c => c.nombre.toLowerCase().includes(b));
  }, [busqueda, categorias]);

  const handleGuardar = (nueva) => {
    // Insertamos al principio para que se vea de inmediato
    setCategorias(prev => [nueva, ...prev]);
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 w-full p-4 lg:p-6 mx-auto max-w-7xl">

      {showModal && (
        <ModalNuevaCategoria
          onClose={() => setShowModal(false)}
          onGuardar={handleGuardar}
        />
      )}

      {/* ── Encabezado ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="text-[#135bec] w-6 h-6" />
            Categorías
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1 max-w-xl">
            Clasifica y gestiona tu inventario mediante familias de repuestos.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex justify-center flex-shrink-0 items-center gap-2 bg-[#135bec] hover:bg-[#1048bc] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#135bec]/20 uppercase tracking-widest"
        >
          <Plus size={16} strokeWidth={3} />
          Nueva Categoría
        </button>
      </div>

      {/* ── Buscador ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm sticky top-4 z-20">
        <div className="flex items-center gap-3 w-full sm:min-w-[320px] relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-transparent focus:border-[#135bec] rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center px-3 py-1.5 gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#135bec] bg-[#135bec]/10 rounded-lg whitespace-nowrap border border-[#135bec]/20 w-full sm:w-auto justify-center">
          <Layers size={12} />
          <span>{filtradas.length} {filtradas.length === 1 ? 'Resultado' : 'Resultados'}</span>
        </div>
      </div>

      {/* ── Grid (Modificado para tarjetas más pequeñas) ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm font-bold">Cargando categorías...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtradas.map(c => (
            <CategoriaCard key={c.id} categoria={c} />
          ))}
          {!busqueda && (
            <NuevaCategoriaCard onClick={() => setShowModal(true)} />
          )}
        </div>
      )}

      {/* ── Empty state ── */}
      {filtradas.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 border-dashed text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
            <Layers size={24} className="text-slate-300" />
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            Sin resultados
          </h3>
        </div>
      )}

    </div>
  );
};