import { prisma } from '../prisma.js';

export const getDashboardData = async (req, res) => {
    try {
        // 1. Valor del Inventario
        const productos = await prisma.producto.findMany({
            include: { precio: true }
        });

        const valorInventario = productos.reduce((acc, p) => {
            const qty = p.stock_actual || 0;
            const price = p.precio ? Number(p.precio.precio_compra) : 0;
            return acc + (qty * price);
        }, 0);

        // 2. Ventas Totales y Crecimiento
        const ventas = await prisma.venta.findMany({
            orderBy: { fecha_venta: 'desc' }
        });

        const ingresosTotales = ventas.reduce((acc, v) => acc + Number(v.monto_total), 0);
        const totalVentas = ventas.length;

        // 3. Gráfico de barras (Últimos 6 meses)
        const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const ultimos6Meses = [];

        let maxVentasMes = 0;
        const now = new Date();

        // Inicializar ultimos 6 meses en orden (de más antiguo a más reciente)
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            ultimos6Meses.push({
                mes: mesesNombres[d.getMonth()],
                year: d.getFullYear(),
                monthNum: d.getMonth(),
                total: 0,
                activa: i === 0 // El mes actual (último iterado) será el activo
            });
        }

        // Sumar ventas por mes
        ventas.forEach(v => {
            const d = new Date(v.fecha_venta);
            const matchIndex = ultimos6Meses.findIndex(m => m.year === d.getFullYear() && m.monthNum === d.getMonth());
            if (matchIndex !== -1) {
                ultimos6Meses[matchIndex].total += Number(v.monto_total);
                if (ultimos6Meses[matchIndex].total > maxVentasMes) {
                    maxVentasMes = ultimos6Meses[matchIndex].total;
                }
            }
        });

        // Formatear barras para el Frontend
        const barras = ultimos6Meses.map(m => {
            const altura = maxVentasMes > 0 ? Math.round((m.total / maxVentasMes) * 100) : 0;
            const formatTotal = m.total >= 1000 ? (m.total / 1000).toFixed(1) + 'k' : m.total.toString();
            return {
                mes: m.mes,
                altura: `${altura || 5}%`, // Min height 5%
                valor: `$${formatTotal}`,
                activa: m.activa,
                totalNum: m.total
            };
        });

        // Formateo de KPIs
        const formatMoney = (val) => val >= 1000000
            ? `$${(val / 1000000).toFixed(1)}M`
            : val >= 1000
                ? `$${(val / 1000).toFixed(1)}k`
                : `$${val.toFixed(0)}`;

        // 4. Producto Destacado
        const productosDestacados = [...productos].sort((a, b) => {
            const valA = (a.stock_actual || 0) * (a.precio ? Number(a.precio.precio_compra) : 0);
            const valB = (b.stock_actual || 0) * (b.precio ? Number(b.precio.precio_compra) : 0);
            return valB - valA;
        });

        let destacadoData = null;
        if (productosDestacados.length > 0) {
            const destacado = productosDestacados[0];
            const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
            const cleanImagePath = destacado.url_imagen ? destacado.url_imagen.replace(/\\/g, '/').replace(/^\/+/, '') : '';
            const imageUrlFormatted = cleanImagePath ? (cleanImagePath.startsWith('http') ? cleanImagePath : `${BACKEND_URL}/${cleanImagePath}`) : 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&q=80&w=800';

            destacadoData = {
                nombre: destacado.nombre_repuesto,
                imagen: imageUrlFormatted,
                descripcion: `Stock actual: ${destacado.stock_actual} unidades. Representa la mayor inversión en inventario actual.`,
                etiqueta: 'Producto Principal'
            };
        }

        res.status(200).json({
            success: true,
            data: {
                kpis: {
                    valorInventario: formatMoney(valorInventario),
                    totalVentas: totalVentas.toString(),
                    ingresosTotales: formatMoney(ingresosTotales)
                },
                barras,
                destacado: destacadoData
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ success: false, message: 'Error retrieving dashboard analytics' });
    }
};
