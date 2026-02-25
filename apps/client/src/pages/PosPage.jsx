import { useState, useMemo, useEffect } from 'react';
import {
    Search, ShoppingCart, User, Plus, Minus, Trash2,
    ArrowRight, RotateCcw, CheckCircle2, AlertCircle, X
} from 'lucide-react';

const fmt = (n) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const IVA = 0.16;

// ── Modal Notificación ────────────────────────────────────
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

// ── Tarjeta de producto ───────────────────────────────────
const ProductoCard = ({ producto, onAgregar }) => (
    <div
        className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-[#135bec]/60 transition-all cursor-pointer shadow-sm hover:shadow-lg relative flex flex-col"
        onClick={() => onAgregar(producto)}
    >
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold border border-slate-300 z-10 text-slate-700">
            Stock: {producto.stock}
        </div>
        <div className="aspect-square bg-slate-100 flex items-center justify-center p-5 relative">
            {producto.imagen ? (
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xs group-hover:scale-110 transition-transform duration-500">
                    Sin Imagen
                </div>
            )}
        </div>
        <div className="p-3 space-y-0.5 flex-1 flex flex-col justify-end border-t border-slate-200">
            <p className="text-[9px] font-bold text-[#135bec] uppercase tracking-tighter truncate">
                {producto.categoria}
            </p>
            <h4 className="text-xs font-semibold line-clamp-2 leading-tight min-h-[2rem] text-slate-800">
                {producto.nombre}
            </h4>
            <p className="text-sm font-semibold pt-0.5 text-slate-900">${fmt(producto.precioVenta)}</p>
        </div>
    </div>
);

// ── Item del carrito ──────────────────────────────────────
const CartItem = ({ item, onIncrement, onDecrement }) => (
    <div className="flex items-center gap-2.5 bg-slate-100 rounded-lg border border-slate-200 hover:border-slate-300 transition-all p-1.5">
        <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center p-1 flex-shrink-0 border border-slate-200">
            {item.imagen ? (
                <img src={item.imagen} alt={item.nombre} className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
                <div className="text-[7px] font-bold uppercase text-slate-400 text-center">N/A</div>
            )}
        </div>

        <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold truncate leading-tight text-slate-900">{item.nombre}</h5>
            <p className="text-[9px] font-bold text-slate-500 truncate">{item.categoria}</p>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <p className="text-xs font-bold text-[#135bec]">${fmt(item.precioVenta * item.cantidad)}</p>
            <div className="flex items-center gap-1">
                <button
                    onClick={(e) => { e.stopPropagation(); onDecrement(item.id_producto); }}
                    className="w-4 h-4 rounded-full bg-slate-300 hover:bg-slate-400 flex items-center justify-center transition-colors"
                >
                    {item.cantidad === 1
                        ? <Trash2 size={8} className="text-rose-600" />
                        : <Minus size={8} className="text-slate-700" />
                    }
                </button>
                <span className="text-[10px] font-black w-3.5 text-center text-slate-900">{item.cantidad}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onIncrement(item.id_producto); }}
                    className="w-4 h-4 rounded-full bg-slate-300 hover:bg-slate-400 flex items-center justify-center transition-colors"
                >
                    <Plus size={8} className="text-slate-700" />
                </button>
            </div>
        </div>
    </div>
);

