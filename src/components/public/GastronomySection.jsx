import React from "react";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

export default function GastronomySection() {
  const tastingWpUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
    "Hola Banquetes Almar, deseo conocer las opciones del menú gastronómico y agendar degustación."
  )}`;

  return (
    <section className="section bg-gradient-to-b from-zinc-900/40 via-zinc-950 to-black" id="gastronomia">
      <div className="container">
        <div className="section-heading">
          <span className="section-label">🍽️ ALTA GASTRONOMÍA & BANQUETERÍA</span>
          <h2>
            Experiencia Culinaria & <span className="gold-gradient-text">Menús de Gala</span>
          </h2>
          <p>
            La cocina de Banquetes Almar combina ingredientes selectos, técnicas de alta cocina y emplatados elegantes de autor. Ofrecemos menús a varios tiempos preparados al instante con cocina propia en nuestras sedes y servicio de etiqueta impecable.
          </p>
          <div className="section-features-bar">
            <span className="section-feature-pill">👨‍🍳 Chef Ejecutivo Propio</span>
            <span className="section-feature-pill">🍷 Cena Formal a 3 Tiempos</span>
            <span className="section-feature-pill">🍸 Estación de Pasabocas & Brindis</span>
            <span className="section-feature-pill">✨ Degustación Previa de Regalo</span>
          </div>
        </div>

        {/* 4 PILARES GASTRONÓMICOS */}
        <div className="packages-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {/* PLATO 1: CENA FORMAL 3 TIEMPOS */}
          <article className="package-card active bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md">
            <div className="package-image-wrap h-52 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                alt="Cena de Gala a 3 Tiempos"
                className="package-image w-full h-full object-cover"
                loading="lazy"
              />
              <span className="package-badge bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold">
                Cena Formal
              </span>
            </div>
            <div className="package-body flex-1 flex flex-col justify-between p-5">
              <div>
                <h3 className="text-white text-xl font-serif font-bold mb-2">
                  Menú de Gala a 3 Tiempos
                </h3>
                <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Entrada de Autor + Plato Fuerte Selecto + Postre
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  Medallones de lomo en reducción de vino tinto o pechuga de gala rellena en salsa de quesos madurados, acompañados de risotto aromatizado o puré rústico y ensalada silvestre.
                </p>
              </div>
              <div className="border-t border-white/10 pt-3 text-xs text-zinc-400">
                ✨ Vajilla de porcelana, cubiertos dorados y servicio al plato.
              </div>
            </div>
          </article>

          {/* PLATO 2: PASABOCAS & CÓCTEL */}
          <article className="package-card active bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md">
            <div className="package-image-wrap h-52 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80"
                alt="Estación de Cóctel y Pasabocas"
                className="package-image w-full h-full object-cover"
                loading="lazy"
              />
              <span className="package-badge bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold">
                Recepción & Brindis
              </span>
            </div>
            <div className="package-body flex-1 flex flex-col justify-between p-5">
              <div>
                <h3 className="text-white text-xl font-serif font-bold mb-2">
                  Pasabocas & Estación de Cóctel
                </h3>
                <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Bocados Gourmet Calientes y Fríos
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  Canapés finos, volovanes de pollo al curry, brochetas caprese en reducción balsámica, mini quiches lorenes, tartaletas de mariscos y copas de mimosa o champaña de bienvenida.
                </p>
              </div>
              <div className="border-t border-white/10 pt-3 text-xs text-zinc-400">
                🥂 Ideal para el cóctel de bienvenida mientras llegan los invitados.
              </div>
            </div>
          </article>

          {/* PLATO 3: MESA DULCE & TORTA */}
          <article className="package-card active bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md">
            <div className="package-image-wrap h-52 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80"
                alt="Mesa Dulce y Torta de Gala"
                className="package-image w-full h-full object-cover"
                loading="lazy"
              />
              <span className="package-badge bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold">
                Repostería Fina
              </span>
            </div>
            <div className="package-body flex-1 flex flex-col justify-between p-5">
              <div>
                <h3 className="text-white text-xl font-serif font-bold mb-2">
                  Mesa de Postres & Torta
                </h3>
                <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Shots Dulces, Macarons & Torta Nupcial
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  Montaje temático con fuentes de cristal y chandeliers. Shots de mousse de maracuyá y chocolate belga, mini cheesecakes, trufas artesanales y torta de corte ceremonial.
                </p>
              </div>
              <div className="border-t border-white/10 pt-3 text-xs text-zinc-400">
                🎂 Decoración a juego con la paleta de colores del evento.
              </div>
            </div>
          </article>

          {/* PLATO 4: SERVICIO & PROTOCOLO */}
          <article className="package-card active bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md">
            <div className="package-image-wrap h-52 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                alt="Servicio y Protocolo Banquetes Almar"
                className="package-image w-full h-full object-cover"
                loading="lazy"
              />
              <span className="package-badge bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold">
                Personal de Etiqueta
              </span>
            </div>
            <div className="package-body flex-1 flex flex-col justify-between p-5">
              <div>
                <h3 className="text-white text-xl font-serif font-bold mb-2">
                  Servicio a la Mesa & Protocolo
                </h3>
                <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Atención Distinguida para Cada Invitado
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  Capitán de servicio, meseros uniformados de rigurosa etiqueta y bartenders profesionales para coctelería. Cronograma sincronizado con el vals, el brindis y la fiesta.
                </p>
              </div>
              <div className="border-t border-white/10 pt-3 text-xs text-zinc-400">
                👨‍🍳 Cocina industrial y servicio cálido propio de Antioquia.
              </div>
            </div>
          </article>
        </div>

        {/* BANNER DE DEGUSTACIÓN PREVIA DE REGALO */}
        <div className="bg-gradient-to-r from-zinc-900/95 via-zinc-950 to-amber-950/20 border border-amber-500/40 rounded-3xl p-8 sm:p-10 flex justify-between items-center flex-wrap gap-6 shadow-2xl shadow-black/80 backdrop-blur-md">
          <div className="max-w-2xl">
            <span className="bg-amber-500/15 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              ✨ Experiencia Exclusiva Almar
            </span>
            <h3 className="text-white font-serif text-2xl sm:text-3xl font-bold my-2">
              Degustación Previa de Menú para Anfitriones
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed m-0">
              Tu tranquilidad es nuestra prioridad. En todos nuestros paquetes de boda y quinceañera agendamos una sesión de cata y degustación para 2 a 4 personas en nuestra sede de Marinilla, donde probarán las opciones de menú y elegirán su favorito.
            </p>
          </div>

          <div>
            <a
              href={tastingWpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-apple-primary whitespace-nowrap px-7 py-3.5 text-sm font-semibold inline-block"
            >
              🍽️ Cotizar Menú por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
