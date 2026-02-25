import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Helper: respuesta estándar de error
const badRequest = (res, message) =>
  res.status(400).json({ success: false, message });

export const register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, id_rol } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return badRequest(res, "Faltan campos obligatorios.");
    }
    if (!JWT_SECRET) {
      return res
        .status(500)
        .json({ success: false, message: "JWT_SECRET no configurado." });
    }

    // Registro público: rol por defecto (ajusta el 2 al rol real "VENDEDOR", por ejemplo).
    // Si quieres permitir id_rol desde el cliente: valida contra el catálogo RolUsuario.
    const rolId = Number.isInteger(id_rol) ? id_rol : 2;

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
      data: { nombre, apellido, email, password_hash, id_rol: rolId },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        email: true,
        id_rol: true,
        rol: { select: { id_rol: true, nombre_rol: true } }, // ajusta campos reales de RolUsuario
      },
    });

    const token = jwt.sign(
      { sub: user.id_usuario, roleId: user.id_rol }, // payload como objeto
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } // jsonwebtoken soporta expiresIn [web:51]
    );

    return res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return badRequest(res, "Email y password son requeridos.");
    }
    if (!JWT_SECRET) {
      return res
        .status(500)
        .json({ success: false, message: "JWT_SECRET no configurado." });
    }

    const user = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        email: true,
        id_rol: true,
        password_hash: true,
        rol: { select: { id_rol: true, nombre_rol: true } }, // ajusta campos reales
      },
    });

    // Mensaje genérico para no filtrar si existe el correo
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Credenciales inválidas." });
    }

    const ok = await bcrypt.compare(password, user.password_hash); // compare bcryptjs [web:50]
    if (!ok) {
      return res
        .status(400)
        .json({ success: false, message: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { sub: user.id_usuario, roleId: user.id_rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } // expiresIn soportado [web:51]
    );

    // Nunca retornes password_hash al frontend
    // eslint-disable-next-line no-unused-vars
    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      data: { user: safeUser, token },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * FUTURO MÓDULO (comentado): CRUD de usuarios (solo admin).
 * - createUser: crear usuario (con id_rol explícito)
 * - listUsers: paginado + filtros
 * - updateUser: cambio de rol / datos
 * - resetPassword: regenerar password y forzar cambio
 *
 * Nota: estos endpoints deben ir protegidos por middleware auth + autorización por rol.
 */
// export const createUser = async (req, res, next) => {};
// export const listUsers = async (req, res, next) => {};
// export const updateUser = async (req, res, next) => {};
// export const resetPassword = async (req, res, next) => {};
