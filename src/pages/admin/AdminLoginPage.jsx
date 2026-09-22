import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { alertService } from "../../services/alertService.js";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("victortamayopine@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alertService.warning("Campos incompletos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      await alertService.success(
        `¡Bienvenido, ${user.name || "Administrador"}!`,
        "Acceso autorizado al sistema de Banquetes Almar.",
        { timer: 1400, showConfirmButton: false }
      );
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alertService.error("Acceso denegado", error.message || "Usuario o contraseña inválidos.");
    } finally {
      setLoading(false);
    }
  };

  const handlePillClick = (pEmail, pPass) => {
    setEmail(pEmail);
    setPassword(pPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-6 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      <div className="w-full max-w-md">
        {/* Luxury Glass Card */}
        <div className="relative bg-zinc-900/90 border border-amber-500/25 rounded-2xl p-7 sm:p-9 shadow-2xl shadow-black/90 backdrop-blur-xl">
          {/* Ambient Glow Behind Card */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header & Branding */}
          <div className="relative text-center mb-8">
            <Link to="/" className="inline-block transition-transform hover:scale-105 duration-300">
              <img
                src="/images/logo-almar.png"
                alt="Banquetes Almar Logo"
                className="w-16 h-16 mx-auto mb-3 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </Link>
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
              Suite Administrativa
            </span>
            <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
              Banquetes{" "}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Almar
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Gestión integral de eventos, reservas y mobiliario</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="relative space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@almar.com"
                required
                className="w-full px-4 py-3 bg-zinc-950/80 text-zinc-100 placeholder-zinc-500 border border-zinc-700/80 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-zinc-950/80 text-zinc-100 placeholder-zinc-500 border border-zinc-700/80 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-zinc-950 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{loading ? "Verificando acceso..." : "Ingresar al Panel"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Quick Access Credential Pills */}
            <div className="pt-5 border-t border-zinc-800/80 text-center">
              <p className="text-[11px] uppercase tracking-wider text-amber-400/90 font-semibold mb-2.5 flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Acceso Rápido Administradores
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                <button
                  type="button"
                  onClick={() => handlePillClick("victortamayopine@gmail.com", "admin123")}
                  className="credential-pill p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-amber-500/60 hover:bg-zinc-800/40 transition-all text-xs group cursor-pointer"
                  title="Autocompletar credenciales de Víctor Tamayo"
                >
                  <span className="block font-medium text-zinc-200 group-hover:text-amber-300 transition-colors">
                    Víctor Tamayo
                  </span>
                  <span className="block text-[10px] text-zinc-400 truncate">victortamayopine...</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePillClick("admin@almar.com", "Admin123*")}
                  className="credential-pill p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-amber-500/60 hover:bg-zinc-800/40 transition-all text-xs group cursor-pointer"
                  title="Autocompletar credenciales de Admin Almar"
                >
                  <span className="block font-medium text-zinc-200 group-hover:text-amber-300 transition-colors">
                    Admin Almar
                  </span>
                  <span className="block text-[10px] text-zinc-400 truncate">admin@almar.com</span>
                </button>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a la página principal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
