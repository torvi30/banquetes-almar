import React from "react";
import { BUSINESS_INFO } from "../../config/businessInfo.js";
import { useCart } from "../../context/CartContext.jsx";

export default function WhatsAppConciergeModal() {
  const { cartCount, openCart } = useCart();
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
    "Hola Banquetes Almar, deseo información sobre sus servicios de eventos y paquetes de gala."
  )}`;

  return (
    <>
      {/* VIP WHATSAPP FLOATING BUTTON */}
      <a
        href={whatsappUrl}
        className="whatsapp-vip-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atención VIP WhatsApp"
      >
        <div className="wa-vip-icon-ring">
          <svg className="wa-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83a8.18 8.18 0 0 1-5.82 2.41c-1.44 0-2.85-.38-4.09-1.11l-.29-.17-3.12.82.83-3.04-.19-.3a8.18 8.18 0 0 1-1.25-4.44c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.13.17 1.76 2.69 4.26 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z" />
          </svg>
          <span className="wa-online-pulse" />
        </div>
        <div className="wa-vip-text-group">
          <span className="wa-vip-title">Asesoría VIP Almar</span>
          <span className="wa-vip-subtitle">En línea • Respuesta Inmediata</span>
        </div>
      </a>

      {/* FLOATING CART BUTTON */}
      <button
        className="cart-floating-btn open-cart-btn"
        type="button"
        onClick={openCart}
        aria-label="Ver carrito de alquiler"
      >
        <span className="text-2xl">🛒</span>
        {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
      </button>
    </>
  );
}
