import { useState, useMemo } from 'react';
import { Search, Plus, Wrench, Settings, Zap, Droplet, Disc, Layers, ArrowRight, Tags, Package } from 'lucide-react';

const categoriasData = [
    {
        id: 1,
        nombre: 'Frenos y Fricción',
        descripcion: 'Pastillas, discos, tambores, líquido de frenos y componentes del sistema ABS para todas las marcas.',
        icon: <Disc size={20} className="text-rose-500 group-hover:scale-110 transition-transform duration-300 sm:w-6 sm:h-6" />,
        bgIcon: 'bg-rose-50 text-rose-600',
        colorPrincipal: 'group-hover:border-rose-200 group-hover:shadow-rose-100',
        textHover: 'group-hover:text-rose-600',
        productos: 142,
        stockValor: '$12,450',
        estado: 'Óptimo',
    },
    {
        id: 2,
        nombre: 'Lubricantes y Químicos',
        descripcion: 'Aceites minerales, sintéticos, refrigerantes, limpiadores y aditivos para motor y transmisión.',
        icon: <Droplet size={20} className="text-blue-500 group-hover:scale-110 transition-transform duration-300 sm:w-6 sm:h-6" />,
        bgIcon: 'bg-blue-50 text-blue-600',
        colorPrincipal: 'group-hover:border-blue-200 group-hover:shadow-blue-100',
        textHover: 'group-hover:text-blue-600',
        productos: 85,
        stockValor: '$5,230',
        estado: 'Revisar stock',
    },
    {
        id: 3,
        nombre: 'Sistema Eléctrico',
        descripcion: 'Baterías, alternadores, cableado, fusibles, bujías y sensores del vehículo de alto rendimiento.',
        icon: <Zap size={20} className="text-amber-500 group-hover:scale-110 transition-transform duration-300 sm:w-6 sm:h-6" />,
        bgIcon: 'bg-amber-50 text-amber-600',
        colorPrincipal: 'group-hover:border-amber-200 group-hover:shadow-amber-100',
        textHover: 'group-hover:text-amber-600',
        productos: 210,
        stockValor: '$22,100',
        estado: 'Óptimo',
    },
    {
        id: 4,
        nombre: 'Suspensión y Dirección',
        descripcion: 'Amortiguadores, rines, muñones, terminales, bases y barras estabilizadoras para control total.',
        icon: <Settings size={20} className="text-emerald-500 group-hover:scale-110 transition-transform duration-300 sm:w-6 sm:h-6" />,
        bgIcon: 'bg-emerald-50 text-emerald-600',
        colorPrincipal: 'group-hover:border-emerald-200 group-hover:shadow-emerald-100',
        textHover: 'group-hover:text-emerald-600',
        productos: 94,
        stockValor: '$18,300',
        estado: 'Óptimo',
    },
    {
        id: 5,
        nombre: 'Repuestos de Motor',
        descripcion: 'Pistones, anillos, empaques, correas de tiempo, poleas y válvulas específicas por modelo.',
        icon: <Wrench size={20} className="text-indigo-500 group-hover:scale-110 transition-transform duration-300 sm:w-6 sm:h-6" />,
        bgIcon: 'bg-indigo-50 text-indigo-600',
        colorPrincipal: 'group-hover:border-indigo-200 group-hover:shadow-indigo-100',
        textHover: 'group-hover:text-indigo-600',
        productos: 312,
        stockValor: '$45,800',
        estado: 'Crítico',
    },
    {
        id: 6,
        nombre: 'Accesorios y Cuidado',
        descripcion: 'Alfombras, cobertores, ceras, champús, aromatizantes y herramientas básicas para detalle.',
        icon: <Layers size={20} className="text-purple-500 group-hover:scale-110 transition-transform duration-300 sm:w-6 sm:h-6" />,
        bgIcon: 'bg-purple-50 text-purple-600',
        colorPrincipal: 'group-hover:border-purple-200 group-hover:shadow-purple-100',
        textHover: 'group-hover:text-purple-600',
        productos: 67,
        stockValor: '$2,100',
        estado: 'Óptimo',
    }
];