// ── Página POS ────────────────────────────────────────────
export const PosPage = () => {
    const [busqueda, setBusqueda] = useState('');
    const [carrito, setCarrito] = useState([]);
    const [productosData, setProductosData] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [estadosPago, setEstadosPago] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [clienteBusqueda, setClienteBusqueda] = useState('');
    const [mostrarClientes, setMostrarClientes] = useState(false);
    const [estadoPagoSeleccionado, setEstadoPagoSeleccionado] = useState('');
    const [abonoInicial, setAbonoInicial] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const [loadingVenta, setLoadingVenta] = useState(false);
    const [notificacion, setNotificacion] = useState(null);

    const notificar = (tipo, mensaje) => setNotificacion({ tipo, mensaje });

    useEffect(() => {
        fetch('/api/pos/data')
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    setProductosData(res.data.productos);
                    setClientes(res.data.clientes);
                    setEstadosPago(res.data.estadosPago);
                    if (res.data.estadosPago.length > 0) setEstadoPagoSeleccionado(res.data.estadosPago[2].id_estado_pago);
                }
            })
            .catch(() => notificar('error', 'No se pudo cargar el catálogo'))
            .finally(() => setLoadingData(false));
    }, []);

    const productosFiltrados = useMemo(() => {
        if (!busqueda) return productosData;
        const b = busqueda.toLowerCase();
        return productosData.filter(p =>
            p.nombre.toLowerCase().includes(b) ||
            p.categoria.toLowerCase().includes(b) ||
            p.id_producto.toString().includes(b)
        );
    }, [busqueda, productosData]);

    const agregarAlCarrito = (producto) => {
        if (!clienteSeleccionado) {
            notificar('error', 'Debes seleccionar un cliente antes de agregar productos al carrito.');
            return;
        }

        setCarrito(prev => {
            const existe = prev.find(i => i.id_producto === producto.id_producto);
            if (existe) {
                if (existe.cantidad >= producto.stock) {
                    notificar('error', `Solo hay ${producto.stock} unidades disponibles.`);
                    return prev;
                }
                return prev.map(i => i.id_producto === producto.id_producto ? { ...i, cantidad: i.cantidad + 1 } : i);
            }
            if (producto.stock <= 0) {
                notificar('error', `No hay stock disponible para ${producto.nombre}`);
                return prev;
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const incrementar = (id_producto) =>
        setCarrito(prev => {
            const itemToInc = prev.find(i => i.id_producto === id_producto);
            const productRef = productosData.find(p => p.id_producto === id_producto);
            if (itemToInc && productRef && itemToInc.cantidad >= productRef.stock) {
                notificar('error', `Solo hay ${productRef.stock} unidades disponibles.`);
                return prev;
            }
            return prev.map(i => i.id_producto === id_producto ? { ...i, cantidad: i.cantidad + 1 } : i);
        });

    const decrementar = (id_producto) =>
        setCarrito(prev => {
            const item = prev.find(i => i.id_producto === id_producto);
            if (item && item.cantidad === 1) return prev.filter(i => i.id_producto !== id_producto);
            return prev.map(i => i.id_producto === id_producto ? { ...i, cantidad: i.cantidad - 1 } : i);
        });

    const limpiarCarrito = () => { setCarrito([]); setAbonoInicial(''); };

    const generarVenta = async () => {
        if (carrito.length === 0) return notificar('error', 'El carrito está vacío.');
        if (!clienteSeleccionado) return notificar('error', 'Seleccione un cliente.');

        const esPendiente = estadosPago
            .find(e => e.id_estado_pago === Number(estadoPagoSeleccionado))
            ?.nombre_estado.toLowerCase() === 'pendiente';
        const abonoAEnviar = esPendiente && abonoInicial ? Number(abonoInicial) : 0;

        const mpUser = JSON.parse(localStorage.getItem('mp_user') || '{}');
        const id_usuario = mpUser.id_usuario || 1;

        setLoadingVenta(true);
        try {
            const res = await fetch('/api/pos/venta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_cliente: clienteSeleccionado,
                    id_usuario: id_usuario,
                    id_estado_pago: estadoPagoSeleccionado,
                    abono_inicial: abonoAEnviar,
                    productos: carrito.map(item => ({ id_producto: item.id_producto, cantidad: item.cantidad }))
                })
            });
            const data = await res.json();
            if (data.success) {
                notificar('exito', '¡Venta generada exitosamente!');
                limpiarCarrito();
                setProductosData(productosData.map(p => {
                    const comprado = carrito.find(c => c.id_producto === p.id_producto);
                    return comprado ? { ...p, stock: p.stock - comprado.cantidad } : p;
                }));
            } else {
                notificar('error', data.message || 'Error procesando la venta.');
            }
        } catch (error) {
            console.error('Error al cobrar', error);
            notificar('error', 'Ocurrió un error al procesar la venta.');
        } finally {
            setLoadingVenta(false);
        }
    };

    const totalItems = carrito.reduce((s, i) => s + i.cantidad, 0);
    const subtotal = carrito.reduce((s, i) => s + i.precioVenta * i.cantidad, 0);
    const iva = subtotal * IVA;
    const total = subtotal + iva;

    const esPendiente = estadosPago
        .find(e => e.id_estado_pago === Number(estadoPagoSeleccionado))
        ?.nombre_estado.toLowerCase() === 'pendiente';

    return (
        <div className="flex h-[calc(100vh-57px)] overflow-hidden bg-slate-50">

            {notificacion && (
                <ModalNotificacion
                    tipo={notificacion.tipo}
                    mensaje={notificacion.mensaje}
                    onClose={() => setNotificacion(null)}
                />
            )}

            {/* ── Panel izquierdo: galería (sin scroll propio) ── */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 z-0">
                <div className="max-w-4xl mx-auto space-y-5">

                    {/* Buscador */}
                    <div className="text-center space-y-3 pt-2">
                        <h1 className="text-xl font-bold text-slate-700 tracking-tight">
                            Gestión de Ventas
                        </h1>
                        <div className="relative group max-w-2xl mx-auto">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search size={16} className="text-slate-400 group-focus-within:text-[#135bec] transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                placeholder="Buscar repuesto en el catálogo..."
                                className="w-full h-11 pl-10 pr-5 text-sm bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] placeholder:text-slate-400 transition-all font-medium outline-none"
                            />
                        </div>
                    </div>

                    {/* Grid de productos */}
                    <div className="pb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                                Inventario Disponible ({productosFiltrados.length})
                            </h3>
                        </div>

                        {loadingData ? (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-sm font-bold">
                                Cargando catálogo...
                            </div>
                        ) : productosFiltrados.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {productosFiltrados.map(p => (
                                    <ProductoCard key={p.id_producto} producto={p} onAgregar={agregarAlCarrito} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-slate-300 text-center">
                                <Search size={22} className="text-slate-400 mb-2" />
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sin resultados</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Intenta con otro término</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ── Panel derecho: carrito ── */}
            <aside className="w-[320px] xl:w-[360px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-10 flex-shrink-0">

                {/* Header carrito */}
                <div className="p-4 border-b border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-1.5">
                            <ShoppingCart size={15} className="text-slate-700" />
                            <h2 className="text-sm font-bold text-slate-900">Ticket de Venta</h2>
                        </div>
                        {totalItems > 0 && (
                            <span className="bg-[#135bec]/10 text-[#135bec] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border border-[#135bec]/20">
                                {totalItems} {totalItems === 1 ? 'Art.' : 'Arts.'}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        {/* Cliente */}
                        <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-200">
                            <User size={13} className="text-slate-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-0.5">Cliente</p>
                                <div className="relative w-full z-50">
                                    {clienteSeleccionado ? (
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-900 border border-slate-200 bg-white rounded px-2 py-1">
                                            <span className="truncate">
                                                {(() => {
                                                    const c = clientes.find(c => c.id_cliente === Number(clienteSeleccionado));
                                                    return c ? `${c.nombre} ${c.apellido || ''}` : 'Desconocido';
                                                })()}
                                            </span>
                                            <button
                                                onClick={() => { setClienteSeleccionado(''); setClienteBusqueda(''); }}
                                                className="text-slate-400 hover:text-rose-500 ml-1 rounded p-0.5"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            {mostrarClientes && (
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setMostrarClientes(false)}
                                                />
                                            )}
                                            <input
                                                type="text"
                                                placeholder="Buscar cliente..."
                                                value={clienteBusqueda}
                                                onChange={e => {
                                                    setClienteBusqueda(e.target.value);
                                                    setMostrarClientes(true);
                                                }}
                                                onFocus={() => setMostrarClientes(true)}
                                                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-900 outline-none focus:border-[#135bec] transition-all placeholder:text-slate-400 relative z-50"
                                            />
                                            {mostrarClientes && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-y-auto max-h-48 z-50 flex flex-col">
                                                    {clientes.filter(c => `${c.nombre} ${c.apellido || ''}`.toLowerCase().includes(clienteBusqueda.toLowerCase())).length === 0 ? (
                                                        <div className="p-3 text-center text-[10px] text-slate-500 font-bold uppercase">No se encontraron clientes</div>
                                                    ) : (
                                                        clientes
                                                            .filter(c => `${c.nombre} ${c.apellido || ''}`.toLowerCase().includes(clienteBusqueda.toLowerCase()))
                                                            .map(c => (
                                                                <div
                                                                    key={c.id_cliente}
                                                                    onClick={() => {
                                                                        setClienteSeleccionado(c.id_cliente);
                                                                        setMostrarClientes(false);
                                                                        setClienteBusqueda('');
                                                                    }}
                                                                    className="px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 hover:text-[#135bec] border-b border-slate-100 last:border-0 transition-colors"
                                                                >
                                                                    {c.nombre} {c.apellido}
                                                                </div>
                                                            ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Estado de pago */}
                        <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-200">
                            <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-0.5">Estado de Pago</p>
                                <select
                                    value={estadoPagoSeleccionado}
                                    onChange={e => { setEstadoPagoSeleccionado(e.target.value); setAbonoInicial(''); }}
                                    className="w-full bg-transparent text-xs font-semibold text-emerald-700 outline-none cursor-pointer truncate uppercase"
                                >
                                    {estadosPago.map(est => (
                                        <option key={est.id_estado_pago} value={est.id_estado_pago} className="text-slate-900 normal-case">
                                            {est.nombre_estado}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Abono inicial (solo si pendiente) */}
                        {esPendiente && (
                            <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200">
                                <p className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-1">Abono Inicial (Opcional)</p>
                                <div className="relative">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">$</span>
                                    <input
                                        type="number" min="0" step="0.01" placeholder="0.00"
                                        value={abonoInicial} onChange={e => setAbonoInicial(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-900 outline-none pl-6 pr-2 py-1.5 focus:border-[#135bec] transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-3">
                    {carrito.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-8">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                <ShoppingCart size={16} className="text-slate-400" />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Carrito vacío</p>
                            <p className="text-[10px] text-slate-400 max-w-[140px] leading-relaxed">
                                Añade productos del inventario
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {carrito.map(item => (
                                <CartItem
                                    key={item.id_producto}
                                    item={item}
                                    onIncrement={incrementar}
                                    onDecrement={decrementar}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer checkout */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">

                    {/* Totales */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-600 font-semibold px-0.5">
                            <span>Subtotal</span>
                            <span>${fmt(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600 font-semibold px-0.5">
                            <span>IVA (16%)</span>
                            <span>${fmt(iva)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-black pt-2.5 border-t border-slate-300">
                            <span className="text-slate-900">Total</span>
                            <span className="text-[#135bec] tracking-tighter">${fmt(total)}</span>
                        </div>
                    </div>

                    {/* Botón principal */}
                    <button
                        disabled={carrito.length === 0 || loadingVenta}
                        onClick={generarVenta}
                        className="w-full bg-[#135bec] hover:bg-[#1048bc] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#135bec]/25 transition-all active:scale-95"
                    >
                        <span className="text-xs uppercase tracking-[0.15em]">
                            {loadingVenta ? 'Procesando...' : 'Generar Venta'}
                        </span>
                        {!loadingVenta && <ArrowRight size={15} />}
                    </button>

                    {/* Limpiar */}
                    <button
                        onClick={limpiarCarrito}
                        disabled={carrito.length === 0}
                        className="w-full flex items-center justify-center gap-1 bg-white border border-rose-200 text-[10px] font-bold py-2.5 rounded-lg uppercase tracking-wider text-rose-600 hover:bg-rose-50 hover:border-rose-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <RotateCcw size={12} />
                        Limpiar Carrito
                    </button>
                </div>
            </aside>
        </div>
    );
};