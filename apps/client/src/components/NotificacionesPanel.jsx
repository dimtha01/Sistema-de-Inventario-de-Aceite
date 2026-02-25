import { X, AlertCircle, AlertTriangle, Info, BellRing, CheckCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const TIPO_CONFIG = {
  critico: {
    dot:     'bg-red-500',
    icon:    <AlertCircle  size={15} className="text-red-600"   />,
    iconBg:  'bg-red-100',
    titulo:  'text-slate-900',
    mensaje: 'text-slate-500',
    tiempo:  'text-red-500',
    accion:  'text-red-600 hover:text-red-700',
    border:  'border-red-100',
  },
  advertencia: {
    dot:     'bg-amber-500',
    icon:    <AlertTriangle size={15} className="text-amber-600" />,
    iconBg:  'bg-amber-100',
    titulo:  'text-slate-900',
    mensaje: 'text-slate-500',
    tiempo:  'text-amber-500',
    accion:  'text-amber-700 hover:text-amber-800',
    border:  'border-amber-100',
  },
  info: {
    dot:     'bg-[#135bec]',
    icon:    <Info size={15} className="text-[#135bec]"          />,
    iconBg:  'bg-[#135bec]/10',
    titulo:  'text-slate-900',
    mensaje: 'text-slate-500',
    tiempo:  'text-slate-400',
    accion:  'text-[#135bec] hover:text-[#1048bc]',
    border:  'border-slate-100',
  },
};

export const NotificacionesPanel = ({ onClose, alerts = [], onMarkRead }) => (
  <>
    {/* Overlay invisible — cierra al hacer clic fuera */}
    <div className="fixed inset-0 z-40" onClick={onClose} />

    {/* Panel dropdown */}
    <aside className="fixed top-[57px] right-3 sm:right-6 z-50 w-[340px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      style={{ maxHeight: 'calc(100vh - 80px)' }}
    >

      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <BellRing size={15} className="text-[#135bec]" />
          <h2 className="text-sm font-black text-slate-900 tracking-tight">Notificaciones</h2>
          {alerts.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black leading-none">
              {alerts.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Lista */}
      <div className="overflow-y-auto flex-1">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <BellRing size={16} className="text-slate-400" />
            </div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Todo al día</p>
            <p className="text-[10px] text-slate-400">No tienes notificaciones nuevas</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {alerts.map((n) => {
              const cfg = TIPO_CONFIG[n.tipo] || TIPO_CONFIG.info;
              return (
                <li
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
                >
                  {/* Icono circular */}
                  <div className={`w-8 h-8 rounded-full ${cfg.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {cfg.icon}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-black leading-snug ${cfg.titulo}`}>
                      {n.titulo}
                    </p>
                    <p className={`text-[10px] leading-relaxed mt-0.5 line-clamp-2 ${cfg.mensaje}`}>
                      {n.mensaje}
                    </p>
                    <div className="flex items-center justify-between mt-1.5 gap-2">
                      {n.accion ? (
                        <NavLink
                          to="/inventario"
                          onClick={onClose}
                          className={`text-[10px] font-black uppercase tracking-wide ${cfg.accion} transition-colors`}
                        >
                          {n.accion} →
                        </NavLink>
                      ) : <span />}
                      <span className={`text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${cfg.tiempo}`}>
                        {n.tiempo}
                      </span>
                    </div>
                  </div>

                  {/* Dot indicador activo */}
                  <div className={`w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0 mt-1.5`} />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex-shrink-0">
          <button
            onClick={onMarkRead}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#135bec] transition-colors rounded-lg hover:bg-white"
          >
            <CheckCheck size={12} />
            Marcar todas como leídas
          </button>
        </div>
      )}
    </aside>
  </>
);