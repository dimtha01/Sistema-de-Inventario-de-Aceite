import { useState, useEffect } from 'react';
import { ModalNuevoProducto } from '../components/ModalNuevoProducto';

// ── Íconos ───────────────────────────────────────────────
const IconX = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconClock = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);
const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
  </svg>
);

// ── DrawerContent ────────────────────────────────────────
const DrawerContent = ({ productoSel, onDeselect, onEditar }) => {
  if (!productoSel) return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-2.5 py-10">
      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path d="M15 15l6 6m-11-4a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
        </svg>
      </div>
      <p className="text-xs font-semibold text-slate-500">Selecciona un producto</p>
      <p className="text-[10px] text-slate-400 leading-relaxed">
        Haz clic en cualquier tarjeta para ver sus detalles
      </p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex flex-col gap-5 flex-1">

        {/* Miniatura + nombre */}
        <div className="flex items-start gap-3">
          {productoSel.imagen && (
            <div
              className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-center bg-cover"
              style={{ backgroundImage: `url('${encodeURI(productoSel.imagen)}')` }}
            />
          )}
          <div className="min-w-0">
            <span className="text-[9px] font-black text-[#135bec] uppercase tracking-[0.15em] block mb-0.5">
              Seleccionado
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-3">
              {productoSel.nombre}
            </h3>
          </div>
        </div>

        {/* Stock + Categoría */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Stock Actual</span>
            <span className="text-sm font-extrabold text-slate-900">
              {productoSel.stock} <span className="text-[10px] font-medium text-slate-600">unidades</span>
            </span>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Categoría</span>
            <span className="text-sm font-bold text-slate-800 truncate block">
              {productoSel.categoria || 'N/A'}
            </span>
          </div>
        </div>

        {/* Precios */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Precio Compra</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[10px] text-slate-500 font-medium">$</span>
              <span className="text-lg font-black text-slate-800 tracking-tight">
                {productoSel.precioCompra?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
          <div className="bg-[#135bec]/10 p-3 rounded-xl border border-[#135bec]/20">
            <span className="text-[9px] font-bold text-[#135bec]/80 uppercase tracking-wider block mb-1">Precio Venta</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[10px] text-[#135bec] font-bold">$</span>
              <span className="text-xl font-black text-[#135bec] tracking-tighter leading-tight">
                {productoSel.precioVenta?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Botón Editar */}
        <button
          onClick={onEditar}
          className="w-full bg-[#135bec] text-white font-bold py-2.5 rounded-xl text-xs transition-all hover:bg-[#1048bc] active:scale-[0.98] uppercase tracking-wider mt-2 flex items-center justify-center gap-2"
          style={{ boxShadow: '0 4px 14px -4px rgba(19,91,236,0.4)' }}
        >
          <IconEdit />
          Editar Producto
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-100 border-t border-slate-200">
        <div className="flex items-center gap-1.5 text-slate-500">
          <IconClock />
          <p className="text-[10px] font-semibold">
            Proveedor: {productoSel.proveedor || 'Sin asignar'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Página principal ──────────────────────────────────────
export const InventarioPage = () => {
  const [productos,       setProductos]       = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [marcaActiva,     setMarcaActiva]     = useState('Todas');
  const [productoSel,     setProductoSel]     = useState(null);
  const [panelOpen,       setPanelOpen]       = useState(false);
  const [modalProducto,   setModalProducto]   = useState(null);
  const modalAbierto = modalProducto !== null;

  useEffect(() => {
    fetch('/api/inventory/products')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setProductos(res.data);
          if (res.data.length > 0) setProductoSel(res.data[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria).filter(Boolean))];
  const marcas     = ['Todas', ...new Set(productos.map(p => p.proveedor).filter(Boolean))];

  const productosFiltrados = productos.filter(p => {
    const passCategoria = categoriaActiva === 'Todos' || p.categoria === categoriaActiva;
    const passMarca     = marcaActiva === 'Todas'    || p.proveedor  === marcaActiva;
    return passCategoria && passMarca;
  });

  const handleGuardar = (productoActualizado) => {
    setProductos(prev => {
      const existe = prev.some(p => p.id_producto === productoActualizado.id_producto);
      return existe
        ? prev.map(p => p.id_producto === productoActualizado.id_producto ? productoActualizado : p)
        : [productoActualizado, ...prev];
    });
    setProductoSel(productoActualizado);
  };

  const seleccionar = (p) => { setProductoSel(p); setPanelOpen(true); };
  const abrirEdicion = () => { if (productoSel) setModalProducto(productoSel); };

  return (
    <>
      {modalAbierto && (
        <ModalNuevoProducto
          productoEditar={modalProducto === false ? null : modalProducto}
          onClose={() => setModalProducto(null)}
          onGuardar={handleGuardar}
        />
      )}

      {/* ── Drawer lateral móvil ── */}
      {panelOpen && productoSel && (
        <div className="lg:hidden fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
            <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-xs text-slate-700 uppercase tracking-widest">Detalles</h2>
              <button onClick={() => setPanelOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <IconX className="w-3.5 h-3.5" />
              </button>
            </div>
            <DrawerContent
              productoSel={productoSel}
              onDeselect={() => { setProductoSel(null); setPanelOpen(false); }}
              onEditar={() => { setPanelOpen(false); abrirEdicion(); }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-5 items-start">
        {/* ── Columna principal ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Filtros categoría */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex gap-1.5 flex-wrap">
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide transition-colors ${
                    categoriaActiva === cat
                      ? 'bg-[#135bec] text-white shadow-sm shadow-[#135bec]/30'
                      : 'bg-white border border-slate-300 text-slate-600 hover:border-[#135bec]/50 hover:text-[#135bec]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
                {productos.length} productos
              </span>
            </div>
          </div>

          {/* Filtros proveedor */}
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200 overflow-x-auto">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex-shrink-0">Proveedor</span>
            {marcas.map(marca => (
              <button
                key={marca}
                onClick={() => setMarcaActiva(marca)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide flex-shrink-0 transition-colors ${
                  marcaActiva === marca
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-300 text-slate-500 hover:border-[#135bec]/50 hover:text-[#135bec]'
                }`}
              >
                {marca}
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          {loading ? (
            <div className="flex items-center justify-center p-20 text-slate-500 font-semibold text-sm">
              Cargando inventario...
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {productosFiltrados.map(p => (
                <div key={p.id_producto} className="group cursor-pointer" onClick={() => seleccionar(p)}>
                  <div className={`aspect-square rounded-xl bg-white overflow-hidden border mb-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#135bec]/10 ${
                    productoSel?.id_producto === p.id_producto
                      ? 'border-[#135bec] shadow-md shadow-[#135bec]/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    {p.imagen ? (
                      <div
                        className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${encodeURI(p.imagen)}')` }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                          <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs mb-0.5 leading-tight line-clamp-2">{p.nombre}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-slate-500">
                      Stock: <span className={`font-bold ${p.stockColor}`}>{p.stock}</span>
                    </p>
                    {productoSel?.id_producto === p.id_producto && (
                      <svg className="w-3.5 h-3.5 text-[#135bec]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Panel lateral desktop ── */}
        <aside
          className="w-72 hidden lg:flex flex-col bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden self-start sticky top-20 flex-shrink-0"
          style={{ height: 'calc(100vh - 120px)' }}
        >
          <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-xs text-slate-700 uppercase tracking-widest">Detalles</h2>
            <button onClick={() => setProductoSel(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <IconX className="w-3.5 h-3.5" />
            </button>
          </div>
          <DrawerContent
            productoSel={productoSel}
            onDeselect={() => setProductoSel(null)}
            onEditar={abrirEdicion}
          />
        </aside>

        {/* ── FAB crear ── */}
        <button
          onClick={() => setModalProducto(false)}
          className="fixed bottom-5 right-5 w-12 h-12 bg-[#135bec] text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30"
          style={{ boxShadow: '0 6px 24px -4px rgba(19,91,236,0.55)' }}
          title="Agregar producto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </>
  );
};