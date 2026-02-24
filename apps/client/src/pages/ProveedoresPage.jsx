import { useState, useMemo } from 'react';
import {
    Search, Plus, MapPin, ArrowRight,
    Building2, Settings, ShieldCheck, Zap, Box, X, Upload
} from 'lucide-react';

// ── Datos ────────────────────────────────────────────────
const proveedoresData = [
    {
        id: 1,
        nombre: 'Robert Bosch GmbH',
        pais: 'Alemania',
        categoria: 'oem',
        badgeLabel: 'Socio OEM',
        badgeCls: 'bg-[#135bec]/10 text-[#135bec]',
        icon: <Settings className="text-[#135bec]" size={14} />,
        descripcion: 'Proveedor líder mundial de tecnología y servicios para sistemas automotrices, desde inyección de combustible hasta sensores de alto rendimiento.',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyr249YMgKSSF3Mm-CQqt-WfAUvScmu0JntXZYhezxAEs0aJJwocpJV8p_TxOcVEkIZHoIEwLxIXjm-af_pk12lP6rFmXvV8g5r9JsLcHgVtoeJnABfxage-yvtdE2x6QCi5QV5DfjGerzJtyIXMvd84x68o1WRtbw3__7eMZMpxi4uTemjXW8FQv5NbEF1pfWhCvI5X76zv7X6bCMzg5qKNf_HIgosX9Iej2sw9PZFP6cIx4f-2LJGS0cQCx5L-pWJegQP3Ni_bU',
        productos: 142,
    },
    {
        id: 2,
        nombre: 'Michelin Mobility',
        pais: 'Francia',
        categoria: 'premium',
        badgeLabel: 'Premium Tier',
        badgeCls: 'bg-emerald-50 text-emerald-600',
        icon: <ShieldCheck className="text-emerald-600" size={14} />,
        descripcion: 'Líder global en neumáticos de alto rendimiento y soluciones de movilidad sostenible para vehículos de lujo y deportivos.',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_O3cSuM4Y3_IQbHYfgBmSI4YzYQPka_RDvdzw23gnRG5SJ7ESqbJ-V2FT5nYb9dUUfLMp2DgYLxQDwWAgZYw2BNgsl8xlQT6JIbnl5qIgkUobg8gpiRwNQbvCS9xzZxjOb52zCNMdMXgHUFHn8KpVdHa1HRI0N1rsnPBsZ9FnfvCAU2naBLahhlW0x6naGurrW5TqMKyN7XOuDs0Ia9_4jOM4dQC-Ysawa_-_7-jmdhi7px5bcIFuMA4TdRVTTz2qRfA8-1atnPo',
        productos: 85,
    },
    {
        id: 3,
        nombre: 'Brembo S.p.A.',
        pais: 'Italia',
        categoria: 'racing',
        badgeLabel: 'Tecnología Racing',
        badgeCls: 'bg-amber-50 text-amber-600',
        icon: <Zap className="text-amber-600" size={14} />,
        descripcion: 'Sistemas de frenos de última generación diseñados para supercars de alto rendimiento y divisiones de élite en competición.',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFTr2ym_LeQ0-twvjZ5WalcNFsFCa6U9Q2qlkIrjvFl-2AxNASJ-IdGAGrGA2I41LTmHNnOUaHRdt3t758MDRNTSNt3-O8DSHKF4WJangvgFsdgB9vnlivy3g-wRN-WKXKV1fe7f93MUXSAwLHqfmLaMV-U47ivAVX-igzYmofmP2uSEa7PuDK53pJUl-VHSCae4CmQH7PqXTnLAetQOmRnBBVWY9UZnkx17n25pgajTcDpXE5klm92ZfJMBCtJ3Q37XLHXxDttLo',
        productos: 210,
    },
    {
        id: 4,
        nombre: 'Akrapovič Exhaust',
        pais: 'Eslovenia',
        categoria: 'postventa',
        badgeLabel: 'Postventa Performance',
        badgeCls: 'bg-indigo-50 text-indigo-600',
        icon: <Box className="text-indigo-600" size={14} />,
        descripcion: 'Fabricante de sistemas de escape premium en fibra de carbono y titanio para un rendimiento acústico y mecánico sin rival.',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1AMg1xAItZk7iA1C0NvzDTJtbD3kESVX6fCqVfKDXkPDcqL2KNsfJB3RbwllRMexEDpU1Ae3NRq4dgfoQUFkUp_D1BUMVziM4zI3s_FhpgDsqiq1m27dNHYuaEuzJauHWxYlkznaZIAP9TQa1Otom0vtrWpr4HCG0M2moIMx180-sAK2Z3fLDzA-7bkkk5VX7z2_aNNbm_gtCddqFmdLNeRR98hgMSWLbdKsxM3L8CByf_r6RUuLcnBxOvdCGtMT1yCedM3uq98Q',
        productos: 42,
    },
    {
        id: 5,
        nombre: 'Öhlins Racing AB',
        pais: 'Suecia',
        categoria: 'racing',
        badgeLabel: 'Tecnología Racing',
        badgeCls: 'bg-amber-50 text-amber-600',
        icon: <Zap className="text-amber-600" size={14} />,
        descripcion: 'Tecnología de suspensión avanzada para los equipos de competición más exigentes y vehículos de consumo de alta gama.',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcrObJVetVyg-bOxTTF7bnBAiM1HFjPasm69ufnGFNphFnkklF-T5DOo8QCwIe88FPQ7dS_7VH_T_bodXETGhlcLLA9xGb8ZE1P2gjPwROshv3ymFuK3h4CoibFBC8xZNNqpPnfYVnMw3jNayOggDzlBUdfUYseL1Xluf5cBpU84sl0cZ3BW39rxOGDJRaA43hsQOm8w3OtrASCiH0Kgrkz2siQZ2nb6dF5qIcz_CVC7DmZbOKmlyCGf0rQnakaElkWD2eZQ-CXIE',
        productos: 67,
    },
];

