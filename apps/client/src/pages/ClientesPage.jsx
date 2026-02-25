import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Users, Building2, Calendar, CreditCard, X, History, Phone } from 'lucide-react';
import { ModalNuevoCliente } from '../components/ModalNuevoCliente';

const TABS = [
  { key: 'todos',     label: 'Todos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'aldia',     label: 'Al Día' },
];

const ESTADO_CONFIG = {
  pendiente: {
    badge:  'bg-red-100 text-red-700 border border-red-300',
    label:  'Pendiente',
    avatar: 'bg-red-100 text-red-700',
    saldo:  'text-red-600',
  },
  aldia: {
    badge:  'bg-emerald-100 text-emerald-700 border border-emerald-300',
    label:  'Al día',
    avatar: 'bg-emerald-100 text-emerald-700',
    saldo:  'text-slate-900',
  },
};

const EstadoBadge = ({ estado }) => {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.aldia;
  return (
    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-widest ${cfg.badge}`}>
      {cfg.label}
    </span>
  );
};

const Avatar = ({ iniciales, estado }) => {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.aldia;
  return (
    <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${cfg.avatar}`}>
      {iniciales}
    </div>
  );
};

const getIniciales = (nombre = '') =>
  nombre.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');

// ── Modal Historial de Compras ────────────────────────────
const ModalHistorial = ({ cliente, onClose, onAbonar }) => {
  const [abonoVentaId, setAbonoVentaId] = useState(null);
  const [montoAbono, setMontoAbono]     = useState('');
  const [loadingAbono, setLoadingAbono] = useState(false);

  const handleRegistrarAbono = async (e) => {
    e.preventDefault();
    if (!montoAbono || montoAbono <= 0) return alert('Monto inválido');
    setLoadingAbono(true);
    await onAbonar(abonoVentaId, Number(montoAbono));
    setLoadingAbono(false);
    setAbonoVentaId(null);
    setMontoAbono('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <History size={15} className="text-[#135bec]" />
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">Historial de Compras</h2>
              <p className="text-[10px] text-slate-500 font-semibold">{cliente.nombre}</p>
            </div>
          </div>
          <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Resumen rápido */}
        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-200">
          <div className="bg-slate-100 rounded-lg p-2 text-center border border-slate-200">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Ventas</span>
            <span className="text-sm font-black text-slate-900">{cliente.ventas?.length ?? 0}</span>
          </div>
          <div className="bg-slate-100 rounded-lg p-2 text-center border border-slate-200">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Total</span>
            <span className="text-sm font-black text-slate-900">
              ${(cliente.ventas?.reduce((s, v) => s + (v.monto || 0), 0) ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className={`rounded-lg p-2 text-center border ${cliente.saldo > 0 ? 'bg-red-100 border-red-200' : 'bg-emerald-100 border-emerald-200'}`}>
            <span className={`text-[8px] font-black uppercase tracking-widest block mb-0.5 ${cliente.saldo > 0 ? 'text-red-600' : 'text-emerald-600'}`}>Saldo</span>
            <span className={`text-sm font-black ${cliente.saldo > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
              ${(cliente.saldo ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Lista de ventas */}
        <div className="overflow-y-auto flex-1 px-5 py-3 flex flex-col gap-3">
          {(!cliente.ventas || cliente.ventas.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <History size={22} className="text-slate-300" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sin compras registradas</p>
            </div>
          ) : (
            cliente.ventas.map(v => (
              <div key={v.id_venta} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2">

                {/* Cabecera venta */}
                <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Calendar size={11} className="text-[#135bec]" />
                    {v.fecha}
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-black tracking-widest text-[#135bec] block">Total</span>
                    <span className="text-sm font-black text-slate-900 leading-none">
                      ${(v.monto || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Productos */}
                <div className="flex flex-col gap-1 px-1">
                  {v.detalles.map((d, i) => (
                    <div key={i} className="flex justify-between items-start text-[10px] border-b border-slate-200 last:border-0 pb-1 last:pb-0">
                      <span className="text-slate-600 font-medium truncate pr-2" title={d.producto}>
                        <span className="font-black text-slate-500 mr-1">{d.cantidad}×</span>{d.producto}
                      </span>
                      <span className="text-slate-900 font-bold whitespace-nowrap">
                        ${(d.precio || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Abonos / estado */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[9px] font-bold text-slate-500">
                    Abonado: <strong className="text-slate-700">
                      ${(v.abonado || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </strong>
                  </span>
                  <span className={`text-[9px] font-black uppercase ${v.saldo_restante > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    Resta: ${(v.saldo_restante || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Abonar */}
                {v.estado.toLowerCase() === 'pendiente' ? (
                  abonoVentaId === v.id_venta ? (
                    <form onSubmit={handleRegistrarAbono} className="flex gap-2">
                      <input
                        type="number" step="0.01" max={v.saldo_restante}
                        value={montoAbono} onChange={e => setMontoAbono(e.target.value)}
                        placeholder="Monto..." autoFocus
                        className="flex-1 bg-white border border-slate-300 rounded-lg text-xs px-2 py-1.5 outline-none focus:border-[#135bec]"
                      />
                      <button type="submit" disabled={loadingAbono}
                        className="bg-[#135bec] hover:bg-[#1048bc] text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all">
                        {loadingAbono ? '...' : 'Pagar'}
                      </button>
                      <button type="button" onClick={() => setAbonoVentaId(null)}
                        className="bg-slate-200 text-slate-700 text-[9px] font-black px-2.5 py-1.5 rounded-lg hover:bg-slate-300">
                        ✕
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => { setAbonoVentaId(v.id_venta); setMontoAbono(v.saldo_restante); }}
                      className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-1.5 rounded-lg text-[9px] hover:bg-slate-50 transition-colors uppercase tracking-widest flex items-center justify-center gap-1"
                    >
                      <CreditCard size={11} /> Abonar a esta venta
                    </button>
                  )
                ) : (
                  <div className="py-1 rounded text-[8px] font-black text-center uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Totalmente Pagado
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ── Sidebar info del cliente ──────────────────────────────
const ClienteContent = ({ clienteSel, onVerHistorial }) => {
  if (!clienteSel) return (
    <div className="flex-1 flex flex-col items-center justify-center p-5 text-center gap-2 py-8">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
        <Users className="w-5 h-5 text-slate-400" />
      </div>
      <p className="text-[11px] font-semibold text-slate-500">Selecciona un cliente</p>
      <p className="text-[10px] text-slate-400 max-w-[180px] leading-relaxed">
        Haz clic en cualquier cliente para ver su perfil
      </p>
    </div>
  );

  return (
    <div className="p-4 flex flex-col gap-3.5">
      {/* Perfil */}
      <div className="flex flex-col items-center text-center gap-2">
        <Avatar iniciales={clienteSel.iniciales} estado={clienteSel.estado} />
        <div>
          <EstadoBadge estado={clienteSel.estado} />
          <h3 className="text-base font-black text-slate-900 mt-1.5 mb-0.5 leading-tight">{clienteSel.nombre}</h3>
          <p className="text-[10px] font-semibold text-slate-500 flex items-center justify-center gap-1">
            <Building2 size={11} /> {clienteSel.tipo || '—'}
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Saldo</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-[9px] text-slate-500 font-medium">$</span>
            <span className={`text-lg font-black tracking-tighter leading-tight ${ESTADO_CONFIG[clienteSel.estado]?.saldo || 'text-slate-900'}`}>
              {(clienteSel.saldo ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        <div className="bg-[#135bec]/10 p-2.5 rounded-xl border border-[#135bec]/20">
          <span className="text-[8px] font-bold text-[#135bec] uppercase tracking-wider block mb-0.5">Últ. Compra</span>
          <div className="flex items-center gap-1 mt-1">
            <Calendar size={12} className="text-[#135bec]" />
            <span className="text-xs font-bold text-[#135bec]">{clienteSel.ultimaCompra || 'Sin compras'}</span>
          </div>
        </div>
      </div>

      {/* Contacto — teléfono (sin icono ubicación) */}
      <div className="flex items-center gap-2.5 bg-white border border-slate-200 p-2.5 rounded-xl">
        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <Phone size={12} />
        </div>
        <div>
          <p className="text-[9px] text-slate-500 uppercase tracking-wide font-bold">Teléfono</p>
          <p className="text-[11px] font-semibold text-slate-800">{clienteSel.telefono || '—'}</p>
        </div>
      </div>

      {/* Botón historial */}
      <button
        onClick={() => onVerHistorial(clienteSel)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#135bec]/10 border border-[#135bec]/30 text-[#135bec] font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#135bec]/20 transition-colors"
      >
        <History size={13} />
        Ver Historial de Compras
        {clienteSel.ventas?.some(v => v.estado.toLowerCase() === 'pendiente') && (
          <span className="ml-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
            {clienteSel.ventas.filter(v => v.estado.toLowerCase() === 'pendiente').length}
          </span>
        )}
      </button>
    </div>
  );
};

// ── Página principal ──────────────────────────────────────
export const ClientesPage = () => {
  const [clientes, setClientes]         = useState([]);
  const [tabActiva, setTabActiva]       = useState('todos');
  const [busqueda, setBusqueda]         = useState('');
  const [clienteSel, setClienteSel]     = useState(null);
  const [showModal, setShowModal]       = useState(false);
  const [showHistorial, setShowHistorial]       = useState(false);
  const [clienteHistorial, setClienteHistorial] = useState(null);
  const [loading, setLoading]           = useState(true);

  const fetchClientes = () => {
    setLoading(true);
    fetch('/api/clientes')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          const formatted = res.data.map(c => ({
            ...c,
            iniciales: getIniciales(`${c.nombre} ${c.apellido || ''}`)
          }));
          setClientes(formatted);
          if (clienteSel) {
            const updated = formatted.find(c => c.id === clienteSel.id);
            if (updated) setClienteSel(updated);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClientes(); }, []);

  const handleAbonar = async (id_venta, monto) => {
    try {
      const resp = await fetch('/api/clientes/abono', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_venta, monto })
      });
      const data = await resp.json();
      if (resp.ok && data.success) { alert('Abono registrado con éxito'); fetchClientes(); }
      else alert(data.message || 'Error al abonar');
    } catch (e) { console.error(e); alert('Error de conexión o fallo del servidor'); }
  };

  const handleGuardar = (nuevoCliente) => {
    const clienteFormateado = {
      ...nuevoCliente,
      saldo:        nuevoCliente.saldo        ?? 0,
      ultimaCompra: nuevoCliente.ultimaCompra ?? '—',
      estado:       nuevoCliente.estado       ?? 'aldia',
      iniciales:    nuevoCliente.iniciales    ?? getIniciales(nuevoCliente.nombre),
    };
    setClientes(prev => [clienteFormateado, ...prev]);
    setClienteSel(clienteFormateado);
  };

  const handleVerHistorial = (cliente) => {
    setClienteHistorial(cliente);
    setShowHistorial(true);
  };

  const clientesFiltrados = useMemo(() => {
    let lista = clientes;
    if (tabActiva !== 'todos') lista = lista.filter(c => c.estado === tabActiva);
    if (busqueda) {
      const b = busqueda.toLowerCase();
      lista = lista.filter(c => c.nombre.toLowerCase().includes(b));
    }
    return lista;
  }, [clientes, tabActiva, busqueda]);

  return (
    <>
      {showModal && (
        <ModalNuevoCliente onClose={() => setShowModal(false)} onGuardar={handleGuardar} />
      )}

      {showHistorial && clienteHistorial && (
        <ModalHistorial
          cliente={clienteHistorial}
          onClose={() => { setShowHistorial(false); setClienteHistorial(null); }}
          onAbonar={handleAbonar}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-4 items-start p-3 lg:p-5 max-w-7xl mx-auto w-full">

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col gap-4 w-full">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                Directorio de Clientes
              </h1>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                {clientes.length} clientes registrados en total.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex justify-center items-center gap-1.5 bg-[#135bec] hover:bg-[#1048bc] text-white px-4 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md shadow-[#135bec]/25 uppercase tracking-widest"
            >
              <Plus size={13} strokeWidth={3} />
              Nuevo Cliente
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex bg-slate-100 p-0.5 rounded-lg w-full lg:w-auto overflow-x-auto">
              {TABS.map(tab => {
                const count = tab.key === 'todos'
                  ? clientes.length
                  : clientes.filter(c => c.estado === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setTabActiva(tab.key)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      tabActiva === tab.key
                        ? 'bg-white text-[#135bec] shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                    <span className={`px-1 py-0.5 rounded text-[8px] ${
                      tabActiva === tab.key
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
                type="text" placeholder="Buscar cliente..."
                value={busqueda} onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border-2 border-transparent focus:border-[#135bec] rounded-lg text-[11px] font-medium outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Lista */}
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500 text-xs font-bold">
              Cargando clientes...
            </div>
          ) : clientesFiltrados.length > 0 ? (
            <div className="flex flex-col gap-2">
              {clientesFiltrados.map(cliente => {
                const cfg = ESTADO_CONFIG[cliente.estado] || ESTADO_CONFIG.aldia;
                const isSelected = clienteSel?.id === cliente.id;
                return (
                  <div
                    key={cliente.id}
                    onClick={() => setClienteSel(cliente)}
                    className={`group relative bg-white rounded-xl p-3 transition-all duration-200 cursor-pointer border-2 ${
                      isSelected
                        ? 'border-[#135bec] shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    } flex items-center gap-3`}
                  >
                    <Avatar iniciales={cliente.iniciales} estado={cliente.estado} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-bold text-xs text-slate-900 truncate group-hover:text-[#135bec] transition-colors">
                          {cliente.nombre}
                        </h3>
                        <EstadoBadge estado={cliente.estado} />
                      </div>
                      {/* Teléfono en lugar de ubicación */}
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <Phone size={10} />
                        <span>{cliente.telefono || '—'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Saldo</span>
                      <span className={`text-xs font-black tracking-tighter ${cfg.saldo}`}>
                        ${(cliente.saldo ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[9px] font-medium text-slate-500">
                        {cliente.ultimaCompra || '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-slate-200 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 border border-slate-200">
                <Users size={18} className="text-slate-400" />
              </div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">No hay resultados</h3>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">Intenta con otros términos.</p>
            </div>
          )}
        </div>

        {/* ── Sidebar Desktop ── */}
        <aside className="w-full lg:w-[280px] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden sticky top-20 flex-shrink-0 hidden lg:flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-[9px] text-[#135bec] uppercase tracking-[0.2em]">Info del Cliente</h2>
            {clienteSel && (
              <button onClick={() => setClienteSel(null)} className="text-slate-500 hover:text-slate-700 transition-colors p-0.5">
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <ClienteContent clienteSel={clienteSel} onVerHistorial={handleVerHistorial} />
        </aside>

        {/* ── Drawer Móvil ── */}
        {clienteSel && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setClienteSel(null)} />
            <div className="relative w-72 max-w-full bg-white h-full shadow-2xl flex flex-col">
              <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="font-bold text-[9px] text-[#135bec] uppercase tracking-[0.2em]">Info del Cliente</h2>
                <button onClick={() => setClienteSel(null)} className="text-slate-500 p-0.5"><X size={13} /></button>
              </div>
              <div className="overflow-y-auto flex-1 pb-8">
                <ClienteContent clienteSel={clienteSel} onVerHistorial={handleVerHistorial} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};