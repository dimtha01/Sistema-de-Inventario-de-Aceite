import { prisma } from '../prisma.js';

export const getClientes = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany({
            include: {
                ventas: {
                    include: {
                        estado_pago: true,
                        abonos: true, // Incluimos abonos
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
            let saldoTotal = 0;
            const ventasMap = c.ventas.map(v => {
                const montoTotal = Number(v.monto_total);
                const totalAbonado = v.abonos.reduce((sum, ab) => sum + Number(ab.monto_abonado), 0);
                const saldoRestante = v.estado_pago.nombre_estado.toLowerCase() === 'pendiente' ? Math.max(0, montoTotal - totalAbonado) : 0;

                saldoTotal += saldoRestante;

                return {
                    id_venta: v.id_venta,
                    fecha: new Date(v.fecha_venta).toLocaleDateString(),
                    monto: montoTotal,
                    abonado: totalAbonado,
                    saldo_restante: saldoRestante,
                    estado: v.estado_pago.nombre_estado,
                    detalles: v.detalles.map(d => ({
                        producto: d.producto?.nombre_repuesto || 'Producto ' + d.id_producto,
                        cantidad: d.cantidad,
                        precio: Number(d.precio_unitario_aplicado)
                    }))
                };
            });

            return {
                id_cliente: c.id_cliente,
                nombre: c.nombre,
                apellido: c.apellido,
                telefono: c.telefono,
                limite_credito: Number(c.limite_credito),
                saldo: saldoTotal,
                estado: saldoTotal > 0 ? "pendiente" : "aldia",
                ultimaCompra: c.ventas.length > 0 ? new Date(c.ventas[0].fecha_venta).toLocaleDateString() : null,
                ventas: ventasMap
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
                id_cliente: c.id_cliente,
                nombre: c.nombre,
                apellido: c.apellido,
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

export const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await prisma.cliente.findUnique({
            where: { id_cliente: Number(id) },
            include: {
                ventas: {
                    include: {
                        estado_pago: true,
                        abonos: true,
                        detalles: {
                            include: {
                                producto: true
                            }
                        }
                    },
                    orderBy: { fecha_venta: 'desc' }
                }
            }
        });

        if (!cliente) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }

        // Calcular saldo
        let saldoTotal = 0;
        const ventasMap = cliente.ventas.map(v => {
            const montoTotal = Number(v.monto_total);
            const totalAbonado = v.abonos.reduce((sum, ab) => sum + Number(ab.monto_abonado), 0);
            const saldoRestante = v.estado_pago.nombre_estado.toLowerCase() === 'pendiente' ? Math.max(0, montoTotal - totalAbonado) : 0;

            saldoTotal += saldoRestante;

            return {
                id_venta: v.id_venta,
                fecha: new Date(v.fecha_venta).toLocaleDateString(),
                monto: montoTotal,
                abonado: totalAbonado,
                saldo_restante: saldoRestante,
                estado: v.estado_pago.nombre_estado,
                detalles: v.detalles.map(d => ({
                    producto: d.producto?.nombre_repuesto || 'Producto ' + d.id_producto,
                    cantidad: d.cantidad,
                    precio: Number(d.precio_unitario_aplicado)
                }))
            };
        });

        const formatted = {
            id_cliente: cliente.id_cliente,
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            telefono: cliente.telefono,
            limite_credito: Number(cliente.limite_credito),
            saldo: saldoTotal,
            estado: saldoTotal > 0 ? "pendiente" : "aldia",
            ultimaCompra: cliente.ventas.length > 0 ? new Date(cliente.ventas[0].fecha_venta).toLocaleDateString() : null,
            ventas: ventasMap
        };

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener cliente' });
    }
};

export const registrarAbono = async (req, res) => {
    try {
        const { id_venta, monto } = req.body;
        const montoNum = Number(monto);

        if (!id_venta || isNaN(montoNum) || montoNum <= 0) {
            return res.status(400).json({ success: false, message: 'Datos inválidos para el abono' });
        }

        const venta = await prisma.venta.findUnique({
            where: { id_venta: Number(id_venta) },
            include: { abonos: true, estado_pago: true }
        });

        if (!venta) return res.status(404).json({ success: false, message: 'Venta no encontrada' });
        if (venta.estado_pago.nombre_estado.toLowerCase() !== 'pendiente') {
            return res.status(400).json({ success: false, message: 'La venta ya está pagada o no es pendiente' });
        }

        const totalMonto = Number(venta.monto_total);
        const yaAbonado = venta.abonos.reduce((sum, ab) => sum + Number(ab.monto_abonado), 0);
        const saldoRestante = totalMonto - yaAbonado;

        if (montoNum > saldoRestante + 0.01) {
            return res.status(400).json({ success: false, message: `El monto excede el saldo restante ($${saldoRestante})` });
        }

        await prisma.$transaction(async (tx) => {
            // Registrar abono
            await tx.abonoCredito.create({
                data: {
                    id_venta: Number(id_venta),
                    monto_abonado: montoNum
                }
            });

            // Si pagó el total (con tolerancia flotante de 1 centavo), cambiamos a pagado
            if (montoNum >= saldoRestante - 0.01) {
                const estPagado = await tx.estadoPago.findFirst({ where: { nombre_estado: { contains: 'pagado', mode: 'insensitive' } } });
                if (estPagado) {
                    await tx.venta.update({
                        where: { id_venta: Number(id_venta) },
                        data: { id_estado_pago: estPagado.id_estado_pago }
                    });
                }
            }
        });

        res.status(200).json({ success: true, message: 'Abono registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error interno al registrar el abono' });
    }
};
