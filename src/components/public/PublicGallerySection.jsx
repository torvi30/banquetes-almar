import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import LightboxModal from "../common/LightboxModal.jsx";

export default function PublicGallerySection() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(["Todos"]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    let isMounted = true;
    Promise.all([dbService.getGallery(), dbService.getGalleryCategories()]).then(([galleryData, catData]) => {
      if (isMounted) {
        setItems(galleryData || []);
        setCategories(["Todos", ...(catData || [])]);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "Todos") return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(-1);
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section className="section bg-zinc-950" id="galeria">
      <div className="container">
        <div className="section-heading">
          <span className="section-label">📸 PORTAFOLIO VISUAL DE MONTAJES REALES</span>
          <h2>
            Galería de Bodas, <span className="gold-gradient-text">Quince Años & Fiestas de Gala</span>
          </h2>
          <p>
            Cada fotografía documenta momentos y montajes reales producidos por Banquetes Almar en el
            Salón de Marinilla y fincas campestres del Oriente Antioqueño. Explora nuestra decoración
            floral, mobiliario Tiffany, mantelería de autor, estaciones gastronómicas e iluminación de gala.
          </p>
          <div className="section-features-bar">
            <span className="section-feature-pill">🌟 100% Montajes Reales de Almar</span>
            <span className="section-feature-pill">🔍 Clic en Foto para Pantalla Completa</span>
            <span className="section-feature-pill">📲 Cotiza ese Mismo Montaje por WhatsApp</span>
            <span className="section-feature-pill">✨ Inspiración para Tu Fecha Especial</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="gallery-filters-bar flex flex-wrap gap-2.5 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all border ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-400">
            <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
            <p>Cargando galería de gala...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state-card text-center py-12">
            <h3>No hay fotos en esta categoría</h3>
            <p>Explora nuestras demás categorías para ver más montajes de gala.</p>
          </div>
        ) : (
          <div className="public-gallery-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="gallery-photo rounded-2xl overflow-hidden border border-zinc-800 relative group cursor-pointer h-64 bg-zinc-900"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-white text-sm font-bold font-serif">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LightboxModal
        isOpen={lightboxIndex >= 0}
        onClose={closeLightbox}
        currentItem={lightboxIndex >= 0 ? filteredItems[lightboxIndex] : null}
        onPrev={prevLightbox}
        onNext={nextLightbox}
        currentIndex={lightboxIndex}
        totalCount={filteredItems.length}
      />
    </section>
  );
}
