import { useState } from 'react';
import { X, MapPin, Phone, Building2 } from 'lucide-react';

const formInicial = { nombre_empresa: '', direccion: '', telefono: '' };

export const ModalNuevoProveedor = ({ onClose, onGuardar, onNotificar }) => {
    const [form, setForm] = useState(formInicial);
    const [loading, setLoading] = useState(false);
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nombre_empresa.trim()) return;
        setLoading(true);
        try {
            const resp = await fetch('/api/providers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const json = await resp.json();
            if (json.success) {
                if (onGuardar) onGuardar(json.data);
                onClose();
            }
            else {
                if (onNotificar) onNotificar('error', json.message || 'Error al crear proveedor');
                else alert(json.message || 'Error al crear proveedor');
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" onClick={onClose}>
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#135bec]/10 text-[#135bec]">
                            <Building2 size={15} />
                        </div>
                        <div>
                            <h2 className="text-[11px] font-extrabold tracking-widest text-slate-900 uppercase">AutoPart Pro</h2>
                            <p className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">Sistema de Gestión Premium</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                        <X size={14} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-5">
                    <div className="mb-5 text-center">
                        <h1 className="text-lg font-extrabold text-slate-900">Nuevo Proveedor</h1>
                        <p className="mt-1 text-[11px] text-slate-500">Ingrese los detalles del socio comercial.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Nombre de la Empresa</label>
                            <input
                                required type="text"
                                autoFocus
                                value={form.nombre_empresa} onChange={e => set('nombre_empresa', e.target.value)}
                                placeholder="Ej. Brembo S.p.A."
                                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Dirección</label>
                            <div className="relative">
                                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#135bec]/60" />
                                <input
                                    type="text"
                                    value={form.direccion} onChange={e => set('direccion', e.target.value)}
                                    placeholder="Ej. Av. Principal, Edif. Pro, Local 1"
                                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-8 pr-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Teléfono</label>
                            <div className="relative">
                                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#135bec]/60" />
                                <input
                                    type="text"
                                    value={form.telefono} onChange={e => set('telefono', e.target.value)}
                                    placeholder="Ej. +58 412-1234567"
                                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-8 pr-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                            <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} className="disabled:opacity-50 rounded-xl bg-[#135bec] px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-md shadow-[#135bec]/20 hover:bg-[#1048bc] transition-all">
                                {loading ? 'Registrando...' : 'Registrar Proveedor'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
