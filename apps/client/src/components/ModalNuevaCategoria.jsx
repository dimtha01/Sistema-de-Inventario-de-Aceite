import { useState } from 'react';
import { X } from 'lucide-react';

export const ModalNuevaCategoria = ({ onClose, onGuardar, onNotificar }) => {
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
                if (onGuardar) onGuardar(json.data);
                onClose();
            }
            else {
                if (onNotificar) onNotificar('error', json.message || 'Error al crear categoría');
                else alert(json.message || 'Error al crear categoría');
            }
        } catch (error) {
            console.error(error);
            if (onNotificar) onNotificar('error', 'Error de conexión con el servidor');
            else alert('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="px-5 py-4 flex items-center justify-between border-b border-slate-200">
                    <h2 className="text-base font-bold text-slate-900">Nueva Categoría</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="px-5 py-5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">
                            Nombre de la Categoría
                        </label>
                        <input
                            required autoFocus type="text"
                            value={nombre} onChange={e => setNombre(e.target.value)}
                            placeholder="Ej. Sistema Eléctrico"
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] transition-all outline-none text-sm font-medium placeholder:text-slate-400"
                        />
                    </div>
                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors text-xs border border-slate-200">
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
