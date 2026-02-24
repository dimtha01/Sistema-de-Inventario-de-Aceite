import { useState } from 'react';
import { ModalNuevoProducto } from '../components/ModalNuevoProducto';

// ── Datos ────────────────────────────────────────────────
const productosIniciales = [
  {
    id: 1, nombre: 'Disco Brembo Carbono Cerámico', stock: 32,
    stockColor: 'text-slate-900',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuq7R-r2QQL8qvQezOS0nbZRf1k1vD24TEWk5YSQ6i4VaVVcA1TSlRT-7fclcJpqKNtNYsrfx3Q4Y47sqxl9qXrCA35thGrb1gYf_JQ0Zbrc4jcQ5T_5sgcwg8dzGSatBdNmf4ameDDoPNcOW4YFtfQuzKVXfrPYgPYxikJKZZstXpX3qFgfsQILX_Uv2qIeaWGKeIZ2pIcb7IfwTyJV0qVt6QWDgNkeSH_4yCdkZs6ZF2KR424BG6mNavnYoZj0kfJ1_KpeQOsr4',
    precioCompra: 1100, precioVenta: 1520,
  },
  {
    id: 2, nombre: 'Kit de Pistones Forjados JE', stock: 32,
    stockColor: 'text-slate-900',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgzyL9xL2cygwPfLAOEbwFDsoqHFHnyDEH0UxzCczsibqVpW1DYAgLgcvBL2s7mkZsKBK7Wb_pRU3WmhpuZNUBy93IXbXAf2S_CDb0l0VqVFn3mbwVssjwBxZD_sX95nWhlCfYxDbFVFhvaZmHnka3QvG3jIpjhN934PeYCHDwecIGNKCU6VDS6e26cKFd4qenofWpIDqbvIsV1y_IPQYxPehrQEyCnjqB0e4khNTfgtIQLO3PnjEl8MpmwyAR9M_MtXByLggBe1M',
    precioCompra: 1240, precioVenta: 1895,
  },
  {
    id: 3, nombre: 'Neumáticos Michelin Pilot Sport 4S', stock: 32,
    stockColor: 'text-slate-900',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsQQpyKuqtRIOT2uFbRHpBV9zw4Qt4MrQm5vKYCbA4uVOoyetui5B99kl6XEVv5TD-3zEW9T1Q0BgQA1FYnAZC0fyoiQ0REglS9N-nkT8S7vp59Rb9CK6aJ0BdmcuG_xyCQlY_Zmm0AVsHd-NVed5XMIAVbf_Kgnt0pkBxUcf4n4FucLsSytDpe2x8uulsz-blIvsrADgGRlUPz-TvyJwL-4wA40SKOB2jnI3Tr7Fppmj_dPuKHTOjmqY3NwGpUwvwxqbPzhcmj3c',
    precioCompra: 2100, precioVenta: 3150,
  },
  {
    id: 4, nombre: 'Faro Laser Matrix', stock: 2,
    stockColor: 'text-orange-500',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7fqYlAOFcatG3r_37bPOFJypDTY5smCPpuMsyfuJ2DTJfVYFwsO4oEqacG8pmz1JYvH2yOrs3nw2Kq6dfIuW5s7ljvDeb2i3i5-ww5yK2BsUhA88k2U63qc1QDDcCF1y51it9K7jZa4zmTWlgvJIIxWzKuIg9odhR6qur_LuVDM7OA_F-wLQ2Ub9F_aRxCrYjX79VjyY-LTOongIU-vwVdCekcgnALGKxKVjoXOAqN7nJ1pqfF_hQFegoIInqB5QX12mhfSU6yzo',
    precioCompra: 1980, precioVenta: 2890,
  },
  {
    id: 5, nombre: 'Amortiguadores Ohlins Road & Track', stock: 4,
    stockColor: 'text-slate-900',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDngCIVipOFEgn7a7bQJUuefDN3_DNfPHBZMxjG9ofYXWOryfo_NpSCbxyGuVI5RoQ0tBGIaWM984uF5rHZcs4m-eg_uHXS8ZOgbarULiy32ElC89ys6_1rnw4xGbeAqNQvebTF0CSyMTUoTIAZ_vTTE6q-PvWkQoAykE_ZulvFbO5jens1Nvr3DapMlDZ2rfbAxd6HyNRpC85wmEQ5Sx1Xl-QqngzYeagi0E71xCbhl2ESn7uIrt_GgdVrxEeMMORxCnrwkL7UBBY',
    precioCompra: 6100, precioVenta: 8900,
  },
  {
    id: 6, nombre: 'Sistema de Escape de Titanio', stock: 6,
    stockColor: 'text-slate-900',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPSMfy7BiHbPb4LosuRq_C7pIvqo_KIv_l9MjUbs-n-TbCVjEXKAI4YtrfQ7C47X9j2i1j9LCoWXApAyHbSJjrFUgOPi5pZrSvt6ELvlGuWlYZtAUKr7Vg-uPrPZadDXFcQjLyXP9kjz19fYOzoYzOCuachGbk6-eTxlWD0Fg9EUqcyJPONSZMqtNcafW1Qx9fbkabTrM4rNYMia-Ym7feIKhJH5XKcwxhhbNblTCrPDqqNh6N-UnN6ZJ9_um6NoO38q-_v6jIfSc',
    precioCompra: 8750, precioVenta: 12500,
  },
];

