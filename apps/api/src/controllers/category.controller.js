import { prisma } from '../prisma.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.categoria.findMany({
            include: {
                productos: { include: { precio: true } }
            },
            orderBy: { id_categoria: 'desc' }
        });

        // Mapear al formato del frontend sin colores falsos
        const formattedCategories = categories.map((cat) => {
            const totalProducts = cat.productos.length;
            const stockValue = cat.productos.reduce((acc, curr) => {
                const stock = curr.stock_actual || 0;
                const price = curr.precio?.precio_compra ? Number(curr.precio.precio_compra) : 0;
                return acc + (stock * price);
            }, 0);

            // Calcular el estado
            let estado = "Óptimo";
            const numAlerts = cat.productos.filter(p => p.stock_actual <= p.stock_minimo_alerta).length;
            if (numAlerts > 0 && numAlerts < (totalProducts / 2)) {
                estado = "Revisar stock";
            } else if (numAlerts >= (totalProducts / 2) && totalProducts > 0) {
                estado = "Crítico";
            }

            return {
                id: cat.id_categoria,
                nombre: cat.nombre_categoria,
                productos: totalProducts,
                stockValor: `$${stockValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                estado: estado
            };
        });

        return res.status(200).json({ success: true, data: formattedCategories });
    } catch (error) {
        console.error('Error in getCategories:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener categorias' });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) return res.status(400).json({ success: false, message: 'Falta el nombre' });

        const newCategory = await prisma.categoria.create({
            data: { nombre_categoria: nombre }
        });

        return res.status(201).json({ 
            success: true, 
            data: {
                id: newCategory.id_categoria,
                nombre: newCategory.nombre_categoria,
                productos: 0,
                stockValor: '$0.00',
                estado: 'Óptimo'
            } 
        });
    } catch (error) {
        console.error('Error in createCategory:', error);
        return res.status(500).json({ success: false, message: 'Error al crear categoria' });
    }
};