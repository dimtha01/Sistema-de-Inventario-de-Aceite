/**
 * Módulo de Clientes
 * Crea clientes con datos generados por Faker
 */

import { faker } from '@faker-js/faker';
faker.locale = 'es';

export async function seedClientes(prisma) {
    const clientesCount = faker.number.int({ min: 10, max: 25 });
    const clientes = [];

    for (let i = 0; i < clientesCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const telefono = faker.phone.number('+### ### ####');

        // Limite de crédito aleatorio entre 1,000 y 100,000
        const limite_credito = faker.number.float({
            min: 1000,
            max: 100000,
            fractionDigits: 2,
        });

        const cliente = await prisma.cliente.create({
            data: {
                nombre: firstName,
                apellido: lastName,
                telefono: telefono,
                limite_credito: limite_credito,
            },
        });
        clientes.push(cliente);
    }

    console.log(`✅ ${clientes.length} clientes creados`);
    return clientes;
}
