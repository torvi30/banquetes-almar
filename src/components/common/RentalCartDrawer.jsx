import React from "react";
import { useCart } from "../../context/CartContext.jsx";

export default function RentalCartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
    checkoutWhatsApp
  } = useCart();

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? "open" : ""}`}
        id="cartOverlay"
        onClick={closeCart}
      />
      <aside className={`cart-drawer ${isCartOpen ? "open" : ""}`} id="cartDrawer">
        <div className="cart-drawer-header">
          <h3>Carrito de Alquiler</h3>
          <button
            className="close-cart-btn"
            id="closeCartBtn"
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            &times;
          </button>
        </div>

        <div className="cart-items-container" id="cartItemsList">
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <p>Tu carrito de alquiler está vacío.</p>
              <span style={{ fontSize: "0.9rem", color: "var(--text-soft)" }}>
                Agrega sillas, mesas, carpas o menaje para tu evento.
              </span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item-row" key={item.id}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="cart-item-thumb" />
                ) : (
                  <div className="cart-item-thumb bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                    📦
                  </div>
                )}
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <span className="cart-item-price">
                    ${item.price.toLocaleString("es-CO")} / {item.unit}
                  </span>
                  <div className="cart-item-controls">
                    <button
                      type="button"
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="cart-qty-val">{item.quantity}</span>
                    <button
                      type="button"
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                  title="Quitar item"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-subtotal-row">
            <span>Subtotal Mobiliario:</span>
            <span id="cartSubtotal">${cartTotal.toLocaleString("es-CO")}</span>
          </div>
          <button
            className="btn-apple-primary w-full justify-center py-3.5"
            id="cartCheckoutBtn"
            type="button"
            onClick={checkoutWhatsApp}
          >
            Solicitar Disponibilidad por WhatsApp
          </button>
        </div>
      </aside>
    </>
  );
}
