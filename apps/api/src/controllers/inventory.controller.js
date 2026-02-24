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

    if (!nombre || !id_categoria || !id_proveedor) {
      return res
        .status(400)
        .json({ success: false, message: "Faltan campos obligatorios" });
    }

    // 🔴 CORRECCIÓN AQUÍ: Eliminamos "/products/" y la barra inicial
    // Ahora coincide con la carpeta física de Multer y con el endpoint getProducts
    const imagenUrl = req.file ? `uploads/${req.file.filename}` : null;

    const newProduct = await prisma.$transaction(async (tx) => {
      const p = await tx.producto.create({
        data: {
          nombre_repuesto: nombre,
          stock_actual: Number(stock) || 0,
          stock_minimo_alerta: 5,
          url_imagen: imagenUrl, // Se guarda como "uploads/product-123.jpg"
          id_categoria: Number(id_categoria),
          id_proveedor: Number(id_proveedor),
        },
      });

      await tx.precioProducto.create({
        data: {
          id_producto: p.id_producto,
          precio_compra: Number(precioCompra) || 0,
          precio_venta: Number(precioVenta) || 0,
        },
      });

      return tx.producto.findUnique({
        where: { id_producto: p.id_producto },
        include: { precio: true, categoria: true, proveedor: true },
      });
    });

    const formatted = {
      id_producto: newProduct.id_producto,
      nombre: newProduct.nombre_repuesto,
      stock: newProduct.stock_actual,
      stockColor:
        newProduct.stock_actual <= newProduct.stock_minimo_alerta
          ? "text-orange-500"
          : "text-slate-900",
      imagen: newProduct.url_imagen ? `${process.env.BACKEND_URL || 'http://localhost:3000'}/${newProduct.url_imagen}` : "",
      precioCompra: newProduct.precio?.precio_compra
        ? Number(newProduct.precio.precio_compra)
        : 0,
      precioVenta: newProduct.precio?.precio_venta
        ? Number(newProduct.precio.precio_venta)
        : 0,
      categoria: newProduct.categoria?.nombre_categoria || "Generico",
      proveedor: newProduct.proveedor?.nombre_empresa || "Generico",
    };

    return res.status(201).json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error in createProduct:", error);
    return res
      .status(500)
      .json({ success: false, message: error?.message || "Error al crear producto" });
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
