/**
 * Módulo de Categorías
 * Crea categorías de repuestos automotrices con datos generados por Faker
 */

import { faker } from '@faker-js/faker';
faker.locale = 'es';

const CATEGORIAS_BASE = [
    'Frenos', 'Motor', 'Suspensión', 'Escape', 'Eléctrico',
    'Transmisión', 'Dirección', 'Refrigeración', 'Carrocería', 'Accesorios'
];

export async function seedCategorias(prisma) {
    const categoriasCount = faker.number.int({ min: 6, max: 10 });
    const categorias = [];

    // Usar categorías base y mezclar
    const categoriasMezcladas = faker.helpers.shuffle(CATEGORIAS_BASE);

    for (let i = 0; i < categoriasCount; i++) {
        const nombre = categoriasMezcladas[i];

        const categoria = await prisma.categoria.create({
            data: { nombre_categoria: nombre },
        });
        categorias.push(categoria);
    }

    console.log(`✅ ${categorias.length} categorías creadas`);
    return categorias;
}
