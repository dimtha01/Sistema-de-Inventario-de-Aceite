import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...\n');

    // ── Limpiar tablas (orden inverso por dependencias) ──
    await prisma.historialMovimiento.deleteMany();
    await prisma.abonoCredito.deleteMany();
    await prisma.detalleVenta.deleteMany();
    await prisma.venta.deleteMany();
    await prisma.precioProducto.deleteMany();
    await prisma.producto.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.proveedor.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.estadoPago.deleteMany();
    await prisma.tipoMovimiento.deleteMany();
    await prisma.categoria.deleteMany();
    await prisma.rolUsuario.deleteMany();

    console.log('🗑️  Tablas limpiadas');

    // =============================================
    // 1. CATÁLOGOS
    // =============================================

    const roles = await Promise.all([
        prisma.rolUsuario.create({ data: { nombre_rol: 'Administrador' } }),
        prisma.rolUsuario.create({ data: { nombre_rol: 'Vendedor' } }),
        prisma.rolUsuario.create({ data: { nombre_rol: 'Almacenero' } }),
    ]);
    console.log(`✅ ${roles.length} roles creados`);

    const categorias = await Promise.all([
        prisma.categoria.create({ data: { nombre_categoria: 'Frenos' } }),
        prisma.categoria.create({ data: { nombre_categoria: 'Motor' } }),
        prisma.categoria.create({ data: { nombre_categoria: 'Suspensión' } }),
        prisma.categoria.create({ data: { nombre_categoria: 'Escape' } }),
        prisma.categoria.create({ data: { nombre_categoria: 'Eléctrico' } }),
        prisma.categoria.create({ data: { nombre_categoria: 'Accesorios' } }),
    ]);
    console.log(`✅ ${categorias.length} categorías creadas`);

    const tiposMovimiento = await Promise.all([
        prisma.tipoMovimiento.create({ data: { nombre_tipo: 'Entrada por Compra' } }),
        prisma.tipoMovimiento.create({ data: { nombre_tipo: 'Salida por Venta' } }),
        prisma.tipoMovimiento.create({ data: { nombre_tipo: 'Ajuste de Inventario' } }),
        prisma.tipoMovimiento.create({ data: { nombre_tipo: 'Devolución' } }),
    ]);
    console.log(`✅ ${tiposMovimiento.length} tipos de movimiento creados`);

    const estadosPago = await Promise.all([
        prisma.estadoPago.create({ data: { nombre_estado: 'Pagado' } }),
        prisma.estadoPago.create({ data: { nombre_estado: 'Pendiente' } }),
        prisma.estadoPago.create({ data: { nombre_estado: 'Abonado Parcial' } }),
    ]);
    console.log(`✅ ${estadosPago.length} estados de pago creados`);

    // =============================================
    // 2. ENTIDADES PRINCIPALES
    // =============================================

    const usuarios = await Promise.all([
        prisma.usuario.create({
            data: {
                nombre: 'Carlos',
                apellido: 'Mendoza',
                email: 'carlos@autoelite.com',
                password_hash: '$2b$10$abcdefghijk1234567890hashedpassword1',
                id_rol: roles[0].id_rol, // Administrador
            },
        }),
        prisma.usuario.create({
            data: {
                nombre: 'María',
                apellido: 'García',
                email: 'maria@autoelite.com',
                password_hash: '$2b$10$abcdefghijk1234567890hashedpassword2',
                id_rol: roles[1].id_rol, // Vendedor
            },
        }),
        prisma.usuario.create({
            data: {
                nombre: 'Pedro',
                apellido: 'Ramírez',
                email: 'pedro@autoelite.com',
                password_hash: '$2b$10$abcdefghijk1234567890hashedpassword3',
                id_rol: roles[2].id_rol, // Almacenero
            },
        }),
    ]);
    console.log(`✅ ${usuarios.length} usuarios creados`);

    const proveedores = await Promise.all([
        prisma.proveedor.create({
            data: {
                nombre_empresa: 'Brembo S.p.A.',
                direccion: 'Italia',
                telefono: '+39 035 605 1111',
            },
        }),
        prisma.proveedor.create({
            data: {
                nombre_empresa: 'Bosch Automotive',
                direccion: 'Alemania',
                telefono: '+49 711 811 0',
            },
        }),
        prisma.proveedor.create({
            data: {
                nombre_empresa: 'Michelin Group',
                direccion: 'Francia',
                telefono: '+33 4 73 32 20 00',
            },
        }),
        prisma.proveedor.create({
            data: {
                nombre_empresa: 'Öhlins Racing',
                direccion: 'Suecia',
                telefono: '+46 8 590 025 00',
            },
        }),
        prisma.proveedor.create({
            data: {
                nombre_empresa: 'Akrapovič',
                direccion: 'Eslovenia',
                telefono: '+386 1 787 84 04',
            },
        }),
    ]);
    console.log(`✅ ${proveedores.length} proveedores creados`);

    const clientes = await Promise.all([
        prisma.cliente.create({
            data: {
                nombre: 'Andrés',
                apellido: 'Márquez',
                telefono: '+58 414-1234567',
                limite_credito: 50000.0,
            },
        }),
        prisma.cliente.create({
            data: {
                nombre: 'Jorge',
                apellido: 'Gómez',
                telefono: '+58 424-9876543',
                limite_credito: 30000.0,
            },
        }),
        prisma.cliente.create({
            data: {
                nombre: 'Juan',
                apellido: 'Pérez',
                telefono: '+58 412-4567890',
                limite_credito: 5000.0,
            },
        }),
        prisma.cliente.create({
            data: {
                nombre: 'Miguel',
                apellido: 'Bastidas',
                telefono: '+58 414-5556677',
                limite_credito: 75000.0,
            },
        }),
        prisma.cliente.create({
            data: {
                nombre: 'Andrea',
                apellido: 'Martínez',
                telefono: '+58 424-3334455',
                limite_credito: 2000.0,
            },
        }),
    ]);
    console.log(`✅ ${clientes.length} clientes creados`);

    // =============================================
    // 3. PRODUCTOS Y PRECIOS
    // =============================================

    const productosData = [
        { nombre: 'Disco Brembo Carbono Cerámico', cat: 0, prov: 0, stock: 32, minAlerta: 5, compra: 1100, venta: 1520 },
        { nombre: 'Kit de Pistones Forjados JE', cat: 1, prov: 1, stock: 18, minAlerta: 5, compra: 1240, venta: 1895 },
        { nombre: 'Neumáticos Michelin Pilot Sport 4S', cat: 5, prov: 2, stock: 24, minAlerta: 8, compra: 2100, venta: 3150 },
        { nombre: 'Faro Laser Matrix LED', cat: 4, prov: 1, stock: 2, minAlerta: 5, compra: 1980, venta: 2890 },
        { nombre: 'Amortiguadores Öhlins Road & Track', cat: 2, prov: 3, stock: 4, minAlerta: 3, compra: 6100, venta: 8900 },
        { nombre: 'Sistema de Escape Titanio Akrapovič', cat: 3, prov: 4, stock: 6, minAlerta: 3, compra: 8750, venta: 12500 },
        { nombre: 'Pastillas de Freno Brembo HP', cat: 0, prov: 0, stock: 45, minAlerta: 10, compra: 320, venta: 520 },
        { nombre: 'Bobina de Encendido Bosch', cat: 4, prov: 1, stock: 3, minAlerta: 8, compra: 85, venta: 145 },
        { nombre: 'Filtro de Aire Alto Flujo', cat: 1, prov: 1, stock: 60, minAlerta: 15, compra: 45, venta: 89 },
        { nombre: 'Barra Estabilizadora Reforzada', cat: 2, prov: 3, stock: 12, minAlerta: 4, compra: 780, venta: 1250 },
        { nombre: 'Neumáticos Michelin Primacy 4', cat: 5, prov: 2, stock: 40, minAlerta: 10, compra: 950, venta: 1450 },
        { nombre: 'Kit de Embrague Reforzado', cat: 1, prov: 1, stock: 7, minAlerta: 3, compra: 2200, venta: 3400 },
        { nombre: 'Sensor ABS Bosch', cat: 4, prov: 1, stock: 1, minAlerta: 5, compra: 120, venta: 210 },
        { nombre: 'Amortiguadores Öhlins TTX', cat: 2, prov: 3, stock: 5, minAlerta: 2, compra: 4500, venta: 6800 },
        { nombre: 'Downpipe Akrapovič Inox', cat: 3, prov: 4, stock: 8, minAlerta: 3, compra: 3200, venta: 4950 },
    ];

    const productos = [];
    for (const p of productosData) {
        const producto = await prisma.producto.create({
            data: {
                nombre_repuesto: p.nombre,
                id_categoria: categorias[p.cat].id_categoria,
                id_proveedor: proveedores[p.prov].id_proveedor,
                stock_actual: p.stock,
                stock_minimo_alerta: p.minAlerta,
                url_imagen: null,
                precio: {
                    create: {
                        precio_compra: p.compra,
                        precio_venta: p.venta,
                    },
                },
            },
        });
        productos.push(producto);
    }
    console.log(`✅ ${productos.length} productos con precios creados`);

    // =============================================
    // 4. VENTAS CON DETALLES Y ABONOS
    // =============================================

    // Venta 1 — Pagada
    const venta1 = await prisma.venta.create({
        data: {
            id_cliente: clientes[0].id_cliente,
            id_usuario: usuarios[1].id_usuario, // María (vendedora)
            id_estado_pago: estadosPago[0].id_estado_pago, // Pagado
            monto_total: 5930.0,
            detalles: {
                create: [
                    { id_producto: productos[0].id_producto, cantidad: 2, precio_unitario_aplicado: 1520 },
                    { id_producto: productos[6].id_producto, cantidad: 4, precio_unitario_aplicado: 520 },
                    { id_producto: productos[8].id_producto, cantidad: 10, precio_unitario_aplicado: 89 },
                ],
            },
        },
    });
    console.log(`✅ Venta #${venta1.id_venta} creada (Pagada)`);

    // Venta 2 — Pendiente (fiado)
    const venta2 = await prisma.venta.create({
        data: {
            id_cliente: clientes[2].id_cliente, // Juan Pérez
            id_usuario: usuarios[1].id_usuario,
            id_estado_pago: estadosPago[1].id_estado_pago, // Pendiente
            monto_total: 8900.0,
            detalles: {
                create: [
                    { id_producto: productos[4].id_producto, cantidad: 1, precio_unitario_aplicado: 8900 },
                ],
            },
        },
    });
    console.log(`✅ Venta #${venta2.id_venta} creada (Pendiente)`);

    // Venta 3 — Abonado Parcial
    const venta3 = await prisma.venta.create({
        data: {
            id_cliente: clientes[3].id_cliente, // Taller Racing Pro
            id_usuario: usuarios[1].id_usuario,
            id_estado_pago: estadosPago[2].id_estado_pago, // Abonado Parcial
            monto_total: 12500.0,
            detalles: {
                create: [
                    { id_producto: productos[5].id_producto, cantidad: 1, precio_unitario_aplicado: 12500 },
                ],
            },
            abonos: {
                create: [
                    { monto_abonado: 5000.0 },
                    { monto_abonado: 2500.0 },
                ],
            },
        },
    });
    console.log(`✅ Venta #${venta3.id_venta} creada (Abonado Parcial con 2 abonos)`);

    // Venta 4 — Pagada
    const venta4 = await prisma.venta.create({
        data: {
            id_cliente: clientes[1].id_cliente,
            id_usuario: usuarios[0].id_usuario, // Carlos (admin)
            id_estado_pago: estadosPago[0].id_estado_pago,
            monto_total: 6300.0,
            detalles: {
                create: [
                    { id_producto: productos[2].id_producto, cantidad: 2, precio_unitario_aplicado: 3150 },
                ],
            },
        },
    });
    console.log(`✅ Venta #${venta4.id_venta} creada (Pagada)`);

    // =============================================
    // 5. HISTORIAL DE MOVIMIENTOS (KARDEX)
    // =============================================

    const movimientos = await Promise.all([
        // Entradas por compra
        prisma.historialMovimiento.create({
            data: {
                id_producto: productos[0].id_producto,
                id_usuario: usuarios[2].id_usuario, // Pedro (almacenero)
                id_tipo_mov: tiposMovimiento[0].id_tipo_mov, // Entrada por Compra
                cantidad: 50,
            },
        }),
        prisma.historialMovimiento.create({
            data: {
                id_producto: productos[2].id_producto,
                id_usuario: usuarios[2].id_usuario,
                id_tipo_mov: tiposMovimiento[0].id_tipo_mov,
                cantidad: 30,
            },
        }),
        prisma.historialMovimiento.create({
            data: {
                id_producto: productos[4].id_producto,
                id_usuario: usuarios[2].id_usuario,
                id_tipo_mov: tiposMovimiento[0].id_tipo_mov,
                cantidad: 10,
            },
        }),
        // Salidas por venta
        prisma.historialMovimiento.create({
            data: {
                id_producto: productos[0].id_producto,
                id_usuario: usuarios[1].id_usuario,
                id_tipo_mov: tiposMovimiento[1].id_tipo_mov, // Salida por Venta
                cantidad: 2,
            },
        }),
        prisma.historialMovimiento.create({
            data: {
                id_producto: productos[4].id_producto,
                id_usuario: usuarios[1].id_usuario,
                id_tipo_mov: tiposMovimiento[1].id_tipo_mov,
                cantidad: 1,
            },
        }),
        prisma.historialMovimiento.create({
            data: {
                id_producto: productos[5].id_producto,
                id_usuario: usuarios[1].id_usuario,
                id_tipo_mov: tiposMovimiento[1].id_tipo_mov,
                cantidad: 1,
            },
        }),
        // Ajuste de inventario
        prisma.historialMovimiento.create({
            data: {
                id_producto: productos[12].id_producto, // Sensor ABS (stock bajo)
                id_usuario: usuarios[0].id_usuario,
                id_tipo_mov: tiposMovimiento[2].id_tipo_mov, // Ajuste
                cantidad: -2,
            },
        }),
        // Devolución
        prisma.historialMovimiento.create({
            data: {
                id_producto: productos[6].id_producto,
                id_usuario: usuarios[2].id_usuario,
                id_tipo_mov: tiposMovimiento[3].id_tipo_mov, // Devolución
                cantidad: 2,
            },
        }),
    ]);
    console.log(`✅ ${movimientos.length} movimientos de kardex creados`);

    // =============================================
    // RESUMEN
    // =============================================
    console.log('\n📊 Resumen del seed:');
    console.log(`   • Roles:            ${roles.length}`);
    console.log(`   • Categorías:       ${categorias.length}`);
    console.log(`   • Tipos Movimiento: ${tiposMovimiento.length}`);
    console.log(`   • Estados de Pago:  ${estadosPago.length}`);
    console.log(`   • Usuarios:         ${usuarios.length}`);
    console.log(`   • Proveedores:      ${proveedores.length}`);
    console.log(`   • Clientes:         ${clientes.length}`);
    console.log(`   • Productos:        ${productos.length}`);
    console.log(`   • Ventas:           4`);
    console.log(`   • Movimientos:      ${movimientos.length}`);
    console.log('\n✅ Seed completado exitosamente 🎉');
}

main()
    .catch((e) => {
        console.error('❌ Error en el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
