import {prisma} from '../prisma.js';

// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const products = await prisma.producto.findMany({
            include: {
                precio: true,
                categoria: true,
                proveedor: true,
            },
            // Ordenar por los más recientes primero mejora la experiencia de usuario
            orderBy: {
                id_producto: 'desc'
            }
        });

        // Definimos la URL base del backend. Asegúrate de tener esta variable en tu .env
        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

        // Mapear al formato esperado por el frontend
        const formatedProducts = products.map((p) => {
            // Limpiamos la ruta por si se guardó con barras invertidas (típico en Windows)
            const cleanImagePath = p.url_imagen ? p.url_imagen.replace(/\\/g, '/') : '';
            
            // Construimos la URL absoluta
            const imageUrl = cleanImagePath 
                ? (cleanImagePath.startsWith('http') ? cleanImagePath : `${BACKEND_URL}/${cleanImagePath}`) 
                : '';

            return {
                id_producto: p.id_producto,
                nombre: p.nombre_repuesto,
                stock: p.stock_actual,
                stockColor: p.stock_actual <= p.stock_minimo_alerta ? 'text-orange-500' : 'text-slate-900',
                imagen: imageUrl, // Aquí enviamos la ruta ya corregida
                precioCompra: p.precio?.precio_compra ? Number(p.precio.precio_compra) : 0,
                precioVenta: p.precio?.precio_venta ? Number(p.precio.precio_venta) : 0,
                categoria: p.categoria?.nombre_categoria || 'Generico',
                proveedor: p.proveedor?.nombre_empresa || 'Generico',
            };
        });

        return res.status(200).json({ success: true, data: formatedProducts });
    } catch (error) {
        console.error("Error in getProducts:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Error al obtener productos",
        });
    }
};

export const createProduct = async (req, res) => {
  try {
    const {
      nombre,
      stock,
      id_categoria,
      id_proveedor,
      precioCompra,
      precioVenta,
    } = req.body;

    // 1. Conversión hiper-segura de los IDs
    const safeCategoria = Number(id_categoria);
    const safeProveedor = Number(id_proveedor);

    if (!nombre || isNaN(safeCategoria) || isNaN(safeProveedor)) {
      return res.status(400).json({ 
        success: false, 
        message: "Faltan campos obligatorios o los IDs no son válidos. Verifica tener categorías y proveedores creados." 
      });
    }

    const imagenUrl = req.file ? `uploads/${req.file.filename}` : null;

    // 2. Limpieza de números para evitar que un "" rompa Prisma
    const safeStock = stock ? Number(stock) : 0;
    const safeCompra = precioCompra ? Number(precioCompra) : 0;
    const safeVenta = precioVenta ? Number(precioVenta) : 0;

    // 3. Transacción protegida contra timeouts
    const newProduct = await prisma.$transaction(async (tx) => {
      const p = await tx.producto.create({
        data: {
          nombre_repuesto: nombre,
          stock_actual: safeStock,
          stock_minimo_alerta: 5,
          url_imagen: imagenUrl,
          id_categoria: safeCategoria,
          id_proveedor: safeProveedor,
        },
      });

      await tx.precioProducto.create({
        data: {
          id_producto: p.id_producto,
          precio_compra: safeCompra,
          precio_venta: safeVenta,
        },
      });

      return tx.producto.findUnique({
        where: { id_producto: p.id_producto },
        include: { precio: true, categoria: true, proveedor: true },
      });
    }, 
    {
      maxWait: 10000, 
      timeout: 20000, 
    });

    // 4. Formatear para el Frontend (evitando doble barra en la imagen)
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
    const cleanImagePath = newProduct.url_imagen ? newProduct.url_imagen.replace(/\\/g, '/').replace(/^\/+/, '') : '';
    const imageUrlFormatted = cleanImagePath ? `${BACKEND_URL}/${cleanImagePath}` : '';

    const formatted = {
      id_producto: newProduct.id_producto,
      nombre: newProduct.nombre_repuesto,
      stock: newProduct.stock_actual,
      stockColor: newProduct.stock_actual <= newProduct.stock_minimo_alerta ? "text-orange-500" : "text-slate-900",
      imagen: imageUrlFormatted,
      precioCompra: newProduct.precio?.precio_compra ? Number(newProduct.precio.precio_compra) : 0,
      precioVenta: newProduct.precio?.precio_venta ? Number(newProduct.precio.precio_venta) : 0,
      
      // Enviamos los IDs para que el modo "Edición" funcione perfectamente
      id_categoria: newProduct.id_categoria,
      id_proveedor: newProduct.id_proveedor,
      
      categoria: newProduct.categoria?.nombre_categoria || "Generico",
      proveedor: newProduct.proveedor?.nombre_empresa || "Generico",
    };

    return res.status(201).json({ success: true, data: formatted });
  } catch (error) {
    console.error("🔥 Error crítico en createProduct:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor al crear producto" 
    });
  }
};

