import { prisma } from '../prisma.js';

export const getProviders = async (req, res) => {
    try {
        const providers = await prisma.proveedor.findMany({
            include: {
                _count: {
                    select: { productos: true }
                }
            },
            orderBy: {
                id_proveedor: 'desc'
            }
        });

        const formatted = providers.map(p => ({
            id: p.id_proveedor,
            nombre: p.nombre_empresa,
            direccion: p.direccion || '—',
            telefono: p.telefono || '—',
            productos: p._count.productos,
        }));

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        console.error('Error in getProviders:', error);
        res.status(500).json({ success: false, message: 'Error al obtener proveedores' });
    }
};

export const createProvider = async (req, res) => {
    try {
        const { nombre_empresa, direccion, telefono } = req.body;

        if (!nombre_empresa) {
            return res.status(400).json({ success: false, message: 'El nombre de la empresa es obligatorio' });
        }

        const p = await prisma.proveedor.create({
            data: {
                nombre_empresa,
                direccion,
                telefono
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: p.id_proveedor,
                nombre: p.nombre_empresa,
                direccion: p.direccion || '—',
                telefono: p.telefono || '—',
                productos: 0,
                descripcion: 'Proveedor oficial de repuestos y componentes automotrices.',
                logo: null
            }
        });
    } catch (error) {
        console.error('Error in createProvider:', error);
        res.status(500).json({ success: false, message: 'Error al crear proveedor' });
    }
};

export const deleteProvider = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si tiene productos asociados
        const productsCount = await prisma.producto.count({
            where: { id_proveedor: Number(id) }
        });

        if (productsCount > 0) {
            return res.status(400).json({ success: false, message: 'No se puede eliminar el proveedor porque tiene productos asociados.' });
        }

        await prisma.proveedor.delete({
            where: { id_proveedor: Number(id) }
        });

        return res.status(200).json({ success: true, message: 'Proveedor eliminado exitosamente' });
    } catch (error) {
        console.error('Error in deleteProvider:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar proveedor' });
    }
};
