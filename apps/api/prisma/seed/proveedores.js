/**
 * Módulo de Proveedores
 * Crea proveedores con datos generados por Faker
 */

import { faker } from '@faker-js/faker';
faker.locale = 'es';

const PAISES = [
    'Alemania', 'Italia', 'Francia', 'España', 'Japón',
    'Estados Unidos', 'Reino Unido', 'Suecia', 'Suiza', 'Bélgica',
    'Países Bajos', 'Corea del Sur', 'Taiwán', 'México', 'Brasil'
];

const MARCAS_AUTOPARTES = [
    'Brembo', 'Bosch', 'Michelin', 'Öhlins', 'Akrapovič',
    'MagnaFlow', 'K&N', 'Mobil', 'Castrol', 'NGK',
    'Denso', 'Valeo', 'Hella', 'Bilstein', 'Eibach',
    'AP Racing', 'Ferodo', 'ATE', 'Lucas', 'Wagner'
];

export async function seedProveedores(prisma) {
    const proveedoresCount = faker.number.int({ min: 8, max: 15 });
    const proveedores = [];
    const marcasUsadas = new Set();

    // Primero usar marcas conocidas
    for (const marca of MARCAS_AUTOPARTES) {
        if (proveedores.length >= proveedoresCount) break;

        const nombreEmpresa = `${marca} ${faker.company.buzzNoun().replace(/^[aeiou]/i, match => match.toUpperCase())}`.trim();
        const pais = faker.helpers.arrayElement(PAISES);

        const proveedor = await prisma.proveedor.create({
            data: {
                nombre_empresa: nombreEmpresa,
                direccion: `${faker.location.city()}, ${pais}`,
                telefono: faker.phone.number('+## ### ######'),
            },
        });
        proveedores.push(proveedor);
        marcasUsadas.add(marca);
    }

    // Completar con proveedores aleatorios
    while (proveedores.length < proveedoresCount) {
        const nombreEmpresa = faker.company.name();
        const pais = faker.helpers.arrayElement(PAISES);

        const proveedor = await prisma.proveedor.create({
            data: {
                nombre_empresa: nombreEmpresa,
                direccion: `${faker.location.city()}, ${pais}`,
                telefono: faker.phone.number('+## ### ######'),
            },
        });
        proveedores.push(proveedor);
    }

    console.log(`✅ ${proveedores.length} proveedores creados`);
    return proveedores;
}
