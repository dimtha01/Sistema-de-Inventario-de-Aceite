import { X, AlertCircle, AlertTriangle, Info, BellRing } from 'lucide-react';

const notificaciones = [
  {
    id: 1,
    tipo: 'critico',
    titulo: 'Alerta de Stock Crítico',
    tiempo: 'Ahora',
    mensaje: (
      <>
        <span className="font-bold">Stock Bajo:</span> Solo quedan 2 unidades de{' '}
        <span className="underline">Faro Laser Matrix</span>. Se requiere reabastecimiento urgente.
      </>
    ),
    accion: 'Generar pedido de compra',
  },
  {
    id: 2,
    tipo: 'advertencia',
    titulo: 'Aviso de Stock Bajo',
    tiempo: 'Hace 2h',
    mensaje: (
      <>
        El producto <span className="font-bold">Pastillas de Freno (PB-99)</span> ha llegado a su
        punto de reorden (8 unidades).
      </>
    ),
  },
  {
    id: 3,
    tipo: 'info',
    titulo: 'Pedido Recibido',
    tiempo: 'Hace 5h',
    mensaje: (
      <>
        Se ha confirmado la recepción de 100 unidades de{' '}
        <span className="font-bold">Bujía de Iridio</span>. Inventario actualizado.
      </>
    ),
  },
];

const TIPO_CONFIG = {
  critico: {
    wrapper:  'bg-red-50 border-l-4 border-red-500',
    icon:     <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />,
    titulo:   'text-red-800',
    tiempo:   'text-red-500',
    mensaje:  'text-red-700',
    accion:   'text-red-800 decoration-red-400',
  },
  advertencia: {
    wrapper:  'bg-amber-50 border-l-4 border-amber-500',
    icon:     <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />,
    titulo:   'text-amber-800',
    tiempo:   'text-amber-500',
    mensaje:  'text-amber-700',
  },
  info: {
    wrapper:  'bg-blue-50 border-l-4 border-[#135bec]',
    icon:     <Info size={18} className="text-[#135bec] flex-shrink-0 mt-0.5" />,
    titulo:   'text-slate-800',
    tiempo:   'text-slate-500',
    mensaje:  'text-slate-600',
  },
};

/**
 * @param {{ onClose: () => void }} props
 */
export const NotificacionesPanel = ({ onClose }) => (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
      onClick={onClose}
    />

    {/* Panel */}
    <aside className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 translate-x-0 transition-transform duration-300">

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing size={20} className="text-[#135bec]" />
          <h2 className="text-lg font-bold text-slate-900">Notificaciones</h2>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black">
            {notificaciones.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notificaciones.map((n) => {
          const cfg = TIPO_CONFIG[n.tipo];
          return (
            <div key={n.id} className={`${cfg.wrapper} p-4 rounded-r-xl shadow-sm`}>
              <div className="flex gap-3">
                {cfg.icon}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className={`text-sm font-bold leading-snug ${cfg.titulo}`}>
                      {n.titulo}
                    </h4>
                    <span className={`text-[10px] font-black uppercase flex-shrink-0 ${cfg.tiempo}`}>
                      {n.tiempo}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${cfg.mensaje}`}>
                    {n.mensaje}
                  </p>
                  {n.accion && (
                    <button className={`mt-3 text-xs font-bold underline ${cfg.accion}`}>
                      {n.accion}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
        <button className="w-full py-2.5 text-sm font-bold text-slate-500 hover:text-[#135bec] transition-colors flex items-center justify-center gap-2">
          Marcar todas como leídas
        </button>
      </div>
    </aside>
  </>
);