const FILTROS = [
    { key: 'todos', label: 'Todos' },
    { key: 'oem', label: 'Socio OEM' },
    { key: 'premium', label: 'Premium Tier' },
    { key: 'postventa', label: 'Postventa' },
    { key: 'racing', label: 'Tecnología Racing' },
];

const CATEGORIAS = [
    { value: 'oem', label: 'Original (OEM)' },
    { value: 'racing', label: 'Racing & Performance' },
    { value: 'premium', label: 'Premium Tier' },
    { value: 'postventa', label: 'Postventa Performance' },
];

const formInicial = { nombre: '', categoria: '', pais: '', logo: null, preview: null };

// ── Modal Nuevo Proveedor ─────────────────────────────────
const ModalNuevoProveedor = ({ onClose, onGuardar }) => {
    const [form, setForm] = useState(formInicial);
    const [dragging, setDragging] = useState(false);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleLogo = (file) => {
        if (!file?.type.startsWith('image/')) return;
        set('preview', URL.createObjectURL(file));
        set('logo', file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.nombre.trim() || !form.categoria || !form.pais.trim()) return;
        onGuardar({
            id: Date.now(),
            nombre: form.nombre,
            pais: form.pais,
            categoria: form.categoria,
            badgeLabel: CATEGORIAS.find(c => c.value === form.categoria)?.label ?? '',
            badgeCls: 'bg-slate-100 text-slate-600',
            icon: <Box size={14} className="text-slate-500" />,
            descripcion: 'Nuevo proveedor registrado en el sistema.',
            logo: form.preview || null,
            productos: 0,
        });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-4 sm:py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#135bec]/5 text-[#135bec]">
                            <Building2 size={18} />
                        </div>
                        <div>
                            <h2 className="text-xs sm:text-sm font-extrabold tracking-widest text-slate-900 uppercase">
                                AutoPart Pro
                            </h2>
                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                                Sistema de Gestión Premium
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 sm:px-8 py-6 sm:py-8 max-h-[80vh] overflow-y-auto">
                    <div className="mb-6 sm:mb-8 text-center">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Nuevo Proveedor</h1>
                        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-slate-500">
                            Ingrese los detalles del socio comercial para el catálogo premium.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

                        {/* Grid de campos */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">

                            {/* Nombre */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Nombre del Proveedor
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={form.nombre}
                                    onChange={e => set('nombre', e.target.value)}
                                    placeholder="Ej. Brembo S.p.A."
                                    className="w-full rounded-xl border-2 border-transparent bg-slate-50 p-3 sm:p-3.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
                                />
                            </div>

                            {/* Categoría */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Categoría
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        value={form.categoria}
                                        onChange={e => set('categoria', e.target.value)}
                                        className="w-full appearance-none rounded-xl border-2 border-transparent bg-slate-50 p-3 sm:p-3.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all"
                                    >
                                        <option value="" disabled>Seleccionar...</option>
                                        {CATEGORIAS.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#135bec]">
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* País — full width */}
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    País de Origen
                                </label>
                                <div className="relative">
                                    <MapPin
                                        size={14}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#135bec]/50 sm:w-4 sm:h-4"
                                    />
                                    <input
                                        required
                                        type="text"
                                        value={form.pais}
                                        onChange={e => set('pais', e.target.value)}
                                        placeholder="Ej. Italia, Alemania, Japón"
                                        className="w-full rounded-xl border-2 border-transparent bg-slate-50 pl-9 sm:pl-10 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-[#135bec] focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col-reverse gap-2.5 sm:gap-3 pt-3 sm:pt-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-slate-200 px-6 sm:px-7 py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="rounded-xl bg-[#135bec] px-8 sm:px-9 py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#135bec]/20 hover:bg-[#1048bc] transition-all"
                            >
                                Registrar Proveedor
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

// ── Tarjeta de proveedor ──────────────────────────────────
const ProveedorCard = ({ proveedor }) => (
    <div className="group flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-[#135bec]/5 transition-all duration-300">
        <div className="p-4 sm:p-5 flex flex-col flex-1">
            <div className="flex items-center gap-1 sm:gap-1.5 text-slate-400 mb-2 sm:mb-3">
                <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">{proveedor.pais}</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mb-1.5 group-hover:text-[#135bec] transition-colors">
                {proveedor.nombre}
            </h3>

            <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed mb-4 sm:mb-5 flex-1">
                {proveedor.descripcion}
            </p>

            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100 mt-auto">
                <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Catálogo</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900">{proveedor.productos} ref.</span>
                </div>
                <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 text-slate-700 font-bold rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] hover:bg-[#135bec] hover:text-white transition-all group/btn uppercase tracking-wider">
                    Ver Perfil
                    <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    </div>
);

// ── Card vacía: Ampliar red ───────────────────────────────
const AgregarCard = ({ onClick }) => (
    <div
        onClick={onClick}
        className="group flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200 p-6 sm:p-8 text-center hover:border-[#135bec] hover:bg-[#135bec]/5 transition-all cursor-pointer min-h-[220px] sm:min-h-[260px]"
    >
        <div className="h-12 w-12 sm:h-14 sm:w-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-[#135bec] transition-all duration-300">
      <Building2 className="text-[#135bec] group-hover:text-white transition-colors sm:w-6 sm:h-6" size={20} strokeWidth={2.5} />
    </div>
        <h3 className="font-black text-base sm:text-lg text-slate-900 mb-1.5 sm:mb-2">Integrar Socio</h3>
        <p className="text-slate-500 text-[11px] sm:text-xs max-w-[180px] sm:max-w-[200px] leading-relaxed">
            Añade un nuevo fabricante o distribuidor oficial.
        </p>
        <div className="mt-4 sm:mt-5 flex justify-center items-center gap-1.5 sm:gap-2 bg-white border border-slate-200 text-slate-700 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold group-hover:border-[#135bec] group-hover:text-[#135bec] transition-all tracking-wider">
            <Plus size={14} strokeWidth={3} className="sm:w-4 sm:h-4" />
            NUEVO PROVEEDOR
        </div>
    </div>
);

// ── Página principal ─────────────────────────────────────
export const ProveedoresPage = () => {
    const [filtroActivo, setFiltroActivo] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [proveedores, setProveedores] = useState(proveedoresData);

    const filtrados = useMemo(() => {
        let lista = proveedores;
        if (filtroActivo !== 'todos') lista = lista.filter(p => p.categoria === filtroActivo);
        if (busqueda) {
            const b = busqueda.toLowerCase();
            lista = lista.filter(p =>
                p.nombre.toLowerCase().includes(b) || p.pais.toLowerCase().includes(b)
            );
        }
        return lista;
    }, [filtroActivo, busqueda, proveedores]);

    const handleGuardar = (nuevo) => {
        setProveedores(prev => [nuevo, ...prev]);
    };

    return (
        <div className="flex flex-col gap-5 sm:gap-6 w-full max-w-7xl mx-auto p-4 lg:p-6">

            {/* Modal */}
            {showModal && (
                <ModalNuevoProveedor
                    onClose={() => setShowModal(false)}
                    onGuardar={handleGuardar}
                />
            )}

            {/* ── Encabezado ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        Proveedores Premium
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 max-w-xl leading-relaxed">
                        Gestiona tu red global de fabricantes automotrices de alto rendimiento.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex justify-center flex-shrink-0 items-center gap-1.5 sm:gap-2 bg-[#135bec] hover:bg-[#1048bc] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold transition-all shadow-lg shadow-[#135bec]/25 uppercase tracking-widest"
                >
                    <Plus size={14} strokeWidth={3} className="sm:w-4 sm:h-4" />
                    NUEVO PROVEEDOR
                </button>
            </div>

            {/* ── Filtros y Buscador ── */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm sticky top-4 z-20">
                <div className="flex bg-slate-50 p-1 rounded-lg sm:rounded-xl w-full lg:w-auto overflow-x-auto">
                    {FILTROS.map(f => {
                        const count = f.key === 'todos'
                            ? proveedores.length
                            : proveedores.filter(p => p.categoria === f.key).length;
                        return (
                            <button
                                key={f.key}
                                onClick={() => setFiltroActivo(f.key)}
                                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filtroActivo === f.key
                                        ? 'bg-white text-[#135bec] shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {f.label}
                                <span className={`px-1.5 py-0.5 rounded-sm sm:rounded-md text-[8px] sm:text-[9px] ${filtroActivo === f.key
                                        ? 'bg-[#135bec]/10 text-[#135bec]'
                                        : 'bg-slate-200 text-slate-500'
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="relative w-full lg:w-64 sm:min-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 sm:w-4 sm:h-4" size={14} />
          <input
                        type="text"
                        placeholder="Buscar por nombre o país..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border-2 border-transparent focus:border-[#135bec] rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* ── Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-1 sm:mt-2">
                {filtrados.map(p => (
                    <ProveedorCard key={p.id} proveedor={p} />
                ))}

                {filtroActivo === 'todos' && !busqueda && (
                    <AgregarCard onClick={() => setShowModal(true)} />
                )}
            </div>

            {/* ── Empty state ── */}
            {filtrados.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-[2rem] border border-dashed border-slate-100 text-center shadow-sm">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-50 flex items-center justify-center mb-3 sm:mb-4 border border-slate-100">
                        <Building2 size={20} className="text-slate-300 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-widest">
                        No hay resultados
                    </h3>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1">
                        Verifica tu búsqueda o selecciona otra categoría.
                    </p>
                </div>
            )}

        </div>
    );
};