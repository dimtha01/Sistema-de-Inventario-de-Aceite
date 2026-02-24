-- CreateTable
CREATE TABLE "roles_usuario" (
    "id_rol" SERIAL NOT NULL,
    "nombre_rol" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_usuario_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id_categoria" SERIAL NOT NULL,
    "nombre_categoria" VARCHAR(100) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "tipos_movimiento" (
    "id_tipo_mov" SERIAL NOT NULL,
    "nombre_tipo" VARCHAR(50) NOT NULL,

    CONSTRAINT "tipos_movimiento_pkey" PRIMARY KEY ("id_tipo_mov")
);

-- CreateTable
CREATE TABLE "estados_pago" (
    "id_estado_pago" SERIAL NOT NULL,
    "nombre_estado" VARCHAR(50) NOT NULL,

    CONSTRAINT "estados_pago_pkey" PRIMARY KEY ("id_estado_pago")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "avatar_url" VARCHAR(255),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id_proveedor" SERIAL NOT NULL,
    "nombre_empresa" VARCHAR(150) NOT NULL,
    "pais_origen" VARCHAR(100),
    "categoria_socio" VARCHAR(50),
    "url_logo" VARCHAR(255),

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "ubicacion" VARCHAR(255),
    "es_premium" BOOLEAN NOT NULL DEFAULT false,
    "limite_credito" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "productos" (
    "id_producto" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "nombre_repuesto" VARCHAR(150) NOT NULL,
    "url_imagen" VARCHAR(255),
    "stock_actual" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo_alerta" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "precios_producto" (
    "id_producto" INTEGER NOT NULL,
    "precio_compra" DECIMAL(10,2) NOT NULL,
    "precio_venta" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "precios_producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id_venta" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_estado_pago" INTEGER NOT NULL,
    "fecha_venta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id_venta")
);

-- CreateTable
CREATE TABLE "detalle_venta" (
    "id_detalle" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario_aplicado" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_venta_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "abonos_credito" (
    "id_abono" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "monto_abonado" DECIMAL(10,2) NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "abonos_credito_pkey" PRIMARY KEY ("id_abono")
);

-- CreateTable
CREATE TABLE "historial_movimientos" (
    "id_movimiento" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tipo_mov" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "origen_destino" VARCHAR(100),
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_movimientos_pkey" PRIMARY KEY ("id_movimiento")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles_usuario"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precios_producto" ADD CONSTRAINT "precios_producto_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_id_estado_pago_fkey" FOREIGN KEY ("id_estado_pago") REFERENCES "estados_pago"("id_estado_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_venta" ADD CONSTRAINT "detalle_venta_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_venta" ADD CONSTRAINT "detalle_venta_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonos_credito" ADD CONSTRAINT "abonos_credito_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id_venta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_movimientos" ADD CONSTRAINT "historial_movimientos_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_movimientos" ADD CONSTRAINT "historial_movimientos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_movimientos" ADD CONSTRAINT "historial_movimientos_id_tipo_mov_fkey" FOREIGN KEY ("id_tipo_mov") REFERENCES "tipos_movimiento"("id_tipo_mov") ON DELETE RESTRICT ON UPDATE CASCADE;
