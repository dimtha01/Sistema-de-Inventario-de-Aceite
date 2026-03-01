/**
 * Módulo de Roles
 * Crea los roles de usuario del sistema
 */

export async function seedRoles(prisma) {
    const roles = await Promise.all([
        prisma.rolUsuario.create({ data: { nombre_rol: 'Administrador' } }),
        prisma.rolUsuario.create({ data: { nombre_rol: 'Vendedor' } }),
        prisma.rolUsuario.create({ data: { nombre_rol: 'Almacenero' } }),
    ]);

    console.log(`✅ ${roles.length} roles creados`);
    return roles;
}
