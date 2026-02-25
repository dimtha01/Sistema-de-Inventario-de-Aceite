import { useState, useEffect } from 'react';
import { ModalNuevaCategoria } from './ModalNuevaCategoria';
import { ModalNuevoProveedor } from './ModalNuevoProveedor';

// ── Modal Notificación ────────────────────────────────────
const ModalNotificacion = ({ tipo, mensaje, onClose }) => {
  const esError = tipo === 'error';
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-xs rounded-2xl shadow-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-5 flex flex-col items-center text-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${esError ? 'bg-rose-100 border-rose-200' : 'bg-emerald-100 border-emerald-200'
            }`}>
            {esError ? (
              <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
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

const inputCls =
  'w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-transparent focus:border-[#135bec] focus:outline-none rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all';

// ── Sub-componente Field ──────────────────────────────────
const Field = ({ label, labelColor = 'text-slate-400', icon, rightContent, children }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <label className={`text-[10px] font-black uppercase tracking-widest ${labelColor}`}>
        {label}
      </label>
      {rightContent}
    </div>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        {icon}
      </span>
      {children}
    </div>
  </div>
);

// ── Íconos ───────────────────────────────────────────────
const IcTag = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    <path d="M6 6h.008v.008H6V6Z" />
  </svg>
);
const IcBox = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);
const IcGrid = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);
const IcCard = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
);
const IcCart = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);
const IcTrend = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);
const IcCamera = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);
const IcInfo = () => (
  <svg className="w-3.5 h-3.5 text-[#135bec] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);
const IcX = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

// ── Componente principal ─────────────────────────────────
/**
 * @param {{ 
 * onClose: () => void, 
 * onGuardar: (producto: object) => void,
 * productoEditar?: object | null // 👈 NUEVA PROP PARA MODO EDICIÓN
 * }} props
 */
export const ModalNuevoProducto = ({ onClose, onGuardar, productoEditar = null }) => {
  const modoEdicion = Boolean(productoEditar); // Identifica si estamos creando o editando

  const [form, setForm] = useState({
    nombre: '', stock: '', stock_minimo_alerta: '', id_categoria: '', id_proveedor: '',
    precioCompra: '', precioVenta: '', preview: null, imagen: null,
  });

  const [dragging, setDragging] = useState(false);
  const [opciones, setOpciones] = useState({ categorias: [], proveedores: [] });
  const [saving, setSaving] = useState(false);
  const [modalCat, setModalCat] = useState(false);
  const [modalProv, setModalProv] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  useEffect(() => {
    fetch('/api/inventory/options')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setOpciones(res.data);

          // ── LÓGICA DE POBLACIÓN DE DATOS ──
          if (modoEdicion && productoEditar) {
            // Llenar el form con los datos del producto a editar
            setForm({
              nombre: productoEditar.nombre || '',
              stock: productoEditar.stock !== undefined ? String(productoEditar.stock) : '',
              stock_minimo_alerta: productoEditar.stock_minimo_alerta !== undefined ? String(productoEditar.stock_minimo_alerta) : '5',
              id_categoria: productoEditar.id_categoria || (res.data.categorias[0]?.id_categoria ?? ''),
              id_proveedor: productoEditar.id_proveedor || (res.data.proveedores[0]?.id_proveedor ?? ''),
              precioCompra: productoEditar.precioCompra !== undefined ? String(productoEditar.precioCompra) : '',
              precioVenta: productoEditar.precioVenta !== undefined ? String(productoEditar.precioVenta) : '',
              preview: productoEditar.imagen || null,
              imagen: null, // Si no se sube nada nuevo, el backend conserva la que ya tiene
            });
          } else if (res.data.categorias?.length > 0 && res.data.proveedores?.length > 0) {
            // Modo creación: Seleccionar el primer elemento por defecto
            setForm(p => ({
              ...p,
              id_categoria: res.data.categorias[0].id_categoria,
              id_proveedor: res.data.proveedores[0].id_proveedor
            }));
          }
        }
      });
  }, [modoEdicion, productoEditar]);

  const set = (name, value) => setForm(p => ({ ...p, [name]: value }));

  const handlerNuevaCat = (cat) => {
    const newCat = { ...cat, id_categoria: cat.id_categoria || cat.id, nombre_categoria: cat.nombre_categoria || cat.nombre };
    setOpciones(p => ({ ...p, categorias: [...p.categorias, newCat] }));
    set('id_categoria', newCat.id_categoria);
  };

  const handlerNuevoProv = (prov) => {
    const newProv = { ...prov, id_proveedor: prov.id_proveedor || prov.id, nombre_empresa: prov.nombre_empresa || prov.nombre };
    setOpciones(p => ({ ...p, proveedores: [...p.proveedores, newProv] }));
    set('id_proveedor', newProv.id_proveedor);
  };

  const handleImagen = (file) => {
    if (!file?.type.startsWith('image/')) return;
    set('preview', URL.createObjectURL(file));
    set('imagen', file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleImagen(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || saving) return;
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("nombre", form.nombre);
      fd.append("stock", String(Number(form.stock) || 0));
      fd.append("stock_minimo_alerta", String(Number(form.stock_minimo_alerta) || 5));
      fd.append("id_categoria", String(form.id_categoria));
      fd.append("id_proveedor", String(form.id_proveedor));
      fd.append("precioCompra", String(parseFloat(form.precioCompra) || 0));
      fd.append("precioVenta", String(parseFloat(form.precioVenta) || 0));

      const mpUser = JSON.parse(localStorage.getItem('mp_user') || '{}');
      if (mpUser.id_usuario) {
        fd.append("id_usuario", String(mpUser.id_usuario));
      }

      if (form.imagen) fd.append("image", form.imagen);

      // ── DINAMISMO ENTRE POST (CREAR) Y PUT (EDITAR) ──
      const url = modoEdicion
        ? `/api/inventory/products/${productoEditar.id_producto}` // Editar
        : "/api/inventory/products"; // Crear

      const method = modoEdicion ? "PUT" : "POST";

      const resp = await fetch(url, {
        method: method,
        body: fd,
      });

      let json = {};
      try {
        json = await resp.json();
      } catch (err) {
        console.error("El servidor no devolvió un JSON válido. Probablemente un Error 500.");
      }

      if (resp.ok && json.success) {
        setNotificacion({ tipo: 'exito', mensaje: `¡Producto ${modoEdicion ? 'actualizado' : 'creado'} exitosamente!` });
        setTimeout(() => {
          onGuardar(json.data);
          onClose();
        }, 1200);
      } else {
        setNotificacion({ tipo: 'error', mensaje: json.message || `Error al ${modoEdicion ? 'actualizar' : 'crear'} producto` });
      }
    } catch (error) {
      console.error(error);
      setNotificacion({ tipo: 'error', mensaje: "Error de conexión con el servidor" });
    } finally {
      setSaving(false);
    }
  };

  const margenPreview =
    form.precioCompra && form.precioVenta && Number(form.precioCompra) > 0
      ? (((Number(form.precioVenta) - Number(form.precioCompra)) / Number(form.precioCompra)) * 100).toFixed(1)
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col sm:flex-row"
        style={{ maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Izquierda: imagen ── */}
        <div className="sm:w-[42%] p-5 bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
              {modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {modoEdicion ? 'Modifica los datos del repuesto.' : 'Capture la esencia de la pieza.'}
            </p>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('mp-file-input').click()}
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-8 cursor-pointer transition-all ${dragging
              ? 'border-[#135bec] bg-[#135bec]/5'
              : form.preview
                ? 'border-[#135bec]/40 bg-white'
                : 'border-[#135bec]/20 bg-white hover:border-[#135bec] hover:bg-[#135bec]/5'
              }`}
          >
            <input
              id="mp-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleImagen(e.target.files[0])}
            />

            {form.preview ? (
              <>
                <img
                  src={form.preview}
                  alt="preview"
                  className="w-full h-32 object-cover rounded-xl"
                />
                <p className="text-[11px] text-[#135bec] font-bold">
                  Clic para cambiar
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-[#135bec]/10 flex items-center justify-center text-[#135bec]">
                  <IcCamera />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-xs">Arrastra o haz clic</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP</p>
                </div>
                <button
                  type="button"
                  className="px-5 py-2 bg-[#135bec] text-white text-[11px] font-bold rounded-full shadow-lg shadow-[#135bec]/25 hover:scale-105 active:scale-95 transition-transform"
                >
                  Subir Imagen
                </button>
              </>
            )}
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#135bec]/5 border border-[#135bec]/10">
            <IcInfo />
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              {modoEdicion
                ? 'Si no cambias la imagen, se conservará la original.'
                : 'Use fondos neutros y luz natural para mejor visualización.'}
            </p>
          </div>
        </div>

        {/* ── Derecha: formulario ── */}
        <div className="flex-1 p-5 flex flex-col overflow-y-auto">

          {/* Header form */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-[#135bec] uppercase tracking-widest">
              {modoEdicion ? 'Editar Detalles' : 'Detalles del Repuesto'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <IcX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">

            {/* Nombre */}
            <Field label="Nombre del Producto" icon={<IcTag />}>
              <input
                name="nombre"
                value={form.nombre}
                required
                onChange={e => set('nombre', e.target.value)}
                placeholder="ej. Amortiguador Brembo"
                className={inputCls}
              />
            </Field>

            {/* Stock + Alerta */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stock Inicial" icon={<IcBox />}>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={e => set('stock', e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>
              <Field label="Stock Crítico" icon={<IcTrend />}>
                <input
                  name="stock_minimo_alerta"
                  type="number"
                  min="0"
                  value={form.stock_minimo_alerta}
                  onChange={e => set('stock_minimo_alerta', e.target.value)}
                  placeholder="5"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Categoría"
                icon={<IcGrid />}
                rightContent={
                  <button type="button" onClick={() => setModalCat(true)} className="text-[10px] text-[#135bec] font-bold hover:underline">+ Agregar</button>
                }
              >
                <select
                  name="id_categoria"
                  value={form.id_categoria}
                  onChange={e => set('id_categoria', e.target.value)}
                  className={`${inputCls} appearance-none`}
                >
                  {opciones.categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>)}
                </select>
              </Field>
              <Field
                label="Proveedor"
                icon={<IcGrid />}
                rightContent={
                  <button type="button" onClick={() => setModalProv(true)} className="text-[10px] text-[#135bec] font-bold hover:underline">+ Agregar</button>
                }
              >
                <select
                  name="id_proveedor"
                  value={form.id_proveedor}
                  onChange={e => set('id_proveedor', e.target.value)}
                  className={`${inputCls} appearance-none`}
                >
                  {opciones.proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre_empresa}</option>)}
                </select>
              </Field>
            </div>

            {/* Precios */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Precio Compra" icon={<IcCard />}>
                <input
                  name="precioCompra"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precioCompra}
                  onChange={e => set('precioCompra', e.target.value)}
                  placeholder="0.00"
                  className={inputCls}
                />
              </Field>
              <Field label="Precio Venta" icon={<IcCart />}>
                <input
                  name="precioVenta"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precioVenta}
                  onChange={e => set('precioVenta', e.target.value)}
                  placeholder="0.00"
                  className={`${inputCls} border-[#135bec]/20`}
                />
              </Field>
            </div>

            {/* Margen en tiempo real */}
            {margenPreview !== null && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${Number(margenPreview) >= 0
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                <IcTrend />
                Margen estimado: <span>{margenPreview}%</span>
              </div>
            )}

            {/* Botones */}
            <div className="mt-auto pt-3 flex flex-col gap-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-[#135bec] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                style={{ boxShadow: '0 6px 20px -4px rgba(19,91,236,0.4)' }}
              >
                {saving
                  ? (modoEdicion ? 'Actualizando...' : 'Guardando...')
                  : (modoEdicion ? 'Actualizar Producto' : 'Guardar Producto')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs transition-colors"
              >
                Cancelar y Volver
              </button>
            </div>

          </form>
        </div>
      </div>
      {modalCat && <ModalNuevaCategoria onClose={() => setModalCat(false)} onGuardar={handlerNuevaCat} />}
      {modalProv && <ModalNuevoProveedor onClose={() => setModalProv(false)} onGuardar={handlerNuevoProv} />}
      {notificacion && (
        <ModalNotificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}
    </div>
  );
};