/*
  Warnings:

  - You are about to drop the column `es_premium` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_completo` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `ubicacion` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `origen_destino` on the `historial_movimientos` table. All the data in the column will be lost.
  - You are about to drop the column `categoria_socio` on the `proveedores` table. All the data in the column will be lost.
  - You are about to drop the column `pais_origen` on the `proveedores` table. All the data in the column will be lost.
  - You are about to drop the column `url_logo` on the `proveedores` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `apellido` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellido` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clientes" DROP COLUMN "es_premium",
DROP COLUMN "nombre_completo",
DROP COLUMN "ubicacion",
ADD COLUMN     "apellido" VARCHAR(150) NOT NULL,
ADD COLUMN     "nombre" VARCHAR(150) NOT NULL,
ADD COLUMN     "telefono" VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE "historial_movimientos" DROP COLUMN "origen_destino";

-- AlterTable
ALTER TABLE "proveedores" DROP COLUMN "categoria_socio",
DROP COLUMN "pais_origen",
DROP COLUMN "url_logo",
ADD COLUMN     "direccion" VARCHAR(100),
ADD COLUMN     "telefono" VARCHAR(100);

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "avatar_url",
ADD COLUMN     "apellido" VARCHAR(100) NOT NULL;