// Actualizar producto existente (PUT)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            stock,
            id_categoria,
            id_proveedor,
            precioCompra,
            precioVenta,
        } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "ID del producto requerido" });
        }

        // Buscamos el producto actual para saber si ya tenía imagen
        const existingProduct = await prisma.producto.findUnique({
            where: { id_producto: Number(id) }
        });

        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        // Si subieron un archivo nuevo, actualizamos la ruta, sino, conservamos la que ya tenía
        const imagenUrl = req.file ? `uploads/${req.file.filename}` : existingProduct.url_imagen;

        // Inicia transacción segura para actualizar ambas tablas
        const updatedProduct = await prisma.$transaction(async (tx) => {
            const p = await tx.producto.update({
                where: { id_producto: Number(id) },
                data: {
                    nombre_repuesto: nombre || existingProduct.nombre_repuesto,
                    stock_actual: stock !== undefined ? Number(stock) : existingProduct.stock_actual,
                    url_imagen: imagenUrl,
                    id_categoria: id_categoria ? Number(id_categoria) : existingProduct.id_categoria,
                    id_proveedor: id_proveedor ? Number(id_proveedor) : existingProduct.id_proveedor,
                },
            });

            // Actualizamos los precios buscando el registro asociado al producto
            if (precioCompra !== undefined || precioVenta !== undefined) {
                // Buscamos el precio actual
                const precioExistente = await tx.precioProducto.findUnique({
                    where: { id_producto: Number(id) }
                });

                if (precioExistente) {
                    await tx.precioProducto.update({
                        where: { id_producto: Number(id) },
                        data: {
                            precio_compra: precioCompra !== undefined ? Number(precioCompra) : precioExistente.precio_compra,
                            precio_venta: precioVenta !== undefined ? Number(precioVenta) : precioExistente.precio_venta,
                        },
                    });
                } else {
                     // Por si acaso había un producto sin precio registrado
                    await tx.precioProducto.create({
                        data: {
                            id_producto: Number(id),
                            precio_compra: Number(precioCompra) || 0,
                            precio_venta: Number(precioVenta) || 0,
                        },
                    });
                }
            }

            return tx.producto.findUnique({
                where: { id_producto: Number(id) },
                include: { precio: true, categoria: true, proveedor: true },
            });
        },
        {
            maxWait: 10000, 
            timeout: 15000, 
        });

        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
        const cleanImagePath = updatedProduct.url_imagen ? updatedProduct.url_imagen.replace(/\\/g, '/') : '';
        const imageUrlFormatted = cleanImagePath 
            ? (cleanImagePath.startsWith('http') ? cleanImagePath : `${BACKEND_URL}/${cleanImagePath}`) 
            : '';

        const formatted = {
            id_producto: updatedProduct.id_producto,
            nombre: updatedProduct.nombre_repuesto,
            stock: updatedProduct.stock_actual,
            stockColor: updatedProduct.stock_actual <= updatedProduct.stock_minimo_alerta ? "text-orange-500" : "text-slate-900",
            imagen: imageUrlFormatted,
            precioCompra: updatedProduct.precio?.precio_compra ? Number(updatedProduct.precio.precio_compra) : 0,
            precioVenta: updatedProduct.precio?.precio_venta ? Number(updatedProduct.precio.precio_venta) : 0,
            categoria: updatedProduct.categoria?.nombre_categoria || "Generico",
            proveedor: updatedProduct.proveedor?.nombre_empresa || "Generico",
        };

        return res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        return res.status(500).json({ success: false, message: error?.message || "Error al actualizar producto" });
    }
};

// Obtener categorias y proveedores para los selects
export const getFormOptions = async (req, res) => {
    try {
        const [categorias, proveedores] = await Promise.all([
            prisma.categoria.findMany(),
            prisma.proveedor.findMany(),
        ]);

        return res.status(200).json({
            success: true,
            data: { categorias, proveedores },
        });
    } catch (error) {
        console.error('Error in getFormOptions:', error);
        return res.status(500).json({ success: false, message: 'Error obteniendo opciones' });
    }
};
