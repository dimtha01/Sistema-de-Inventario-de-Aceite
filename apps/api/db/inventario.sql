-- =============================================
-- 1. TABLAS DE CATÁLOGO (MAESTRAS INDEPENDIENTES)
-- =============================================

-- Niveles de acceso para escalabilidad futura
CREATE TABLE Roles_Usuario (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL -- Ej: 'Administrador', 'Vendedor'
);

-- Clasificación de repuestos para organización y filtros
CREATE TABLE Categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL -- Ej: 'Frenos', 'Motor', 'Suspensión'
);

-- Tipos de acciones permitidas en el Kardex
CREATE TABLE Tipos_Movimiento (
    id_tipo_mov INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tipo VARCHAR(50) NOT NULL -- Ej: 'Entrada por Compra', 'Salida por Venta', 'Ajuste'
);

-- Estados financieros de las ventas y créditos
CREATE TABLE Estados_Pago (
    id_estado_pago INT PRIMARY KEY AUTO_INCREMENT,
    nombre_estado VARCHAR(50) NOT NULL -- Ej: 'Pagado', 'Pendiente', 'Abonado Parcial'
);

-- =============================================
-- 2. ENTIDADES PRINCIPALES (MAESTROS)
-- =============================================

-- Usuarios del sistema (Administradores/Vendedores)
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_rol INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    FOREIGN KEY (id_rol) REFERENCES Roles_Usuario(id_rol)
);

-- Proveedores de piezas
CREATE TABLE Proveedores (
    id_proveedor INT PRIMARY KEY AUTO_INCREMENT,
    nombre_empresa VARCHAR(150) NOT NULL,
    pais_origen VARCHAR(100),
    categoria_socio VARCHAR(50), -- Ej: 'OEM', 'Postventa'
    url_logo VARCHAR(255)
);

-- Gestión de Clientes y Límites de Riesgo
CREATE TABLE Clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre_completo VARCHAR(150) NOT NULL,
    ubicacion VARCHAR(255),
    es_premium BOOLEAN DEFAULT FALSE,
    limite_credito DECIMAL(10, 2) DEFAULT 0.00, -- Control de riesgo empresarial
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 3. GESTIÓN DE INVENTARIO Y PRECIOS
-- =============================================

-- Información técnica y niveles de stock
CREATE TABLE Productos (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,
    nombre_repuesto VARCHAR(150) NOT NULL,
    url_imagen VARCHAR(255), -- Almacena la imagen del producto
    stock_actual INT DEFAULT 0,
    stock_minimo_alerta INT DEFAULT 5, -- Punto de reorden para alertas
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

-- Precios Atómicos (Relación 1:1 para evitar redundancia)
CREATE TABLE Precios_Producto (
    id_producto INT PRIMARY KEY,
    precio_compra DECIMAL(10, 2) NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

-- =============================================
-- 4. OPERACIONES, VENTAS Y "FIADO"
-- =============================================

-- Cabecera de la Venta (Cobros y Cartera)
CREATE TABLE Ventas (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL, -- Quien operó la venta
    id_estado_pago INT NOT NULL,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_estado_pago) REFERENCES Estados_Pago(id_estado_pago)
);

-- Detalle de Venta (Picking y Despacho)
CREATE TABLE Detalle_Venta (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario_aplicado DECIMAL(10, 2) NOT NULL, -- Congela el precio al momento de venta
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- Seguimiento de Pagos y Abonos
CREATE TABLE Abonos_Credito (
    id_abono INT PRIMARY KEY AUTO_INCREMENT,
    id_venta INT NOT NULL,
    monto_abonado DECIMAL(10, 2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta) ON DELETE CASCADE
);

-- =============================================
-- 5. AUDITORÍA Y TRAZABILIDAD (KARDEX)
-- =============================================

-- Registro inmutable de actividad física
CREATE TABLE Historial_Movimientos (
    id_movimiento INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    id_usuario INT NOT NULL,
    id_tipo_mov INT NOT NULL,
    cantidad INT NOT NULL,
    origen_destino VARCHAR(100), -- Ej: 'Punto de Venta', 'Recepción Proveedor'
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_tipo_mov) REFERENCES Tipos_Movimiento(id_tipo_mov)
);

-- =============================================
-- 6. AUTOMATIZACIÓN (TRIGGERS)
-- =============================================

DELIMITER //

-- Automatización de descuento de stock y registro en Kardex
CREATE TRIGGER Log_Venta_Inventario
AFTER INSERT ON Detalle_Venta
FOR EACH ROW
BEGIN
    -- 1. Actualiza el nivel de stock en tiempo real
    UPDATE Productos 
    SET stock_actual = stock_actual - NEW.cantidad
    WHERE id_producto = NEW.id_producto;

    -- 2. Inserta automáticamente en el historial para trazabilidad
    INSERT INTO Historial_Movimientos (id_producto, id_usuario, id_tipo_mov, cantidad, origen_destino)
    SELECT NEW.id_producto, v.id_usuario, 2, NEW.cantidad, CONCAT('Venta #', NEW.id_venta)
    FROM Ventas v WHERE v.id_venta = NEW.id_venta;
END;
//

DELIMITER ;