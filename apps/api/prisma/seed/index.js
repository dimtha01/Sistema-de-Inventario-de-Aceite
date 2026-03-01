/**
 * Seed Principal - Sistema de Inventario
 *
 * Este script inicializa la base de datos con datos aleatorios generados por Faker.
 * La estructura está modularizada por entidad en archivos separados.
 *
 * Los datos generados incluyen:
 * - Categorías de repuestos automotrices
 * - Proveedores con marcas reales y generadas
 * - Clientes con límites de crédito variables
 * - Productos con precios, stock y alertas
 * - Usuarios con contraseñas hasheadas
 * - Ventas con detalles y abonos
 * - Movimientos de kardex
 *
 * Estructura de carpetas:
 * seed/
 * ├── index.js           (este archivo - orquestador)
 * ├── roles.js           (roles de usuario)
 * ├── categorias.js      (categorías de productos)
 * ├── tiposMovimiento.js (tipos de movimiento del kardex)
 * ├── estadosPago.js     (estados de pago de ventas)
 * ├── usuarios.js        (usuarios con contraseñas hasheadas)
 * ├── proveedores.js     (proveedores de repuestos)
 * ├── clientes.js        (clientes del sistema)
 * ├── productos.js       (productos con precios)
 * ├── ventas.js          (ventas con detalles y abonos)
 * └── movimientos.js     (historial de movimientos de inventario)
 */

import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Importar módulos de seed
import { seedRoles } from './roles.js';
import { seedCategorias } from './categorias.js';
import { seedTiposMovimiento } from './tiposMovimiento.js';
import { seedEstadosPago } from './estadosPago.js';
import { seedUsuarios } from './usuarios.js';
import { seedProveedores } from './proveedores.js';
import { seedClientes } from './clientes.js';
import { seedProductos } from './productos.js';
import { seedVentas } from './ventas.js';
import { seedMovimientos } from './movimientos.js';

// Configurar Prisma con adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Limpia todas las tablas de la base de datos
 * Orden inverso por dependencias (foreign keys)
 */
async function limpiarTablas() {
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

    console.log('🗑️  Tablas limpiadas\n');
}

/**
 * Función principal que ejecuta todos los seeds
 */
async function main() {
    console.log('🌱 Iniciando seed de la base de datos con Faker...\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Paso 1: Limpiar tablas existentes
    await limpiarTablas();

    // Paso 2: Crear catálogos básicos (sin dependencias)
    console.log('📁 Creando catálogos básicos...');
    const roles = await seedRoles(prisma);
    const categorias = await seedCategorias(prisma);
    const tiposMovimiento = await seedTiposMovimiento(prisma);
    const estadosPago = await seedEstadosPago(prisma);
    console.log();

    // Paso 3: Crear entidades principales (con dependencias de catálogos)
    console.log('👥 Creando entidades principales...');
    const usuarios = await seedUsuarios(prisma, roles);
    const proveedores = await seedProveedores(prisma);
    const clientes = await seedClientes(prisma);
    console.log();

    // Paso 4: Crear productos (depende de categorías y proveedores)
    console.log('📦 Creando productos y precios...');
    const productos = await seedProductos(prisma, categorias, proveedores);
    console.log();

    // Paso 5: Crear ventas (depende de clientes, usuarios, estadosPago, productos)
    console.log('💰 Creando ventas con detalles...');
    const ventas = await seedVentas(prisma, clientes, usuarios, estadosPago, productos);
    console.log();

    // Paso 6: Crear movimientos de kardex (depende de productos, usuarios, tiposMovimiento)
    console.log('📊 Creando historial de movimientos (kardex)...');
    const movimientos = await seedMovimientos(prisma, productos, usuarios, tiposMovimiento);
    console.log();

    // Resumen final
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Resumen del seed:');
    console.log(`   • Roles:             ${roles.length}`);
    console.log(`   • Categorías:        ${categorias.length}`);
    console.log(`   • Tipos Movimiento:  ${tiposMovimiento.length}`);
    console.log(`   • Estados de Pago:   ${estadosPago.length}`);
    console.log(`   • Usuarios:          ${usuarios.length}`);
    console.log(`   • Proveedores:       ${proveedores.length}`);
    console.log(`   • Clientes:          ${clientes.length}`);
    console.log(`   • Productos:         ${productos.length}`);
    console.log(`   • Ventas:            ${ventas.length}`);
    console.log(`   • Movimientos:       ${movimientos.length}`);
    console.log('\n✅ Seed completado exitosamente 🎉\n');

    console.log('🔑 Credenciales de prueba (verificar en la salida anterior):');
    console.log('   • Las contraseñas se muestran al crear cada usuario');
    console.log('   • Usuarios adicionales tienen contraseñas aleatorias\n');
}

// Ejecutar seed
main()
    .catch((e) => {
        console.error('\n❌ Error en el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
