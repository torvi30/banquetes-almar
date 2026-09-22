import React, { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { dbService } from "../services/firebase/dbService.js";
import { BUSINESS_INFO } from "../config/businessInfo.js";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "almar_rental_cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Failed to persist rental cart:", e);
    }
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === product.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name || product.nombre || "Artículo",
          price: Number(product.price ?? product.precio ?? 0),
          unit: product.unit || product.unidad || "día/evento",
          imageUrl: product.imageUrl || product.imagen || "",
          quantity: qty
        }
      ];
    });

    setIsCartOpen(true);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Agregado: ${product.name || product.nombre}`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: "#18181b",
      color: "#f4f4f5"
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((i) => (i.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const checkoutWhatsApp = async () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Carrito Vacío",
        text: "Elige al menos un artículo del catálogo de mobiliario para solicitar tu reserva.",
        confirmButtonText: "Explorar Mobiliario",
        background: "#18181b",
        color: "#f4f4f5",
        confirmButtonColor: "#d4af37"
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Solicitud de Mobiliario",
      html: `
        <p style="color: #cbd5e1; font-size: 0.92rem; margin-bottom: 1.2rem; line-height: 1.5;">
          Ingresa los datos del evento para verificar inventario disponible y calcular el flete hasta tu locación.
        </p>
        <div style="display: flex; flex-direction: column; gap: 0.9rem; text-align: left;">
          <div>
            <label style="color: #d4af37; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">Tu Nombre Completo *</label>
            <input id="swalRentNombre" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box; background: #1a1a1f; color: #fff; border: 1px solid #444;" placeholder="Ej: Marcela Gómez" />
          </div>
          <div>
            <label style="color: #d4af37; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">Fecha de la Celebración *</label>
            <input id="swalRentFecha" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box; background: #1a1a1f; color: #fff; border: 1px solid #444;" placeholder="Ej: Sábado 14 de Noviembre 2026" />
          </div>
          <div>
            <label style="color: #d4af37; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">Municipio o Lugar del Evento *</label>
            <input id="swalRentMunicipio" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box; background: #1a1a1f; color: #fff; border: 1px solid #444;" placeholder="Ej: Marinilla, Rionegro, Guarne, El Retiro" value="Marinilla" />
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar y Enviar a WhatsApp",
      cancelButtonText: "Seguir Eligiendo",
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#3f3f46",
      background: "#18181b",
      color: "#f4f4f5",
      preConfirm: () => {
        const n = document.getElementById("swalRentNombre")?.value.trim();
        const f = document.getElementById("swalRentFecha")?.value.trim();
        const m = document.getElementById("swalRentMunicipio")?.value.trim() || "Marinilla";
        if (!n) {
          Swal.showValidationMessage("Por favor ingresa tu nombre");
          return false;
        }
        if (!f) {
          Swal.showValidationMessage("Por favor indica la fecha de tu evento");
          return false;
        }
        return { name: n, eventDate: f, location: m };
      }
    });

    if (!formValues) return;

    const itemsListText = cartItems
      .map((i) => `• ${i.quantity}x ${i.name} ($${(i.price * i.quantity).toLocaleString("es-CO")})`)
      .join("\n");

    // Save preliminary quote to database
    try {
      await dbService.addQuote({
        clientName: formValues.name,
        phone: "Alquiler Web",
        eventType: `Alquiler de Mobiliario (${formValues.location})`,
        guestCount: cartCount,
        message: `Items solicitados:\n${itemsListText}`,
        estimatedTotal: cartTotal,
        eventDate: formValues.eventDate,
        location: formValues.location
      });
    } catch (e) {
      console.warn("Could not save quote to database:", e);
    }

    const whatsappMessage = `🪑 *SOLICITUD DE ALQUILER DE MOBILIARIO - BANQUETES ALMAR* 🪑
────────────────────────
👤 *Cliente:* ${formValues.name}
📅 *Fecha del evento:* ${formValues.eventDate}
📍 *Lugar/Municipio:* ${formValues.location}

📦 *Artículos a Alquilar:*
${itemsListText}

💰 *TOTAL MOBILIARIO:* $${cartTotal.toLocaleString("es-CO")} COP
────────────────────────
Solicito confirmación de disponibilidad para esta fecha en Banquetes Almar (Calle 29 # 28-25, Marinilla).`;

    const url = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
  };

  const value = {
    cartItems,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    checkoutWhatsApp
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
