/**
 * Módulo de Usuarios
 * Crea usuarios con datos generados por Faker y contraseñas hasheadas
 */

import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
faker.locale = 'es';

const ROLES = [
    { nombre: 'Administrador', password: 'Admin123' },
    { nombre: 'Vendedor', password: 'Vendedor123' },
    { nombre: 'Almacenero', password: 'Almacen123' },
];

export async function seedUsuarios(prisma, roles) {
    const usuarios = [];

    // Crear usuarios para cada rol
    for (let i = 0; i < roles.length; i++) {
        const rol = roles[i];
        const roleConfig = ROLES[i];

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = firstName.toLowerCase() + '.' + lastName.toLowerCase();
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();

        const password_hash = await bcrypt.hash(roleConfig.password, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nombre: firstName,
                apellido: lastName,
                email: email,
                username: username,
                password_hash: password_hash,
                id_rol: rol.id_rol,
            },
        });
        usuarios.push(usuario);

        console.log(`   • Usuario creado: ${username} (${roleConfig.password}) - ${rol.nombre_rol}`);
    }

    // Crear usuarios adicionales aleatorios
    const usuariosExtraCount = faker.number.int({ min: 3, max: 7 });
    for (let i = 0; i < usuariosExtraCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();
        const password = faker.internet.password({ length: 8, memorable: true });
        const rolAleatorio = roles[faker.number.int({ min: 0, max: roles.length - 1 })];

        const password_hash = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nombre: firstName,
                apellido: lastName,
                email: email,
                username: username,
                password_hash: password_hash,
                id_rol: rolAleatorio.id_rol,
            },
        });
        usuarios.push(usuario);

        console.log(`   • Usuario extra: ${username} (${password}) - ${rolAleatorio.nombre_rol}`);
    }

    console.log(`✅ ${usuarios.length} usuarios creados`);
    return usuarios;
}
