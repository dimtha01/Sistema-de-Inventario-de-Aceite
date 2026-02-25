import { X, AlertCircle, AlertTriangle, Info, BellRing } from 'lucide-react';

// Alerts will be passed as props

const TIPO_CONFIG = {
  critico: {
    wrapper: 'bg-red-50 border-l-4 border-red-500',
    icon: <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />,
    titulo: 'text-red-800',
    tiempo: 'text-red-500',
    mensaje: 'text-red-700',
    accion: 'text-red-800 decoration-red-400',
  },
  advertencia: {
    wrapper: 'bg-amber-50 border-l-4 border-amber-500',
    icon: <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />,
    titulo: 'text-amber-800',
    tiempo: 'text-amber-500',
    mensaje: 'text-amber-700',
  },
  info: {
    wrapper: 'bg-blue-50 border-l-4 border-[#135bec]',
    icon: <Info size={18} className="text-[#135bec] flex-shrink-0 mt-0.5" />,
    titulo: 'text-slate-800',
    tiempo: 'text-slate-500',
    mensaje: 'text-slate-600',
  },
};

import { NavLink } from 'react-router-dom';

/**
 * @param {{ onClose: () => void, alerts: any[] }} props
 */
export const NotificacionesPanel = ({ onClose, alerts = [] }) => (
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
          {alerts.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black">
              {alerts.length}
            </span>
          )}
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
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 gap-2">
            <BellRing size={24} className="opacity-20" />
            <p className="text-xs font-medium">No hay notificaciones nuevas</p>
          </div>
        ) : alerts.map((n) => {
          const cfg = TIPO_CONFIG[n.tipo] || TIPO_CONFIG.info;
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
                    <NavLink to="/inventario" onClick={onClose} className={`mt-3 inline-block text-xs font-bold underline ${cfg.accion}`}>
                      {n.accion}
                    </NavLink>
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
