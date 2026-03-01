/**
 * Módulo de Productos
 * Crea productos con datos generados por Faker
 */

import { faker } from '@faker-js/faker';
faker.locale = 'es';

const PARTES_AUTOMOTRICES = [
    { base: 'Disco de Freno', prefijos: ['Carbono Cerámico', 'Ventilado', 'Perforado', ''] },
    { base: 'Pastillas de Freno', prefijos: ['Cerámicas', 'Metálicas', 'Semi-metálicas', ''] },
    { base: 'Amortiguadores', prefijos: ['Gas', 'Hidráulicos', 'Ajustables', 'Deportivos'] },
    { base: 'Kit de Embrague', prefijos: ['Reforzado', 'Deportivo', 'Carreras', ''] },
    { base: 'Filtro de Aire', prefijos: ['Alto Flujo', 'Rendimiento', 'Deportivo', ''] },
    { base: 'Bobina de Encendido', prefijos: ['Alta Energía', 'Potencia', 'Rendimiento', ''] },
    { base: 'Sensor', prefijos: ['ABS', 'Oxígeno', 'Temperatura', 'Presión'] },
    { base: 'Neumáticos', prefijos: ['Deportivos', 'All Season', 'Invierno', 'Verano'] },
    { base: 'Sistema de Escape', prefijos: ['Titanio', 'Inoxidable', 'Deportivo', 'Rendimiento'] },
    { base: 'Bomba de Combustible', prefijos: ['Alto Flujo', 'Eléctrica', 'Mecánica', ''] },
    { base: 'Alternador', prefijos: ['Alta Potencia', 'Reforzado', 'Deportivo', ''] },
    { base: 'Radiador', prefijos: ['Alto Rendimiento', 'Aluminio', 'Reforzado', ''] },
    { base: 'Turbo', prefijos: ['Garrett', 'Holset', 'K Series', ''] },
    { base: 'Intercooler', prefijos: ['Front Mount', 'Top Mount', 'Bar and Plate', ''] },
    { base: 'Faro LED', prefijos: ['Laser Matrix', 'Adaptive', 'Angel Eyes', ''] },
    { base: 'Batería', prefijos: ['AGM', 'Litio', 'Deep Cycle', ''] },
    { base: 'Correa de Distribución', prefijos: ['', '', '', ''] },
    { base: 'Aceite de Motor', prefijos: ['Sintético', 'Semi-sintético', 'Mineral', 'Racing'] },
    { base: 'Bujía', prefijos: ['Iridium', 'Platino', 'Cobre', 'Doble Platino'] },
    { base: 'Termostato', prefijos: ['Alta Temperatura', 'Baja Temperatura', 'Racing', ''] },
];

export async function seedProductos(prisma, categorias, proveedores) {
    const productosCount = faker.number.int({ min: 20, max: 50 });
    const productos = [];
    const nombresUsados = new Set();

    for (let i = 0; i < productosCount; i++) {
        const categoria = faker.helpers.arrayElement(categorias);
        const proveedor = faker.helpers.arrayElement(proveedores);

        // Generar nombre único de producto
        let nombre;
        let intentos = 0;
        do {
            const parte = faker.helpers.arrayElement(PARTES_AUTOMOTRICES);
            const prefijo = faker.helpers.arrayElement(parte.prefijos);
            nombre = prefijo ? `${prefijo} ${parte.base}` : parte.base;
            intentos++;
        } while (nombresUsados.has(nombre) && intentos < 50);

        nombresUsados.add(nombre);

        // Generar precios realistas
        const precioCompra = faker.number.float({ min: 50, max: 8000, fractionDigits: 2 });
        const precioVenta = precioCompra * faker.number.float({ min: 1.3, max: 1.8, fractionDigits: 2 });

        // Stock y alerta
        const stock = faker.number.int({ min: 0, max: 100 });
        const minAlerta = faker.number.int({ min: 3, max: 15 });

        // Generar URL de imagen aleatoria de autopartes
        const url_imagen = faker.image.urlLoremFlickr({
            category: 'automotive',
            width: 400,
            height: 300,
            randomizeUrl: true,
        });

        const producto = await prisma.producto.create({
            data: {
                nombre_repuesto: nombre,
                id_categoria: categoria.id_categoria,
                id_proveedor: proveedor.id_proveedor,
                stock_actual: stock,
                stock_minimo_alerta: minAlerta,
                url_imagen: url_imagen,
                precio: {
                    create: {
                        precio_compra: precioCompra,
                        precio_venta: precioVenta,
                    },
                },
            },
        });
        productos.push(producto);
    }

    console.log(`✅ ${productos.length} productos con precios creados`);
    return productos;
}