const CategoriaCard = ({ categoria }) => (
    <div className={`group bg-white flex flex-col rounded-2xl sm:rounded-3xl border border-slate-100 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${categoria.colorPrincipal}`}>

        <div className="flex justify-between items-start mb-5 sm:mb-6">
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl sm:w-14 sm:h-14 sm:rounded-2xl transition-colors duration-300 flex-shrink-0 ${categoria.bgIcon}`}>
                {categoria.icon}
            </div>

            {/* Mini badge estado de inventario */}
            <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] whitespace-nowrap font-black uppercase tracking-widest rounded-xl border flex items-center gap-1.5 shadow-sm ml-2 ${categoria.estado === 'Crítico' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                categoria.estado === 'Revisar stock' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${categoria.estado === 'Crítico' ? 'bg-rose-500' : categoria.estado === 'Revisar stock' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                {categoria.estado}
            </span>
        </div>

        <h3 className={`text-lg sm:text-xl font-black text-slate-900 leading-tight mb-2 sm:mb-3 transition-colors duration-300 ${categoria.textHover}`}>
            {categoria.nombre}
        </h3>

        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 flex-1">
            {categoria.descripcion}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5 sm:mb-6">
            <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors flex flex-col justify-center">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    <Package size={12} className="opacity-70 sm:w-3.5 sm:h-3.5" />
                    <span>Items</span>
                </div>
                <p className="text-base sm:text-xl font-black text-slate-900">{categoria.productos}</p>
            </div>
            <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors flex flex-col justify-center">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    <Tags size={12} className="opacity-70 sm:w-3.5 sm:h-3.5" />
                    <span>Valor (Est.)</span>
                </div>
                <p className="text-base sm:text-xl font-black text-slate-900">{categoria.stockValor}</p>
            </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-700 font-bold rounded-xl sm:rounded-2xl text-[11px] sm:text-xs uppercase tracking-widest hover:bg-[#135bec] hover:text-white transition-all duration-300 group/btn shadow-sm">
            Explorar Categoría
            <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
    </div>
);

// Agregar Categoría Vacía
const NuevaCategoriaCard = () => (
    <div className="group flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200 p-6 sm:p-8 text-center hover:border-[#135bec] hover:bg-[#135bec]/5 transition-all duration-300 cursor-pointer min-h-[300px] sm:min-h-[360px]">
        <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 mb-4 sm:mb-5 group-hover:scale-110 group-hover:bg-[#135bec] transition-all duration-300">
            <Plus className="text-[#135bec] group-hover:text-white transition-colors" size={24} strokeWidth={2.5} />
        </div>
        <h3 className="font-black text-lg sm:text-xl text-slate-900 mb-2 sm:mb-3">Crear Categoría</h3>
        <p className="text-slate-500 text-xs sm:text-sm max-w-[200px] sm:max-w-[220px] leading-relaxed">
            Añade una nueva agrupación para mantener organizado y sectorizado el inventario principal.
        </p>
    </div>
);

// ── Página principal ─────────────────────────────────────
export const CategoriasPage = () => {
    const [busqueda, setBusqueda] = useState('');

    const filtradas = useMemo(() => {
        if (!busqueda) return categoriasData;
        const b = busqueda.toLowerCase();
        return categoriasData.filter(c =>
            c.nombre.toLowerCase().includes(b) ||
            c.descripcion.toLowerCase().includes(b)
        );
    }, [busqueda]);

    return (
        <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 w-full p-4 lg:p-6 mx-auto max-w-7xl">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2.5 sm:gap-3">
                        <Layers className="text-[#135bec] w-7 h-7 sm:w-9 sm:h-9" />
                        Categorías
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 max-w-xl leading-relaxed">
                        Clasifica y gestiona tu inventario mediante familias de repuestos.
                    </p>
                </div>
                <button className="flex justify-center flex-shrink-0 items-center gap-2 bg-[#135bec] hover:bg-[#1048bc] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all shadow-lg shadow-[#135bec]/25 uppercase tracking-widest">
                    <Plus size={16} strokeWidth={3} className="sm:w-[18px] sm:h-[18px]" />
                    Nueva Categoría
                </button>
            </div>

            {/* Buscador Contextual */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm sticky top-4 z-20">
                <div className="flex items-center gap-3 w-full sm:w-auto sm:min-w-[320px] lg:min-w-[380px] relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar categoría..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-slate-50 border-2 border-transparent focus:border-[#135bec] rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#135bec] bg-[#135bec]/10 rounded-lg sm:rounded-xl whitespace-nowrap border border-[#135bec]/20 w-full sm:w-auto justify-center">
                    <Layers size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>{filtradas.length} {filtradas.length === 1 ? 'Resultado' : 'Resultados'}</span>
                </div>
            </div>

            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-1 sm:mt-2">
                {filtradas.map(c => (
                    <CategoriaCard key={c.id} categoria={c} />
                ))}
                {!busqueda && <NuevaCategoriaCard />}
            </div>

            {/* Empty State */}
            {filtradas.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 border-dashed text-center shadow-sm">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 sm:mb-5 border border-slate-100">
                        <Layers size={28} className="text-slate-300 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-widest">Sin resultados</h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 sm:mt-2">Modifica tu búsqueda para encontrar la categoría que buscas.</p>
                </div>
            )}

        </div>
    );
};
