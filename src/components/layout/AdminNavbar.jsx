import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { openCloudinaryConfigModal } from "../../services/cloudinaryService.js";

const NAV_STRUCTURE = [
  {
    type: "link",
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: "📊"
  },
  {
    type: "link",
    path: "/admin/cotizaciones",
    label: "Cotizaciones",
    icon: "💬"
  },
  {
    type: "link",
    path: "/admin/reservas",
    label: "Eventos & Agenda",
    icon: "📅",
    aliases: ["/admin/calendario"]
  },
  {
    type: "dropdown",
    id: "navDropdownCatalogo",
    label: "Catálogo & Montajes",
    icon: "💎",
    items: [
      {
        path: "/admin/paquetes",
        label: "Paquetes de Gala",
        desc: "Bodas, XV Años y Graduaciones",
        icon: "💍"
      },
      {
        path: "/admin/servicios",
        label: "Servicios & Catering",
        desc: "Banquete, Sonido, Luces y DJ",
        icon: "🍽️"
      },
      {
        path: "/admin/inventario",
        label: "Inventario & Mobiliario",
        desc: "Silletería, Mantelería y Menaje",
        icon: "📦"
      },
      {
        path: "/admin/galeria",
        label: "Galería Multimedia",
        desc: "Fotos reales y catálogo Cloudinary",
        icon: "✨"
      }
    ]
  },
  {
    type: "dropdown",
    id: "navDropdownGestion",
    label: "Gestión & Finanzas",
    icon: "💼",
    items: [
      {
        path: "/admin/clientes",
        label: "Directorio de Clientes",
        desc: "Historial de contratos y contactos",
        icon: "👥",
        aliases: ["/admin/cliente"]
      },
      {
        path: "/admin/pagos",
        label: "Pagos & Abonos",
        desc: "Libro financiero y comprobantes",
        icon: "💵"
      },
      {
        path: "/admin/contrato",
        label: "Generador de Contratos",
        desc: "Minutas legales imprimibles",
        icon: "📜"
      },
      {
        path: "/admin/anuncio",
        label: "Barra de Anuncios",
        desc: "Franja de promociones en portada",
        icon: "📢"
      }
    ]
  }
];

export default function AdminNavbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const isPathActive = (targetPath, aliases = []) => {
    if (location.pathname === targetPath) return true;
    if (Array.isArray(aliases)) {
      return aliases.some((a) => location.pathname.startsWith(a));
    }
    return false;
  };

  const isDropdownActive = (items) => {
    return items.some((item) => isPathActive(item.path, item.aliases));
  };

  return (
    <header className="admin-header bg-zinc-950 border-b border-zinc-800/80 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container flex items-center justify-between py-3.5 px-4 sm:px-6">
        {/* BRAND */}
        <Link to="/admin/dashboard" className="brand flex items-center gap-3">
          <img
            src="/images/logo-almar.png"
            alt="Banquetes Almar Admin"
            className="brand-logo w-9 h-9 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="brand-text">
            <span className="logo-main text-base font-serif font-bold text-amber-300">
              Banquetes Almar
            </span>
            <span className="logo-sub text-[10px] text-zinc-400 uppercase tracking-widest">
              Suite Ejecutiva
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {NAV_STRUCTURE.map((item) => {
            if (item.type === "link") {
              const active = isPathActive(item.path, item.aliases);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    active
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      : "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            }

            if (item.type === "dropdown") {
              const active = isDropdownActive(item.items);
              const isOpen = openDropdown === item.id;
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      active || isOpen
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    <span className="text-[10px] opacity-70">▼</span>
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                      {item.items.map((sub) => {
                        const subActive = isPathActive(sub.path, sub.aliases);
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setOpenDropdown(null)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl text-xs transition ${
                              subActive
                                ? "bg-amber-500/20 text-amber-300"
                                : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                            }`}
                          >
                            <span className="text-base mt-0.5">{sub.icon}</span>
                            <div>
                              <div className="font-semibold">{sub.label}</div>
                              {sub.desc && (
                                <div className="text-[10px] text-zinc-500">{sub.desc}</div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </nav>

        {/* RIGHT TOOLS & USER CARD */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-500 transition"
          >
            <span>🌐 Ver Web</span>
          </Link>

          {/* USER PROFILE CARD */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
            >
              <span>👑</span>
              <span className="hidden sm:inline">
                {currentUser?.name || "Administrador"}
              </span>
              <span className="text-[10px]">▼</span>
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 text-xs text-zinc-300"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                  <div className="font-semibold text-white">
                    {currentUser?.name || "Administrador"}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    {currentUser?.email || "admin@almar.com"}
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/[0.04] flex items-center gap-2"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    openCloudinaryConfigModal();
                  }}
                >
                  <span>☁️</span>
                  <span>Configurar Cloudinary</span>
                </button>

                <button
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 flex items-center gap-2 mt-1"
                  onClick={handleLogout}
                >
                  <span>🚪</span>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            type="button"
            className="lg:hidden text-lg p-2 text-zinc-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir navegación de administración"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-zinc-900 border-b border-zinc-800 p-4 space-y-4">
          {NAV_STRUCTURE.map((item) => {
            if (item.type === "link") {
              const active = isPathActive(item.path, item.aliases);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-semibold ${
                    active ? "bg-amber-500/20 text-amber-300" : "text-zinc-300"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            }

            if (item.type === "dropdown") {
              return (
                <div key={item.id} className="space-y-1">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider px-2.5 py-1">
                    {item.label}
                  </div>
                  {item.items.map((sub) => {
                    const active = isPathActive(sub.path, sub.aliases);
                    return (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 p-2.5 pl-5 rounded-xl text-sm ${
                          active ? "bg-amber-500/20 text-amber-300" : "text-zinc-300"
                        }`}
                      >
                        <span>{sub.icon}</span>
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </header>
  );
}
