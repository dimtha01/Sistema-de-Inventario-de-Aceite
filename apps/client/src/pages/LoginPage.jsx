import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom"; // si usas react-router

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Estados UI
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(""); // limpia error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const email = formData.usuario.trim();
    const password = formData.password;

    if (!email || !password) {
      setErrorMsg("Ingresa tu usuario (email) y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Siempre intenta parsear JSON (tu API estandariza JSON de error/éxito)
      const json = await resp.json();

      if (!resp.ok || !json?.success) {
        setErrorMsg(json?.message || "Credenciales inválidas.");
        return;
      }

      const token = json?.data?.token;
      const user = json?.data?.user;

      if (!token || !user) {
        setErrorMsg("Respuesta inválida del servidor.");
        return;
      }

      // Persistencia simple
      localStorage.setItem("mp_token", token);
      localStorage.setItem("mp_user", JSON.stringify(user));

      // Redirección (ajusta a tu app)
      navigate("/dashboard");
      // window.location.href = "/"; // opción sin router
    } catch (err) {
      setErrorMsg("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#f6f6f8] font-[Manrope,sans-serif] relative">
      {/* Fondo mesh */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: "#f6f6f8",
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(19, 91, 236, 0.04) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(19, 91, 236, 0.06) 0px, transparent 50%)
          `,
        }}
      />

      {/* Contenido centrado */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-sm font-black tracking-[0.2em] uppercase text-slate-800">
              ICON
            </span>
          </div>

          {/* Card */}
          <div
            className="bg-white rounded-2xl border border-slate-100 p-8"
            style={{ boxShadow: "0 8px 40px -8px rgba(0,0,0,0.08)" }}
          >
            {/* Encabezado */}
            <div className="mb-8 text-center">
              <h1 className="text-xl font-semibold tracking-tight text-slate-800 mb-1.5">
                Bienvenido
              </h1>
              <p className="text-slate-500 text-xs leading-relaxed">
                Acceso exclusivo al inventario.
              </p>
            </div>

            {/* Error */}
            {errorMsg ? (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-[11px] font-semibold text-red-700 tracking-wide">
                  {errorMsg}
                </p>
              </div>
            ) : null}

            {/* Formulario */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Usuario */}
              <div className="space-y-1.5">
                <label
                  htmlFor="usuario"
                  className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600"
                >
                  Usuario
                </label>
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  value={formData.usuario}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full bg-transparent border-0 border-b border-slate-300 py-3 px-0 focus:ring-0 focus:border-[#135bec] transition-colors text-sm placeholder:text-slate-400 text-slate-800 font-medium outline-none disabled:opacity-60"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600"
                  >
                    Contraseña
                  </label>
                  {/* <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-[10px] font-semibold text-[#135bec] hover:text-[#135bec]/70 transition-colors"
                  >
                    ¿Olvidaste tu clave?
                  </a> */}
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full bg-transparent border-0 border-b border-slate-300 py-3 px-0 pr-8 focus:ring-0 focus:border-[#135bec] transition-colors text-sm placeholder:text-slate-400 text-slate-800 font-medium outline-none disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#135bec] transition-colors p-0.5"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={1.8} />
                    ) : (
                      <Eye size={16} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#135bec] hover:bg-[#135bec]/90 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all text-[11px] uppercase tracking-[0.25em] disabled:opacity-70 disabled:active:scale-100"
                  style={{ boxShadow: "0 8px 24px -4px rgba(19, 91, 236, 0.35)" }}
                >
                  {loading ? "Ingresando..." : "Ingresar al Sistema"}
                </button>
              </div>
            </form>
          </div>

          {/* Línea decorativa */}
          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

          {/* Footer mini */}
          <div className="mt-6 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">
              © 2026
            </span>
            <div className="flex gap-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
