/**
 * Módulo de Estados de Pago
 * Crea los estados de pago para las ventas
 */

export async function seedEstadosPago(prisma) {
    const estadosPago = await Promise.all([
        prisma.estadoPago.create({ data: { nombre_estado: 'Pagado' } }),
        prisma.estadoPago.create({ data: { nombre_estado: 'Pendiente' } }),
        prisma.estadoPago.create({ data: { nombre_estado: 'Abonado Parcial' } }),
    ]);

    console.log(`✅ ${estadosPago.length} estados de pago creados`);
    return estadosPago;
}
