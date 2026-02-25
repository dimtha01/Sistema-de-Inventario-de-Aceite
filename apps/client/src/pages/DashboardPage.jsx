import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DashboardPage = () => {
  const [periodo, setPeriodo] = useState('Últimos 6 Meses');
  const [data, setData] = useState({
    kpis: { valorInventario: '$0', totalVentas: '0', ingresosTotales: '$0' },
    barras: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch(err => console.error("Error fetching dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    {
      label: 'Valor del Inventario',
      valor: data.kpis.valorInventario,
      sub: 'Actualizado hoy',
      subColor: 'text-emerald-500',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M22 7 13.5 15.5l-5-5L2 17" /><path d="M16 7h6v6" />
        </svg>
      ),
    },
    {
      label: 'Ventas Realizadas',
      valor: data.kpis.totalVentas,
      sub: 'Histórico',
      subColor: 'text-[#135bec]',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect width="16" height="13" x="1" y="3" rx="2" /><path d="M1 9h16M16 3l4 4-4 4" />
        </svg>
      ),
    },
    {
      label: 'Ingresos Totales',
      valor: data.kpis.ingresosTotales,
      sub: 'Acumulado',
      subColor: 'text-emerald-500',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M22 7 13.5 15.5l-5-5L2 17" /><path d="M16 7h6v6" />
        </svg>
      ),
      chart: true,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f6f6f8] text-slate-900 font-[Manrope,sans-serif] space-y-8">

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Hero compacto */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extralight tracking-tighter text-slate-900 leading-tight">
              Visión <span className="font-bold">General</span>
            </h1>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <div
              className="px-4 py-2.5 bg-[#135bec] text-white rounded-xl"
              style={{ boxShadow: '0 6px 20px -4px rgba(19,91,236,0.4)' }}
            >
              <p className="text-white/70 text-[9px] uppercase font-bold tracking-widest">Conexión</p>
              <p className="text-xl font-black leading-tight">En Línea</p>
            </div>
          </div>
        </div>

        {/* KPI Grid compacto */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="p-5 bg-white rounded-2xl border border-slate-100 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 leading-tight">
                  {kpi.label}
                </p>
                <h3 className="text-3xl font-light tracking-tighter">{kpi.valor}</h3>
                {kpi.chart ? (
                  <div className="mt-4">
                    <svg className="w-full h-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#135bec" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#135bec" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 18 Q 10 15, 20 16 T 40 10 T 60 12 T 80 4 T 100 8"
                        fill="none" stroke="#135bec" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M0 18 Q 10 15, 20 16 T 40 10 T 60 12 T 80 4 T 100 8 V 20 H 0 Z"
                        fill="url(#grad2)" fillOpacity="0.15" />
                    </svg>
                  </div>
                ) : (
                  <div className={`mt-3 flex items-center gap-1.5 font-bold text-xs ${kpi.subColor}`}>
                    {kpi.icon}
                    <span>{kpi.sub}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Featured + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Imagen destacada compacta */}
          <div className="relative group rounded-2xl overflow-hidden min-h-[260px]">
            {data.destacado ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${data.destacado.imagen}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="bg-[#135bec] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white w-fit mb-3">
                    {data.destacado.etiqueta}
                  </span>
                  <h4 className="text-white text-2xl font-bold mb-1.5 leading-tight">
                    {data.destacado.nombre}
                  </h4>
                  <p className="text-white/65 text-xs leading-relaxed line-clamp-2">
                    {data.destacado.descripcion}
                  </p>
                  <button className="mt-5 flex items-center gap-2 text-white font-bold text-[11px] uppercase tracking-widest w-fit hover:gap-3 transition-all" onClick={() => window.location.href = '/inventario'}>
                    Ir al Inventario
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs">
                Cargando destacado...
              </div>
            )}
          </div>

          {/* Bar Chart compacto */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-base font-bold leading-tight">Rendimiento Mensual</h4>
                <p className="text-slate-400 text-xs mt-0.5">Unidades por ciclo</p>
              </div>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="bg-slate-50 border-none rounded-lg text-[11px] font-bold px-3 py-1.5 ring-1 ring-slate-100 focus:outline-none focus:ring-2 focus:ring-[#135bec]/20"
              >
                <option>Últimos 6 Meses</option>
                <option>Este Año</option>
              </select>
            </div>
            <div className="flex-1 h-44 pt-4 text-xs font-bold font-sans">
              {loading ? (
                <div className="w-full flex justify-center text-slate-400 font-bold text-xs mt-10">Cargando gráficos...</div>
              ) : data.barras.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.barras} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="mes"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      tickFormatter={(value) => `$${value >= 1000 ? (value / 1000) + 'k' : value}`}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{payload[0].payload.mes}</p>
                              <p className="text-sm font-black text-[#135bec]">{payload[0].payload.valor}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="totalNum" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {data.barras.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.activa ? '#135bec' : '#cbd5e1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full flex justify-center text-slate-400 font-bold text-xs mt-10">Sin datos registrados.</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer compacto */}
        <footer className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-200 text-slate-400 text-[10px] font-medium uppercase tracking-widest gap-3">
          <div>© 2026 Todos los derechos reservados</div>
        </footer>

      </main>
    </div>
  );
};