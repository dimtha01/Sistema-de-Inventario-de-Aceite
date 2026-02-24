import { prisma } from '../prisma.js';

export const getHistorial = async (req, res) => {
    try {
        const movimientos = await prisma.historialMovimiento.findMany({
            include: {
                producto: true,
                usuario: true,
                tipo_movimiento: true
            },
            orderBy: {
                fecha_hora: 'desc'
            }
        });

        const formatted = movimientos.map(m => {
            let tipoNormalizado = 'ajuste';
            const nombreTipo = m.tipo_movimiento?.nombre_tipo?.toLowerCase() || '';
            if (nombreTipo.includes('entrada') || nombreTipo.includes('compra') || nombreTipo.includes('ingreso')) tipoNormalizado = 'entrada';
            else if (nombreTipo.includes('salida') || nombreTipo.includes('venta')) tipoNormalizado = 'salida';

            const tiempo = new Date(m.fecha_hora).toLocaleString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            return {
                id: m.id_movimiento,
                tipo: tipoNormalizado,
                tipo_original: m.tipo_movimiento?.nombre_tipo || 'Ajuste',
                cantidad: m.cantidad,
                producto: m.producto?.nombre_repuesto || 'Producto Eliminado',
                usuario: m.usuario ? `${m.usuario.nombre} ${m.usuario.apellido}` : 'Sistema',
                tiempo: tiempo,
                lugar: tipoNormalizado === 'entrada' ? 'Recepción de Carga' : (tipoNormalizado === 'salida' ? 'Punto de Venta' : 'Almacén Central')
            };
        });

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        console.error('Error en getHistorial:', error);
        res.status(500).json({ success: false, message: 'Error al obtener historial de movimientos' });
    }
};
