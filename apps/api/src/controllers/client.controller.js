import { prisma } from '../prisma.js';

export const getClientes = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany({
            include: {
                ventas: {
                    include: {
                        estado_pago: true,
                        detalles: {
                            include: {
                                producto: true
                            }
                        }
                    },
                    orderBy: { fecha_venta: 'desc' }
                }
            },
            orderBy: {
                id_cliente: 'desc'
            }
        });

        const formatted = clientes.map(c => {
            const ventasPendientes = c.ventas.filter(v => v.estado_pago.nombre_estado.toLowerCase() === 'pendiente');
            const saldo = ventasPendientes.reduce((acc, v) => acc + Number(v.monto_total), 0);

            return {
                id: c.id_cliente,
                nombre: `${c.nombre} ${c.apellido}`,
                telefono: c.telefono,
                limite_credito: Number(c.limite_credito),
                saldo: saldo,
                estado: saldo > 0 ? "pendiente" : "aldia",
                ultimaCompra: c.ventas.length > 0 ? new Date(c.ventas[0].fecha_venta).toLocaleDateString() : null,
                ventas: c.ventas.map(v => ({
                    id_venta: v.id_venta,
                    fecha: new Date(v.fecha_venta).toLocaleDateString(),
                    monto: Number(v.monto_total),
                    estado: v.estado_pago.nombre_estado,
                    detalles: v.detalles.map(d => ({
                        producto: d.producto?.nombre_repuesto || 'Producto ' + d.id_producto,
                        cantidad: d.cantidad,
                        precio: Number(d.precio_unitario_aplicado)
                    }))
                }))
            };
        });

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener clientes' });
    }
};

export const createCliente = async (req, res) => {
    try {
        const { nombre, apellido, telefono, limite_credito } = req.body;

        if (!nombre || !apellido || !telefono) {
            return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
        }

        const c = await prisma.cliente.create({
            data: {
                nombre,
                apellido,
                telefono,
                limite_credito: Number(limite_credito) || 0,
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: c.id_cliente,
                nombre: `${c.nombre} ${c.apellido}`,
                telefono: c.telefono,
                limite_credito: Number(c.limite_credito),
                saldo: 0,
                estado: "aldia", // Empieza al día
                ultimaCompra: null,
                ventas: []
            }
        });
    } catch (error) {
        console.error('Error in createCliente:', error);
        res.status(500).json({ success: false, message: 'Error al crear cliente' });
    }
};
