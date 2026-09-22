import React from "react";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

export default function VenuesSection() {
  const salonWpUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
    "Hola Banquetes Almar, deseo cotizar un evento en el Salón de Gala en Marinilla."
  )}`;

  const fincaWpUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
    "Hola Banquetes Almar, deseo cotizar un evento en la Finca Campestre en El Peñol."
  )}`;

  return (
    <section className="section bg-gradient-to-b from-zinc-900/50 via-zinc-950 to-black" id="sedes">
      <div className="container">
        <div className="section-heading">
          <span className="section-label">🏛️ LOCACIONES EXCLUSIVAS</span>
          <h2>
            Nuestras 2 Sedes: <span className="gold-gradient-text">Salón de Gala & Finca Campestre</span>
          </h2>
          <p>
            Dos escenarios únicos diseñados para crear atmósferas inolvidables en Marinilla y El Peñol según el estilo y magnitud de tu celebración.
          </p>
          <div className="section-features-bar">
            <span className="section-feature-pill">🏛️ Salón Marinilla (Hasta 200 pers)</span>
            <span className="section-feature-pill">🌄 Finca El Peñol (Hasta 250 pers)</span>
            <span className="section-feature-pill">👨‍🍳 Cocina Industrial Propia</span>
            <span className="section-feature-pill">🚗 Fácil Acceso & Parqueadero</span>
          </div>
        </div>

        <div className="sedes-cards-grid grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* SEDE 1: SALÓN MARINILLA */}
          <article className="package-card border border-zinc-800 bg-zinc-900/60 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="package-image-wrap h-64 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80"
                alt="Salón Banquetes Almar Marinilla"
                className="package-image"
              />
              <span className="package-badge bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black font-semibold">
                Sede 1 • Marinilla
              </span>
            </div>
            <div className="package-body">
              <h3 className="package-title text-2xl font-bold font-serif text-white">
                Salón de Gala Almar
              </h3>
              <p className="package-desc text-amber-300 font-medium text-sm">
                📍 {BUSINESS_INFO.mainAddress}
              </p>
              <p className="package-desc">
                Un recinto cerrado elegante, climatizado y con excelente acústica para rumba y fiesta. Ubicación céntrica de fácil acceso para todos tus invitados.
              </p>

              <ul className="package-inclusions-list">
                <li>Capacidad confortable para hasta 200 invitados</li>
                <li>Acceso accesible para personas con movilidad reducida</li>
                <li>Cocina industrial propia para servicio a la mesa al instante</li>
                <li>Tarima para sonido, cabezas móviles y pista de baile</li>
                <li>Ideal para bodas clásicas, 15 años y grados formales</li>
              </ul>

              <a
                href={salonWpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-apple-primary w-full justify-center mt-4 text-center block"
              >
                Cotizar en Salón Marinilla
              </a>
            </div>
          </article>

          {/* SEDE 2: FINCA EL PEÑOL */}
          <article className="package-card border border-zinc-800 bg-zinc-900/60 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="package-image-wrap h-64 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80"
                alt="Finca Campestre Almar El Peñol"
                className="package-image"
              />
              <span className="package-badge bg-gradient-to-r from-teal-300 to-indigo-300 text-black font-semibold">
                Sede 2 • El Peñol
              </span>
            </div>
            <div className="package-body">
              <h3 className="package-title text-2xl font-bold font-serif text-white">
                Finca Campestre Almar
              </h3>
              <p className="package-desc text-cyan-300 font-medium text-sm">
                🌄 {BUSINESS_INFO.countryHouseAddress}
              </p>
              <p className="package-desc">
                Naturaleza, atardeceres dorados y aire puro. El escenario soñado para celebraciones campestres, ceremonias nupciales en jardín y recepciones boho-chic.
              </p>

              <ul className="package-inclusions-list">
                <li>Capacidad para hasta 250 personas en áreas verdes</li>
                <li>Jardines para ceremonias campestres al aire libre</li>
                <li>Quiosco estructural con iluminación de hadas cálida</li>
                <li>Zona lounge con fogata nocturna (Fire pit)</li>
                <li>Ideal para bodas campestres, aniversarios y fiestas al aire libre</li>
              </ul>

              <a
                href={fincaWpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-apple-primary w-full justify-center mt-4 bg-gradient-to-r from-amber-200 to-indigo-300 text-black font-semibold hover:opacity-95 text-center block"
              >
                Cotizar en Finca El Peñol
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