const categorias  = ['Todos', 'Rendimiento', 'Mantenimiento', 'Accesorios'];
const marcas      = ['Todas', 'Bosch', 'Michelin', 'Brembo', 'Akrapovič', 'Öhlins'];
const proveedores = ['BOSCH', 'MICHELIN', 'BREMBO', 'AKRAPOVIČ', 'OHLINS'];

// ── Íconos locales (solo los que usa esta página) ─────────
const IconX = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

const IconClock = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
  </svg>
);

// ── DrawerContent (panel lateral + drawer móvil) ──────────
const DrawerContent = ({ productoSel, margen, onDeselect }) => {
  if (!productoSel) return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-2.5 py-10">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path d="M15 15l6 6m-11-4a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"/>
        </svg>
      </div>
      <p className="text-xs font-semibold text-slate-400">Selecciona un producto</p>
      <p className="text-[10px] text-slate-300 leading-relaxed">
        Haz clic en cualquier tarjeta para ver sus detalles
      </p>
    </div>
  );

  return (
    <>
      <div className="p-4 flex flex-col gap-4">

        {/* Miniatura + nombre */}
        <div className="flex items-start gap-3">
          {productoSel.imagen && (
            <div
              className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 bg-center bg-cover"
              style={{ backgroundImage: `url('${productoSel.imagen}')` }}
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

        {/* Precios */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Compra
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[10px] text-slate-400 font-medium">$</span>
              <span className="text-xl font-black text-slate-800 tracking-tighter leading-tight">
                {productoSel.precioCompra.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="bg-[#135bec]/5 p-3 rounded-xl border border-[#135bec]/10">
            <span className="text-[9px] font-bold text-[#135bec]/70 uppercase tracking-wider block mb-1">
              Venta
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[10px] text-[#135bec] font-medium">$</span>
              <span className="text-xl font-black text-[#135bec] tracking-tighter leading-tight">
                {productoSel.precioVenta.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Margen
            </span>
            <span className="text-sm font-extrabold text-emerald-500">{margen}%</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Rotación
            </span>
            <span className="text-sm font-extrabold text-slate-800">12 días</span>
          </div>
        </div>

        <button
          className="w-full bg-[#135bec] text-white font-bold py-2.5 rounded-xl text-xs transition-all hover:bg-[#135bec]/90 active:scale-[0.98] uppercase tracking-wider"
          style={{ boxShadow: '0 4px 14px -4px rgba(19,91,236,0.4)' }}
        >
          Editar Parámetros
        </button>
      </div>

      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-1.5 text-slate-400">
          <IconClock />
          <p className="text-[10px] font-medium">Revisado hace 2 horas · Alex</p>
        </div>
      </div>
    </>
  );
};

// ── Página principal ─────────────────────────────────────
export const InventarioPage = () => {
  const [productos, setProductos]             = useState(productosIniciales);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [marcaActiva, setMarcaActiva]         = useState('Todas');
  const [productoSel, setProductoSel]         = useState(productos[1]);
  const [showModal, setShowModal]             = useState(false);
  const [panelOpen, setPanelOpen]             = useState(false);

  const margen = productoSel
    ? (((productoSel.precioVenta - productoSel.precioCompra) / productoSel.precioCompra) * 100).toFixed(1)
    : 0;

  const handleGuardar = (p) => {
    setProductos(prev => [p, ...prev]);
    setProductoSel(p);
  };

  const seleccionar = (p) => {
    setProductoSel(p);
    setPanelOpen(true);
  };

  return (
    <>
      {/* ── Modal separado como componente ── */}
      {showModal && (
        <ModalNuevoProducto
          onClose={() => setShowModal(false)}
          onGuardar={handleGuardar}
        />
      )}

      {/* ── Drawer lateral móvil ── */}
      {panelOpen && productoSel && (
        <div className="lg:hidden fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
          />
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-xs text-slate-700 uppercase tracking-widest">Detalles</h2>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-slate-300 hover:text-slate-500 transition-colors"
              >
                <IconX className="w-3.5 h-3.5" />
              </button>
            </div>
            <DrawerContent
              productoSel={productoSel}
              margen={margen}
              onDeselect={() => { setProductoSel(null); setPanelOpen(false); }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-5 items-start">

        {/* ── Columna principal ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Filtros categoría + contador */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex gap-1.5 flex-wrap">
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide transition-colors ${
                    categoriaActiva === cat
                      ? 'bg-[#135bec] text-white'
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-[#135bec]/40 hover:text-[#135bec]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                {productos.length} productos
              </span>
              <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Filtros marca */}
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 overflow-x-auto">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex-shrink-0">
              Marca
            </span>
            {marcas.map(marca => (
              <button
                key={marca}
                onClick={() => setMarcaActiva(marca)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide flex-shrink-0 transition-colors ${
                  marcaActiva === marca
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-400 hover:border-[#135bec]/40 hover:text-[#135bec]'
                }`}
              >
                {marca}
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {productos.map(p => (
              <div key={p.id} className="group cursor-pointer" onClick={() => seleccionar(p)}>
                <div className={`aspect-square rounded-xl bg-white overflow-hidden border mb-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#135bec]/5 ${
                  productoSel?.id === p.id
                    ? 'border-[#135bec] shadow-md shadow-[#135bec]/10'
                    : 'border-slate-100'
                }`}>
                  {p.imagen ? (
                    <div
                      className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${p.imagen}')` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                        <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-xs mb-0.5 leading-tight line-clamp-2">
                  {p.nombre}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400">
                    Stock: <span className={`font-semibold ${p.stockColor}`}>{p.stock}</span>
                  </p>
                  {productoSel?.id === p.id ? (
                    <svg className="w-3.5 h-3.5 text-[#135bec]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path d="m4.5 12.75 6 6 9-13.5"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path d="M7 17 17 7M7 7h10v10"/>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Panel lateral desktop ── */}
        <aside className="w-72 hidden lg:flex flex-col bg-white border border-slate-100 rounded-2xl shadow-md overflow-hidden self-start sticky top-20 flex-shrink-0">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-xs text-slate-700 uppercase tracking-widest">Detalles</h2>
            <button
              onClick={() => setProductoSel(null)}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <IconX className="w-3.5 h-3.5" />
            </button>
          </div>
          <DrawerContent
            productoSel={productoSel}
            margen={margen}
            onDeselect={() => setProductoSel(null)}
          />
        </aside>

        {/* ── FAB ── */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-5 right-5 w-12 h-12 bg-[#135bec] text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30"
          style={{ boxShadow: '0 6px 24px -4px rgba(19,91,236,0.55)' }}
          title="Agregar producto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>

      </div>
    </>
  );
};