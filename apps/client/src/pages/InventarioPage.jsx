import { useState } from 'react';

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
const categoriasForm = ['Suspensión', 'Motor', 'Frenos', 'Escape', 'Eléctrico', 'Accesorios'];

const formInicial = {
  nombre: '', stock: '', categoria: 'Suspensión',
  precioCompra: '', precioVenta: '', imagen: null, preview: null,
};

// ── Modal Nuevo Producto ──────────────────────────────────
const ModalNuevoProducto = ({ onClose, onGuardar }) => {
  const [form, setForm] = useState(formInicial);
  const [dragging, setDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImagen = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, imagen: file, preview: url }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleImagen(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onGuardar({
      id: Date.now(),
      nombre: form.nombre,
      stock: Number(form.stock) || 0,
      stockColor: Number(form.stock) <= 4 ? 'text-orange-500' : 'text-slate-900',
      imagen: form.preview || '',
      precioCompra: parseFloat(form.precioCompra) || 0,
      precioVenta: parseFloat(form.precioVenta) || 0,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl shadow-[#135bec]/10 border border-slate-100 overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Lado izquierdo: Imagen ── */}
        <div className="w-full md:w-5/12 p-8 bg-slate-50 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-slate-100">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
              Nuevo Producto
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Capture la esencia de la pieza premium.
            </p>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
            className={`relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-6 py-12 cursor-pointer transition-all ${
              dragging
                ? 'border-[#135bec] bg-[#135bec]/5 scale-[0.99]'
                : form.preview
                ? 'border-[#135bec]/40 bg-white'
                : 'border-[#135bec]/20 bg-white hover:border-[#135bec] hover:bg-[#135bec]/5'
            }`}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImagen(e.target.files[0])}
            />
            {form.preview ? (
              <>
                <img
                  src={form.preview}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-2xl"
                />
                <p className="text-xs text-[#135bec] font-bold">
                  Clic para cambiar imagen
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#135bec]/10 flex items-center justify-center text-[#135bec]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
                    <path d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-900 text-sm">Imagen del Producto</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                    Arrastra o haz clic para subir
                  </p>
                </div>
                <button
                  type="button"
                  className="px-6 py-2.5 bg-[#135bec] text-white text-xs font-bold rounded-full shadow-lg shadow-[#135bec]/25 hover:scale-105 active:scale-95 transition-transform"
                >
                  Subir Imagen
                </button>
              </>
            )}
          </div>

          {/* Tip */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#135bec]/5 border border-[#135bec]/10">
            <svg className="w-4 h-4 text-[#135bec] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"/>
            </svg>
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              Para mejor visualización, use fondos neutros y luz natural.
            </p>
          </div>
        </div>

        {/* ── Lado derecho: Formulario ── */}
        <div className="w-full md:w-7/12 p-8 flex flex-col">

          {/* Cerrar */}
          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-slate-500 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-5">

            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#135bec]">
                Detalles del Repuesto
              </label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/>
                  <path d="M6 6h.008v.008H6V6Z"/>
                </svg>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Nombre del Producto (ej. Amortiguador Brembo)"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-[#135bec] focus:outline-none rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* Stock + Categoría */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Stock Inicial
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/>
                  </svg>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-[#135bec] focus:outline-none rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Categoría
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
                  </svg>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-[#135bec] focus:outline-none rounded-2xl text-slate-900 text-sm font-medium transition-all appearance-none"
                  >
                    {categoriasForm.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Precios */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Precio de Compra
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/>
                  </svg>
                  <input
                    name="precioCompra"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.precioCompra}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-[#135bec] focus:outline-none rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Precio de Venta
                </label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                  </svg>
                  <input
                    name="precioVenta"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.precioVenta}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-[#135bec]/20 focus:border-[#135bec] focus:outline-none rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Preview margen en tiempo real */}
            {form.precioCompra && form.precioVenta && Number(form.precioCompra) > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>
                </svg>
                <p className="text-xs font-bold text-emerald-700">
                  Margen estimado:{' '}
                  <span className="text-emerald-600">
                    {(((Number(form.precioVenta) - Number(form.precioCompra)) / Number(form.precioCompra)) * 100).toFixed(1)}%
                  </span>
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="mt-auto pt-4 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#135bec] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{ boxShadow: '0 8px 24px -4px rgba(19,91,236,0.4)' }}
              >
                Guardar Producto
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
              >
                Cancelar y Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ── Página Inventario ────────────────────────────────────
export const InventarioPage = () => {
  const [productos, setProductos]         = useState(productosIniciales);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [marcaActiva, setMarcaActiva]     = useState('Todas');
  const [productoSel, setProductoSel]     = useState(productos[1]);
  const [showModal, setShowModal]         = useState(false);

  const margen = productoSel
    ? (((productoSel.precioVenta - productoSel.precioCompra) / productoSel.precioCompra) * 100).toFixed(1)
    : 0;

  const handleGuardar = (nuevoProducto) => {
    setProductos(prev => [nuevoProducto, ...prev]);
    setProductoSel(nuevoProducto);
  };

  return (
    <>
      {/* ── Modal ── */}
      {showModal && (
        <ModalNuevoProducto
          onClose={() => setShowModal(false)}
          onGuardar={handleGuardar}
        />
      )}

      <div className="flex gap-6 items-start">

        {/* ── Columna izquierda ── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* Filtros categoría */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                    categoriaActiva === cat
                      ? 'bg-[#135bec] text-white'
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-[#135bec]/40 hover:text-[#135bec]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                Orden: Popular
              </span>
              <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Filtros marca */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 overflow-x-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex-shrink-0">
              Marca
            </span>
            {marcas.map((marca) => (
              <button
                key={marca}
                onClick={() => setMarcaActiva(marca)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex-shrink-0 transition-colors ${
                  marcaActiva === marca
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-[#135bec]/40 hover:text-[#135bec]'
                }`}
              >
                {marca}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {productos.map((p) => (
              <div key={p.id} className="group cursor-pointer" onClick={() => setProductoSel(p)}>
                <div
                  className={`aspect-square rounded-xl bg-white overflow-hidden border mb-3 transition-all duration-300 hover:shadow-xl hover:shadow-[#135bec]/5 ${
                    productoSel?.id === p.id
                      ? 'border-[#135bec] shadow-lg shadow-[#135bec]/10'
                      : 'border-slate-100'
                  }`}
                >
                  {p.imagen ? (
                    <div
                      className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${p.imagen}')` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                        <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1 leading-tight line-clamp-2">
                  {p.nombre}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">
                    Stock: <span className={`font-semibold ${p.stockColor}`}>{p.stock} Uds.</span>
                  </p>
                  {productoSel?.id === p.id ? (
                    <svg className="w-4 h-4 text-[#135bec]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path d="m4.5 12.75 6 6 9-13.5"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path d="M7 17 17 7M7 7h10v10"/>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Proveedores */}
          <section className="mt-2 border-t border-slate-200 pt-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">
              Proveedores Premium Certificados
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              {proveedores.map((prov) => (
                <div key={prov} className="h-7 px-4 bg-slate-200/60 rounded flex items-center justify-center font-black text-slate-500 text-xs tracking-wider">
                  {prov}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Panel lateral ── */}
        <aside className="w-80 hidden lg:flex flex-col bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden self-start sticky top-24 flex-shrink-0">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-sm text-slate-800">Detalles del Producto</h2>
            <button onClick={() => setProductoSel(null)} className="text-slate-300 hover:text-slate-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {productoSel ? (
            <>
              <div className="p-6 flex flex-col gap-6">
                <div>
                  <span className="text-[10px] font-black text-[#135bec] uppercase tracking-[0.2em] mb-1.5 block">
                    Artículo Seleccionado
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                    {productoSel.nombre}
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Precio de Compra</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-medium text-slate-400">$</span>
                      <span className="text-4xl font-black text-slate-800 tracking-tighter">
                        {productoSel.precioCompra.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Precio de Venta</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-medium text-[#135bec]">$</span>
                      <span className="text-5xl font-black text-[#135bec] tracking-tighter">
                        {productoSel.precioVenta.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Margen</span>
                    <span className="text-base font-extrabold text-emerald-500">{margen}%</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Rotación Est.</span>
                    <span className="text-base font-extrabold text-slate-800">12 Days</span>
                  </div>
                </div>
                <button
                  className="w-full bg-[#135bec] text-white font-bold py-3 rounded-xl text-sm transition-all hover:bg-[#135bec]/90 active:scale-[0.98]"
                  style={{ boxShadow: '0 6px 20px -4px rgba(19,91,236,0.35)' }}
                >
                  Editar Parámetros Globales
                </button>
              </div>
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-400">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                  </svg>
                  <p className="text-[11px] font-medium">Última revisión: hace 2 horas por Alex</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3 py-12">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M15 15l6 6m-11-4a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-400">Selecciona un producto</p>
              <p className="text-xs text-slate-300">Haz clic en cualquier tarjeta para ver detalles</p>
            </div>
          )}
        </aside>

        {/* ── FAB ── */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#135bec] text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
          style={{ boxShadow: '0 8px 32px -4px rgba(19,91,236,0.5)' }}
          title="Agregar nuevo producto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>

      </div>
    </>
  );
};
