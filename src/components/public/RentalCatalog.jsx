import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { useCart } from "../../context/CartContext.jsx";

const CATEGORIES = [
  { id: "todos", label: "Todos los artículos" },
  { id: "sillas", label: "Sillas Tiffany & Madera" },
  { id: "mesas", label: "Mesas y Tablones" },
  { id: "carpas", label: "Carpas Impermeables" },
  { id: "menaje", label: "Menaje y Cristalería" },
  { id: "decoracion", label: "Decoración & Iluminación" }
];

export default function RentalCatalog() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    dbService.getInventory().then((data) => {
      if (isMounted) {
        setItems(data || []);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = items.filter((item) => {
    if (!item.isActive) return false;
    if (selectedCategory === "todos") return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getQty = (id) => quantities[id] || 1;

  const setQty = (id, val) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, val)
    }));
  };

  return (
    <section className="section bg-gradient-to-b from-zinc-900/40 via-zinc-950 to-black" id="alquiler">
      <div className="container">
        <div className="section-heading">
          <span className="section-label">📦 CATÁLOGO DE MOBILIARIO & EQUIPAMIENTO</span>
          <h2>
            Alquiler de Sillas Tiffany, <span className="gold-gradient-text">Mesas, Carpas y Menaje</span>
          </h2>
          <p>
            ¿Ya tienes el lugar o finca propia pero necesitas el equipamiento? Alquila directamente sillas
            Tiffany doradas o blancas, Crossback rústicas de madera, carpas estructurales impermeables,
            mantelería y cristalería con entrega puntual en Marinilla y todo el Oriente Antioqueño.
          </p>
          <div className="section-features-bar">
            <span className="section-feature-pill">🪑 Sillas Tiffany Doradas & Crossback</span>
            <span className="section-feature-pill">🎪 Carpas Impermeables Estructurales</span>
            <span className="section-feature-pill">🍽️ Menaje & Cristalería de Gala</span>
            <span className="section-feature-pill">🚚 Cobertura en Todo el Oriente Antioqueño</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="rental-filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`rental-cat-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-400">
            <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
            <p>Cargando catálogo de mobiliario...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state-card text-center py-12">
            <h3>No hay artículos en esta categoría</h3>
            <p>Selecciona otra categoría o explora todos nuestros productos.</p>
          </div>
        ) : (
          <div className="rental-products-grid services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="rentalProductsGrid">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="service-card border border-zinc-800 bg-zinc-900/60 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 relative overflow-hidden bg-zinc-900">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">
                        📦
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.stock > 0 && (
                      <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-medium">
                        Stock: {item.stock}
                      </span>
                    )}
                  </div>

                  <div className="service-card-content p-5">
                    <h3 className="text-white text-lg font-serif font-bold mb-2">
                      {item.name}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed line-clamp-2">
                      {item.description || "Mobiliario selecto y en perfecto estado para recepciones y banquetes."}
                    </p>

                    <div className="flex justify-between items-baseline mb-4 pt-3 border-t border-white/10">
                      <div>
                        <span className="text-2xl font-bold text-amber-300 font-serif">
                          ${item.price.toLocaleString("es-CO")}
                        </span>
                        <span className="text-xs text-zinc-400 ml-1">/ {item.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-3">
                  <div className="flex items-center border border-zinc-700 rounded-full overflow-hidden bg-zinc-900">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-zinc-300 hover:text-white text-sm hover:bg-zinc-800 transition"
                      onClick={() => setQty(item.id, getQty(item.id) - 1)}
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-semibold text-white">
                      {getQty(item.id)}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-zinc-300 hover:text-white text-sm hover:bg-zinc-800 transition"
                      onClick={() => setQty(item.id, getQty(item.id) + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn-apple-primary flex-1 justify-center py-2.5 text-sm font-semibold"
                    onClick={() => addToCart(item, getQty(item.id))}
                  >
                    🛒 Alquilar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
