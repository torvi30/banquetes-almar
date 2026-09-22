import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { openCloudinaryConfigModal } from "../../services/cloudinaryService.js";

// Minimalist vector SVG icons for executive suite
const Icons = {
  Dashboard: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Quotes: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Agenda: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Catalog: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Management: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Packages: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Services: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  Inventory: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Gallery: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clients: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Payments: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Contract: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Announcement: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  External: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  Cloud: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-3 h-3 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
};

const NAV_STRUCTURE = [
  {
    type: "link",
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: Icons.Dashboard
  },
  {
    type: "link",
    path: "/admin/cotizaciones",
    label: "Cotizaciones",
    icon: Icons.Quotes
  },
  {
    type: "link",
    path: "/admin/reservas",
    label: "Agenda",
    icon: Icons.Agenda,
    aliases: ["/admin/calendario", "/admin/eventos"]
  },
  {
    type: "dropdown",
    id: "navDropdownCatalogo",
    label: "Catálogo",
    icon: Icons.Catalog,
    items: [
      {
        path: "/admin/paquetes",
        label: "Paquetes de Gala",
        desc: "Bodas, XV Años y Graduaciones",
        icon: Icons.Packages
      },
      {
        path: "/admin/servicios",
        label: "Servicios & Catering",
        desc: "Banquete, Sonido, Luces y DJ",
        icon: Icons.Services
      },
      {
        path: "/admin/inventario",
        label: "Inventario & Mobiliario",
        desc: "Silletería, Mantelería y Menaje",
        icon: Icons.Inventory
      },
      {
        path: "/admin/galeria",
        label: "Galería Multimedia",
        desc: "Fotos reales y catálogo Cloudinary",
        icon: Icons.Gallery
      }
    ]
  },
  {
    type: "dropdown",
    id: "navDropdownGestion",
    label: "Gestión",
    icon: Icons.Management,
    items: [
      {
        path: "/admin/clientes",
        label: "Directorio de Clientes",
        desc: "Historial de contratos y contactos",
        icon: Icons.Clients,
        aliases: ["/admin/cliente"]
      },
      {
        path: "/admin/pagos",
        label: "Pagos & Abonos",
        desc: "Libro financiero y recibos oficiales",
        icon: Icons.Payments
      },
      {
        path: "/admin/contrato",
        label: "Minuta de Contratos",
        desc: "Documentos legales imprimibles",
        icon: Icons.Contract
      },
      {
        path: "/admin/anuncio",
        label: "Barra de Anuncios",
        desc: "Banner de novedades en portada",
        icon: Icons.Announcement
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

  const userInitial = currentUser?.name
    ? currentUser.name.trim().charAt(0).toUpperCase()
    : "A";

  const userFirstName = currentUser?.name
    ? currentUser.name.split(" ")[0]
    : "Admin";

  return (
    <header className="admin-header bg-zinc-950/90 border-b border-zinc-800/80 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
        {/* BRAND */}
        <Link
          to="/admin/dashboard"
          className="brand flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <img
            src="/images/logo-almar.png"
            alt="Banquetes Almar Admin"
            className="brand-logo w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="brand-text flex flex-col leading-tight">
            <span className="logo-main text-sm font-serif font-bold text-amber-300 whitespace-nowrap">
              Banquetes Almar
            </span>
            <span className="logo-sub text-[9px] text-zinc-500 uppercase tracking-wider whitespace-nowrap">
              Suite Ejecutiva
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_STRUCTURE.map((item) => {
            const IconComponent = item.icon;

            if (item.type === "link") {
              const active = isPathActive(item.path, item.aliases);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                    active
                      ? "bg-amber-400/10 text-amber-300 border border-amber-400/25 shadow-sm shadow-amber-950"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                  }`}
                >
                  <span className={active ? "text-amber-400" : "text-zinc-500"}>
                    <IconComponent />
                  </span>
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
                    onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                      active || isOpen
                        ? "bg-amber-400/10 text-amber-300 border border-amber-400/25 shadow-sm shadow-amber-950"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                    }`}
                  >
                    <span className={active || isOpen ? "text-amber-400" : "text-zinc-500"}>
                      <IconComponent />
                    </span>
                    <span>{item.label}</span>
                    <span className={`text-[10px] text-zinc-500 ${isOpen ? "rotate-180" : ""}`}>
                      <Icons.ChevronDown />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-64 bg-zinc-900/95 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-fadeIn">
                      {item.items.map((sub) => {
                        const SubIcon = sub.icon;
                        const subActive = isPathActive(sub.path, sub.aliases);
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setOpenDropdown(null)}
                            className={`flex items-start gap-2.5 p-2 rounded-lg text-xs transition ${
                              subActive
                                ? "bg-amber-400/15 text-amber-300"
                                : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                            }`}
                          >
                            <span className={`mt-0.5 ${subActive ? "text-amber-400" : "text-zinc-500"}`}>
                              <SubIcon />
                            </span>
                            <div>
                              <div className="font-medium text-zinc-200">{sub.label}</div>
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

        {/* RIGHT TOOLS: LIVE WEB LINK & PROFILE AVATAR */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition"
            title="Abrir sitio web para clientes en nueva pestaña"
          >
            <span>Ver Web</span>
            <Icons.External />
          </Link>

          {/* USER PROFILE AVATAR & DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 hover:border-amber-400/30 text-xs text-zinc-300 hover:text-white transition cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-bold flex items-center justify-center text-[11px] shadow-sm">
                {userInitial}
              </div>
              <span className="hidden sm:inline font-medium max-w-[100px] truncate text-xs text-zinc-300 group-hover:text-amber-300">
                {userFirstName}
              </span>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">
                <Icons.ChevronDown />
              </span>
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 bg-zinc-900/95 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs text-zinc-300 backdrop-blur-xl animate-fadeIn"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                  <div className="font-semibold text-white truncate">
                    {currentUser?.name || "Administrador Almar"}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    {currentUser?.email || "admin@almar.com"}
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/[0.04] text-zinc-300 hover:text-white flex items-center gap-2.5 cursor-pointer transition"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    openCloudinaryConfigModal();
                  }}
                >
                  <span className="text-zinc-400">
                    <Icons.Cloud />
                  </span>
                  <span>Configurar Cloudinary</span>
                </button>

                <button
                  type="button"
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 flex items-center gap-2.5 cursor-pointer transition mt-0.5"
                  onClick={handleLogout}
                >
                  <Icons.Logout />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir navegación de administración"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/95 border-b border-zinc-800 px-4 py-3 space-y-3 backdrop-blur-xl">
          {NAV_STRUCTURE.map((item) => {
            const IconComponent = item.icon;

            if (item.type === "link") {
              const active = isPathActive(item.path, item.aliases);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-medium ${
                    active ? "bg-amber-400/15 text-amber-300" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className={active ? "text-amber-400" : "text-zinc-500"}>
                    <IconComponent />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            }

            if (item.type === "dropdown") {
              return (
                <div key={item.id} className="space-y-1">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-1 flex items-center gap-2">
                    <IconComponent />
                    <span>{item.label}</span>
                  </div>
                  {item.items.map((sub) => {
                    const SubIcon = sub.icon;
                    const active = isPathActive(sub.path, sub.aliases);
                    return (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 p-2 pl-4 rounded-lg text-xs ${
                          active ? "bg-amber-400/15 text-amber-300" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className={active ? "text-amber-400" : "text-zinc-500"}>
                          <SubIcon />
                        </span>
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
