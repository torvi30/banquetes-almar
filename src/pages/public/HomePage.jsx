import React from "react";
import VenuesSection from "../../components/public/VenuesSection.jsx";
import PackagesSection from "../../components/public/PackagesSection.jsx";
import GastronomySection from "../../components/public/GastronomySection.jsx";
import AppleConfigurator from "../../components/public/AppleConfigurator.jsx";
import RentalCatalog from "../../components/public/RentalCatalog.jsx";
import PublicGallerySection from "../../components/public/PublicGallerySection.jsx";
import LocationSection from "../../components/public/LocationSection.jsx";

export default function HomePage() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero" id="inicio">
        <div className="hero-overlay bg-gradient-to-b from-zinc-950/40 via-zinc-950/70 to-black/90" />
        <div className="container hero-content">
          <p className="hero-tag bg-amber-500/15 border border-amber-500/40 text-amber-300 inline-block px-4 py-1.5 rounded-full mb-6 text-sm font-semibold tracking-wide">
            Salón de Gala en Marinilla & Finca Campestre en El Peñol
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white font-bold leading-tight mb-4">
            Celebra Momentos Inolvidables con Elegancia Excepcional
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-300 text-lg leading-relaxed mb-8">
            Bodas de ensueño, Quinceañeras mágicas, Grados y Eventos Empresariales. Dos sedes exclusivas
            en el Oriente Antioqueño: Salón de Gala en Marinilla y Finca Campestre en El Peñol, con alta
            gastronomía y producción integral.
          </p>

          <div className="hero-actions mt-10 flex gap-4 justify-center flex-wrap">
            <a href="#cotizador" className="btn-apple-primary text-base px-8 py-4">
              ✨ Configurar Evento al Instante
            </a>
            <a href="#sedes" className="btn-apple-secondary text-base px-8 py-4">
              🏛️ Conocer Nuestras 2 Sedes
            </a>
          </div>
        </div>
      </section>

      {/* 2 VENUES SECTION */}
      <VenuesSection />

      {/* PACKAGES SECTION */}
      <PackagesSection />

      {/* GASTRONOMY & BANQUETING SECTION */}
      <GastronomySection />

      {/* APPLE STUDIO CONFIGURATOR */}
      <AppleConfigurator />

      {/* RENTAL CATALOG */}
      <RentalCatalog />

      {/* REAL PHOTO GALLERY */}
      <PublicGallerySection />

      {/* LOCATION & CONTACT */}
      <LocationSection />
    </main>
  );
}
