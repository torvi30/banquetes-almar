import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, targetHash) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/" + targetHash);
    } else {
      const element = document.querySelector(targetHash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className={`header apple-header ${isScrolled ? "scrolled" : ""}`} id="header">
      <nav className="navbar container navbar-luxury">
        {/* BRAND IDENTITY */}
        <Link to="/" className="brand" title="Banquetes Almar - Inicio">
          <img
            src="/images/logo-almar.png"
            alt="Logo Banquetes Almar"
            className="brand-logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="brand-text">
            <span className="logo-main">Banquetes Almar</span>
            <span className="logo-sub">Marinilla • Salón & Eventos</span>
          </div>
        </Link>

        {/* EDITORIAL NAVIGATION (Center) */}
        <ul className={`nav-links nav-links-editorial ${isMenuOpen ? "active" : ""}`} id="navLinks">
          <li>
            <a
              href="#sedes"
              onClick={(e) => handleNavClick(e, "#sedes")}
              className="nav-editorial-link"
            >
              Sedes
            </a>
          </li>
          <li>
            <a
              href="#paquetes"
              onClick={(e) => handleNavClick(e, "#paquetes")}
              className="nav-editorial-link"
            >
              Paquetes
            </a>
          </li>
          <li>
            <a
              href="#gastronomia"
              onClick={(e) => handleNavClick(e, "#gastronomia")}
              className="nav-editorial-link"
            >
              Gastronomía
            </a>
          </li>
          <li>
            <a
              href="#alquiler"
              onClick={(e) => handleNavClick(e, "#alquiler")}
              className="nav-editorial-link"
            >
              Mobiliario
            </a>
          </li>
          <li>
            <a
              href="#galeria"
              onClick={(e) => handleNavClick(e, "#galeria")}
              className="nav-editorial-link"
            >
              Galería
            </a>
          </li>
          <li>
            <a
              href="#ubicacion"
              onClick={(e) => handleNavClick(e, "#ubicacion")}
              className="nav-editorial-link"
            >
              Ubicación
            </a>
          </li>

          {/* Actions in Mobile Drawer */}
          <li className="mobile-drawer-action">
            <a
              href="#cotizador"
              onClick={(e) => handleNavClick(e, "#cotizador")}
              className="btn-nav-cta btn-mobile-cta"
            >
              ✨ Diseñar Evento
            </a>
          </li>
          <li className="mobile-drawer-action">
            <Link
              to="/portal-cliente"
              onClick={() => setIsMenuOpen(false)}
              className="nav-client-portal btn-mobile-portal"
            >
              👑 Mi Evento
            </Link>
          </li>
        </ul>

        {/* CONVERSION & CART TOOLS (Right) */}
        <div className="nav-actions-group">
          <a
            href="#cotizador"
            onClick={(e) => handleNavClick(e, "#cotizador")}
            className="btn-nav-cta"
            title="Diseñar mi evento interactivo"
          >
            ✨ Diseñar Evento
          </a>
          <Link
            to="/portal-cliente"
            className="nav-client-portal"
            title="Portal de Clientes Almar"
          >
            👑 Mi Evento
          </Link>
          <button
            className="btn-nav-cart open-cart-btn"
            type="button"
            onClick={openCart}
            title="Ver Carrito de Alquiler"
            aria-label="Ver Carrito de Alquiler"
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Carrito</span>
            {cartCount > 0 && (
              <span className="cart-count-badge">{cartCount}</span>
            )}
          </button>
          <button
            className="menu-toggle"
            id="menuToggle"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de navegación"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>
    </header>
  );
}
