import { prisma } from '../prisma.js';

// Obtiene los datos iniciales necesarios para la pantalla del Punto de Venta (POS)
export const getPosData = async (req, res) => {
    try {
        const [productosRaw, clientes, estadosPago] = await Promise.all([
            prisma.producto.findMany({
                where: { stock_actual: { gt: 0 } }, // Solo productos con stock
                include: {
                    precio: true,
                    categoria: true
                },
                orderBy: { id_producto: 'desc' }
            }),
            prisma.cliente.findMany({
                orderBy: { nombre: 'asc' }
            }),
            prisma.estadoPago.findMany()
        ]);

        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

        const productos = productosRaw.map(p => {
            let imageUrl = '';

            if (p.url_imagen) {
                const imagePath = p.url_imagen.replace(/\\/g, '/');
                // Si ya tiene protocolo (http/https), usar tal cual. Si no, agregar BACKEND_URL
                imageUrl = imagePath.startsWith('http://') || imagePath.startsWith('https://')
                    ? imagePath
                    : `${BACKEND_URL}/${imagePath.replace(/^\/+/, '')}`;
            }

            return {
                id_producto: p.id_producto,
                nombre: p.nombre_repuesto,
                stock: p.stock_actual,
                precioVenta: p.precio?.precio_venta ? Number(p.precio.precio_venta) : 0,
                imagen: imageUrl,
                categoria: p.categoria?.nombre_categoria || 'General'
            };
        });

        res.status(200).json({
            success: true,
            data: { productos, clientes, estadosPago }
        });
    } catch (error) {
        console.error("Error obteniendo datos para POS:", error);
        res.status(500).json({ success: false, message: 'Error cargando datos del sistema' });
    }
};

// Genera una nueva venta
export const createVenta = async (req, res) => {
    try {
        const { id_cliente, id_estado_pago, productos, abono_inicial, id_usuario: reqUsuario } = req.body;

        // El id_usuario ahora lo tomamos de la petición, con un fallback a 1 por seguridad
        const id_usuario = parseInt(reqUsuario) || 1;

        if (!id_cliente || !id_estado_pago || !productos || productos.length === 0) {
            return res.status(400).json({ success: false, message: 'Datos incompletos para la venta' });
        }

        // Ejecutar transacción pesada de forma atómica para no romper la base de datos si algo falla
        const venta = await prisma.$transaction(async (tx) => {

            // 1. Calcular Monto Total y verificar stocks
            let montoTotal = 0;
            const detallesData = [];
            const movimientosData = [];

            for (const item of productos) {
                const prod = await tx.producto.findUnique({
                    where: { id_producto: item.id_producto },
                    include: { precio: true }
                });

                if (!prod) {
                    throw new Error(`El producto con ID ${item.id_producto} no existe.`);
                }

                if (prod.stock_actual < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ${prod.nombre_repuesto} (Disponible: ${prod.stock_actual})`);
                }

                const precioUnitario = prod.precio?.precio_venta ? Number(prod.precio.precio_venta) : 0;
                montoTotal += precioUnitario * item.cantidad;

                // Preparar Detalle de Venta
                detallesData.push({
                    id_producto: prod.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario_aplicado: precioUnitario
                });

                // TIPO MOVIMIENTO SALIDA - Buscar o crear si no existe
                let tipoSalida = await tx.tipoMovimiento.findFirst({
                    where: { nombre_tipo: { contains: 'salida', mode: 'insensitive' } }
                });

                if (!tipoSalida) {
                    tipoSalida = await tx.tipoMovimiento.create({
                        data: { nombre_tipo: 'Salida por Venta' }
                    });
                }

                const id_tipo_mov = tipoSalida.id_tipo_mov;

                // Preparar Historial
                movimientosData.push({
                    id_producto: prod.id_producto,
                    id_usuario: id_usuario,
                    id_tipo_mov: id_tipo_mov,
                    cantidad: item.cantidad // Positivo o negativo, si es salida a veces se registra positivo pero el sistema lo interpreta como salida
                });

                // Restar el Stock Directamente
                await tx.producto.update({
                    where: { id_producto: prod.id_producto },
                    data: { stock_actual: prod.stock_actual - item.cantidad }
                });
            }

            // 2. Crear Registro de Venta Principal
            const nuevaVenta = await tx.venta.create({
                data: {
                    id_cliente: Number(id_cliente),
                    id_usuario: id_usuario,
                    id_estado_pago: Number(id_estado_pago),
                    monto_total: montoTotal,
                    detalles: {
                        create: detallesData
                    }
                },
                include: {
                    cliente: true,
                    estado_pago: true,
                    detalles: true
                }
            });

            // 3. Crear Historiales
            await tx.historialMovimiento.createMany({
                data: movimientosData
            });

            // 4. Registrar Abono Inicial (Si Aplica)
            const estadoActual = await tx.estadoPago.findUnique({ where: { id_estado_pago: Number(id_estado_pago) } });

            if (estadoActual && estadoActual.nombre_estado.toLowerCase() === 'pendiente') {
                const abonoInicialNum = Number(abono_inicial) || 0;

                if (abonoInicialNum > 0) {
                    await tx.abonoCredito.create({
                        data: {
                            id_venta: nuevaVenta.id_venta,
                            monto_abonado: abonoInicialNum
                        }
                    });

                    // Si el abono inicial cubre toda o más de la deuda, la venta se pasa a Pagado inmediatamente
                    if (abonoInicialNum >= montoTotal - 0.01) {
                        const estPagado = await tx.estadoPago.findFirst({ where: { nombre_estado: { contains: 'pagado', mode: 'insensitive' } } });
                        if (estPagado) {
                            await tx.venta.update({
                                where: { id_venta: nuevaVenta.id_venta },
                                data: { id_estado_pago: estPagado.id_estado_pago }
                            });
                        }
                    }
                }
            }

            return nuevaVenta;
        }, {
            maxWait: 10000,
            timeout: 20000
        });

        res.status(201).json({
            success: true,
            data: venta,
            message: 'Venta generada exitosamente'
        });

    } catch (error) {
        console.error("Error creando venta:", error);
        res.status(400).json({ success: false, message: error.message || 'Error al procesar la venta' });
    }
};
