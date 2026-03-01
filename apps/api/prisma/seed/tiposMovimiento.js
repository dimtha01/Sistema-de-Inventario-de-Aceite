/**
 * Módulo de Tipos de Movimiento
 * Crea los tipos de movimiento para el kardex
 */

export async function seedTiposMovimiento(prisma) {
    const tiposMovimiento = await Promise.all([
        prisma.tipoMovimiento.create({ data: { nombre_tipo: 'Entrada por Compra' } }),
        prisma.tipoMovimiento.create({ data: { nombre_tipo: 'Salida por Venta' } }),
        prisma.tipoMovimiento.create({ data: { nombre_tipo: 'Ajuste de Inventario' } }),
        prisma.tipoMovimiento.create({ data: { nombre_tipo: 'Devolución' } }),
    ]);

    console.log(`✅ ${tiposMovimiento.length} tipos de movimiento creados`);
    return tiposMovimiento;
}
