import { useState } from "react";
import { X, User, Phone, MapPin, Building2, CreditCard, Info } from "lucide-react";

const formInicial = {
    nombre: "",
    apellido: "",
    telefono: "",
    limite_credito: "",
};

const inputCls =
    "w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-transparent focus:border-[#135bec] focus:outline-none rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all";

// No se requiere TIPOS_CLIENTE abstracto ya que el modelo Cliente es directo.

// ── Sub-componente Field ────────────────────────────────
const Field = ({ label, icon, children }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {label}
        </label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                {icon}
            </span>
            {children}
        </div>
    </div>
);

/**
 * @param {{ onClose: () => void, onGuardar: (cliente: object) => void }} props
 */
export const ModalNuevoCliente = ({ onClose, onGuardar }) => {
    const [form, setForm] = useState(formInicial);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const set = (name, value) => {
        setForm((p) => ({ ...p, [name]: value }));
        setErrorMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nombre.trim() || saving) return;
        setSaving(true);
        setErrorMsg("");

        try {
            const resp = await fetch("/api/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: form.nombre.trim(),
                    apellido: form.apellido.trim(),
                    telefono: form.telefono.trim() || null,
                    limite_credito: parseFloat(form.limite_credito) || 0,
                }),
            });

            const json = await resp.json();

            if (resp.ok && json.success) {
                onGuardar(json.data);
                onClose();
            } else {
                setErrorMsg(json.message || "Error al crear cliente.");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("No se pudo conectar con el servidor.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
                style={{ maxHeight: "92vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                            Nuevo Cliente
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Completa los datos del cliente o empresa.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-300 hover:text-slate-500 transition-colors p-1"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* ── Formulario ── */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Error */}
                    {errorMsg && (
                        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                            <p className="text-[11px] font-semibold text-red-700 tracking-wide">
                                {errorMsg}
                            </p>
                        </div>
                    )}

                    <form
                        id="form-nuevo-cliente"
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Nombre" icon={<User size={14} />}>
                                <input
                                    name="nombre"
                                    value={form.nombre}
                                    required
                                    onChange={(e) => set("nombre", e.target.value)}
                                    placeholder="ej. Juan"
                                    disabled={saving}
                                    className={inputCls}
                                />
                            </Field>

                            <Field label="Apellido" icon={<User size={14} />}>
                                <input
                                    name="apellido"
                                    value={form.apellido}
                                    required
                                    onChange={(e) => set("apellido", e.target.value)}
                                    placeholder="ej. Pérez"
                                    disabled={saving}
                                    className={inputCls}
                                />
                            </Field>
                        </div>

                        {/* Teléfono */}
                        <Field label="Teléfono" icon={<Phone size={14} />}>
                            <input
                                name="telefono"
                                value={form.telefono}
                                required
                                onChange={(e) => set("telefono", e.target.value)}
                                placeholder="+58 414-0000000"
                                disabled={saving}
                                className={inputCls}
                            />
                        </Field>

                        {/* Límite de crédito */}
                        <Field label="Límite de Crédito ($)" icon={<CreditCard size={14} />}>
                            <input
                                name="limite_credito"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.limite_credito}
                                onChange={(e) => set("limite_credito", e.target.value)}
                                placeholder="0.00"
                                disabled={saving}
                                className={inputCls}
                            />
                        </Field>

                        {/* Tip */}
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-[#135bec]/5 border border-[#135bec]/10">
                            <Info size={14} className="text-[#135bec] flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                El saldo pendiente se calcula dinámicamente a partir de las ventas
                                a crédito y los abonos registrados.
                            </p>
                        </div>
                    </form>
                </div>

                {/* ── Footer con botones ── */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col gap-2">
                    <button
                        type="submit"
                        form="form-nuevo-cliente"
                        disabled={saving}
                        className="w-full py-3 bg-[#135bec] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:active:translate-y-0"
                        style={{ boxShadow: "0 6px 20px -4px rgba(19,91,236,0.4)" }}
                    >
                        {saving ? "Guardando..." : "Guardar Cliente"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="w-full py-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs transition-colors"
                    >
                        Cancelar y Volver
                    </button>
                </div>
            </div>
        </div>
    );
};
