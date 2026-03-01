/**
 * Módulo de Movimientos de Kardex
 * Crea movimientos de inventario con datos generados por Faker
 */

import { faker } from '@faker-js/faker';
faker.locale = 'es';

export async function seedMovimientos(prisma, productos, usuarios, tiposMovimiento) {
    const movimientosCount = faker.number.int({ min: 40, max: 80 });
    const movimientos = [];

    // Distribución de tipos de movimiento
    const pesosTipos = [0.4, 0.35, 0.15, 0.1]; // Entradas, Salidas, Ajustes, Devoluciones

    for (let i = 0; i < movimientosCount; i++) {
        const producto = faker.helpers.arrayElement(productos);
        const usuario = faker.helpers.arrayElement(usuarios);

        // Seleccionar tipo de movimiento según pesos
        let tipoIndex = 0;
        const rand = faker.number.float({ min: 0, max: 1 });
        let acumulado = 0;
        for (let j = 0; j < pesosTipos.length; j++) {
            acumulado += pesosTipos[j];
            if (rand <= acumulado) {
                tipoIndex = j;
                break;
            }
        }

        const tipoMov = tiposMovimiento[tipoIndex];

        // Generar cantidad según tipo
        let cantidad;
        switch (tipoMov.nombre_tipo) {
            case 'Entrada por Compra':
                cantidad = faker.number.int({ min: 5, max: 100 });
                break;
            case 'Salida por Venta':
                cantidad = faker.number.int({ min: 1, max: 20 });
                break;
            case 'Ajuste de Inventario':
                cantidad = faker.number.int({ min: -10, max: 10 });
                if (cantidad === 0) cantidad = -1;
                break;
            case 'Devolución':
                cantidad = faker.number.int({ min: 1, max: 10 });
                break;
            default:
                cantidad = faker.number.int({ min: 1, max: 10 });
        }

        const movimiento = await prisma.historialMovimiento.create({
            data: {
                id_producto: producto.id_producto,
                id_usuario: usuario.id_usuario,
                id_tipo_mov: tipoMov.id_tipo_mov,
                cantidad: cantidad,
            },
        });
        movimientos.push(movimiento);
    }

    console.log(`✅ ${movimientos.length} movimientos de kardex creados`);

    // Resumen por tipo
    const resumen = {};
    for (const tipo of tiposMovimiento) {
        const count = movimientos.filter(m => m.id_tipo_mov === tipo.id_tipo_mov).length;
        resumen[tipo.nombre_tipo] = count;
    }
    console.log('   Distribución:', Object.entries(resumen).map(([k, v]) => `${k}: ${v}`).join(', '));

    return movimientos;
}
