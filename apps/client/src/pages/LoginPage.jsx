import { useState } from 'react';

export const LoginAutoElite = () => {
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
    // Tu lógica de autenticación aquí
    console.log(formData);
  };

  return (
    <div className="bg-[#f6f6f8] text-slate-900 min-h-screen flex flex-col font-[Manrope,sans-serif] relative">

      {/* Fondo mesh */}
      <div className="fixed inset-0 z-0 opacity-60"
        style={{
          backgroundColor: '#f6f6f8',
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(19, 91, 236, 0.03) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(19, 91, 236, 0.05) 0px, transparent 50%)
          `,
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 w-full px-8 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#135bec] rounded-full flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
          </div>
          <span className="text-lg font-bold tracking-tighter uppercase">StockHub</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a
            href="#"
            className="text-xs font-semibold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
          >
            Curaduría
          </a>
          <a
            href="#"
            className="text-xs font-semibold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
          >
            Soporte Técnico
          </a>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-20">

        {/* Card de Login */}
        <div
          className="w-full max-w-[440px] bg-white backdrop-blur-sm p-12 lg:p-16 rounded-xl border border-slate-100"
          style={{ boxShadow: '0 10px 50px -12px rgba(0, 0, 0, 0.05)' }}
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-light tracking-tight mb-3">AutoElite</h1>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Acceso exclusivo al inventario de ingeniería de precisión y arte automotriz.
            </p>
          </div>

          {/* Formulario */}
          <form className="space-y-8" onSubmit={handleSubmit}>

            {/* Campo Usuario */}
            <div className="space-y-2">
              <label
                htmlFor="usuario"
                className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1"
              >
                Identidad / Usuario
              </label>
              <div className="relative">
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  value={formData.usuario}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="w-full bg-transparent border-0 border-b border-slate-200 py-4 px-1 focus:ring-0 focus:border-[#135bec] transition-colors text-sm placeholder:text-slate-300 font-medium outline-none"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1"
                >
                  Clave de Acceso
                </label>
                <a
                  href="#"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#135bec]/60 hover:text-[#135bec] transition-colors"
                >
                  Olvidé mi clave
                </a>
              </div>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-slate-200 py-4 px-1 focus:ring-0 focus:border-[#135bec] transition-colors text-sm placeholder:text-slate-300 font-medium outline-none pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#135bec] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Botón */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-bold py-5 rounded-lg transition-all text-xs uppercase tracking-[0.3em]"
                style={{ boxShadow: '0 20px 25px -5px rgba(19, 91, 236, 0.2)' }}
              >
                Ingresar al Sistema
              </button>
            </div>
          </form>

          {/* Footer de la card */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              Solicitar credenciales a la administración central
            </p>
          </div>
        </div>

        {/* Línea decorativa */}
        <div className="mt-16 w-full max-w-xs h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Imágenes decorativas */}
        <div className="mt-8 flex gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <img
            alt="Silueta minimalista de auto deportivo"
            className="h-6 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGmxbCMV2N-Y6hpKOa0X65Mw6IvvU_-sDy_PTPULRBpQNJcVgc3dXaDllDimD5n_kglsB_O-sJkIlcFkQzEfdqFMdRzlooPZjegewt1TDY5SrMJyrfg4PWzHjZK7hS_q9bY1jjY1qjBuNPp3DSh1NDLySqAS_unH_p8EHRHqzgPMD19CZPqKWbZDAtnWTLNrh5fDgatdIRI0C_ln3LgKau0G5-3GSHf2YWc9Mlh_JMYwXP98OUkqfT7VLbfb2GLEuvIx1MHkr6c44"
          />
          <img
            alt="Detalle de faro moderno"
            className="h-6 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbN2-Rjms0iaJXHPecto93hmJcvmeN3zUuXU1jwWFbDqqzj_REOX9XbGGL0uoVGaibcqFtlNr3HDk4ND5tPABvPdAilIN2iz1WyCpCHNeFOCRHCBxGKxWJ3qfhkn7xRNlf1GUHsvX7faeayuCIQfIauqOK3YU4lRIk7Ujg10q-y_mMmcTYNrEx8kY1VEcIG4cqshJZ15o6sMq81IIXCXTMsWDaphWALtAKqbAnr7qvPFuvrPuy0EWuspZOaXxtpvRXrjI-21fa0j4"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            © 2024 AutoElite Dynamics • Madrid Edition
          </div>
          <div className="flex gap-6">
            <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">
              v4.0.2 Archivo
            </span>
            <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">
              Encriptación AES-256
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};