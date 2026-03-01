/**
 * Módulo de Ventas
 * Crea ventas con datos generados por Faker
 */

import { faker } from '@faker-js/faker';
faker.locale = 'es';

export async function seedVentas(prisma, clientes, usuarios, estadosPago, productos) {
    const ventasCount = faker.number.int({ min: 15, max: 30 });
    const ventas = [];
    const clientesUsados = new Set();
    const usuariosUsados = new Set();

    for (let i = 0; i < ventasCount; i++) {
        const cliente = faker.helpers.arrayElement(clientes);
        const usuario = faker.helpers.arrayElement(usuarios);
        const estadoPago = faker.helpers.arrayElement(estadosPago);

        // Generar detalles de venta (1-5 productos por venta)
        const numDetalles = faker.number.int({ min: 1, max: 5 });
        const detalles = [];
        let montoTotal = 0;

        const productosDisponibles = faker.helpers.shuffle([...productos]);

        for (let j = 0; j < Math.min(numDetalles, productosDisponibles.length); j++) {
            const producto = productosDisponibles[j];
            const cantidad = faker.number.int({ min: 1, max: 5 });
            const precioUnitario = producto.precio?.precio_venta || 100;

            detalles.push({
                id_producto: producto.id_producto,
                cantidad: cantidad,
                precio_unitario_aplicado: precioUnitario,
            });

            montoTotal += cantidad * precioUnitario;
        }

        // Crear venta
        const ventaData = {
            id_cliente: cliente.id_cliente,
            id_usuario: usuario.id_usuario,
            id_estado_pago: estadoPago.id_estado_pago,
            monto_total: montoTotal,
            detalles: {
                create: detalles,
            },
        };

        // Agregar abonos si está en estado "Abonado Parcial"
        if (estadoPago.nombre_estado === 'Abonado Parcial') {
            const numAbonos = faker.number.int({ min: 1, max: 4 });
            const abonos = [];
            let montoAbonado = 0;

            for (let k = 0; k < numAbonos; k++) {
                const montoRestante = montoTotal - montoAbonado;
                const minAbono = Math.min(montoTotal * 0.1, montoRestante * 0.5);
                const maxAbono = Math.max(minAbono + 1, montoRestante * 0.9);

                const abono = faker.number.float({
                    min: minAbono,
                    max: maxAbono,
                    fractionDigits: 2,
                });
                abonos.push({ monto_abonado: abono });
                montoAbonado += abono;

                if (montoAbonado >= montoTotal * 0.95) break;
            }

            ventaData.abonos = { create: abonos };
        }

        const venta = await prisma.venta.create({
            data: ventaData,
        });
        ventas.push(venta);

        clientesUsados.add(cliente.id_cliente);
        usuariosUsados.add(usuario.id_usuario);

        console.log(`   • Venta #${venta.id_venta} - $${montoTotal.toFixed(2)} (${estadoPago.nombre_estado})`);
    }

    console.log(`✅ ${ventas.length} ventas creadas`);
    console.log(`   • Clientes con compras: ${clientesUsados.size}`);
    console.log(`   • Vendedores activos: ${usuariosUsados.size}`);
    return ventas;
}
