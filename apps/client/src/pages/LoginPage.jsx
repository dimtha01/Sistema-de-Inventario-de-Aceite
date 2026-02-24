import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f8] font-[Manrope,sans-serif] relative">

      {/* Fondo mesh */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: '#f6f6f8',
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(19, 91, 236, 0.04) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(19, 91, 236, 0.06) 0px, transparent 50%)
          `,
        }}
      />

      {/* Contenido centrado */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {/* <div className="w-7 h-7 bg-[#135bec] rounded-full flex items-center justify-center">
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div> */}
            <span className="text-sm font-black tracking-[0.2em] uppercase text-slate-800">
              ICON
            </span>
          </div>

          {/* Card */}
          <div
            className="bg-white rounded-2xl border border-slate-100 p-8"
            style={{ boxShadow: '0 8px 40px -8px rgba(0,0,0,0.08)' }}
          >
            {/* Encabezado */}
            <div className="mb-8 text-center">
              <h1 className="text-xl font-semibold tracking-tight text-slate-800 mb-1.5">
                Bienvenido
              </h1>
              <p className="text-slate-500 text-xs leading-relaxed">
                Acceso exclusivo al inventario de ingeniería automotriz.
              </p>
            </div>

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
                  className="w-full bg-transparent border-0 border-b border-slate-300 py-3 px-0 focus:ring-0 focus:border-[#135bec] transition-colors text-sm placeholder:text-slate-400 text-slate-800 font-medium outline-none"
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
                  <a
                    href="#"
                    className="text-[10px] font-semibold text-[#135bec] hover:text-[#135bec]/70 transition-colors"
                  >
                    ¿Olvidaste tu clave?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-0 border-b border-slate-300 py-3 px-0 pr-8 focus:ring-0 focus:border-[#135bec] transition-colors text-sm placeholder:text-slate-400 text-slate-800 font-medium outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#135bec] transition-colors p-0.5"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword
                      ? <EyeOff size={16} strokeWidth={1.8} />
                      : <Eye size={16} strokeWidth={1.8} />
                    }
                  </button>
                </div>
              </div>

              {/* Botón */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#135bec] hover:bg-[#135bec]/90 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all text-[11px] uppercase tracking-[0.25em]"
                  style={{ boxShadow: '0 8px 24px -4px rgba(19, 91, 236, 0.35)' }}
                >
                  Ingresar al Sistema
                </button>
              </div>
            </form>

          </div>

          {/* Línea decorativa */}
          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

          {/* Footer mini */}
          <div className="mt-6 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">
              © 2026 AutoElite Dynamics
            </span>
            <div className="flex gap-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">v4.0.2</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">AES-256</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};