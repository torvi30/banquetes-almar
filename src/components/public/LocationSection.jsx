import React from "react";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

export default function LocationSection() {
  const visitWpUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
    "Hola Banquetes Almar, deseo agendar una visita al salón en Marinilla y conocer sus instalaciones."
  )}`;

  return (
    <section className="section bg-gradient-to-b from-zinc-900/40 via-zinc-950 to-black" id="ubicacion">
      <div className="container">
        <div className="section-heading">
          <span className="section-label">📍 VISÍTANOS EN MARINILLA</span>
          <h2>
            Sede Principal de Eventos & <span className="gold-gradient-text">Sala de Degustación</span>
          </h2>
          <p>
            Estamos ubicados en el centro de eventos de Marinilla, Antioquia. Atendemos con cita previa
            para asesoría personalizada de diseño, visita guiada al salón y degustación gastronómica.
          </p>
          <div className="section-features-bar">
            <span className="section-feature-pill">📍 {BUSINESS_INFO.mainAddress}</span>
            <span className="section-feature-pill">📱 WhatsApp: {BUSINESS_INFO.mainPhone}</span>
            <span className="section-feature-pill">⏰ Lunes a Sábado con Cita Previa</span>
            <span className="section-feature-pill">☕ Café de Bienvenida</span>
          </div>
        </div>

        <div className="location-card bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-serif text-amber-300 text-3xl font-bold mb-4">
              Salón Banquetes Almar
            </h3>
            <p className="text-zinc-300 mb-6 leading-relaxed text-sm sm:text-base">
              Un espacio versátil, climatizado y con acústica profesional. Capacidad de hasta 200 personas,
              baños accesibles y zona para cocina y servicio.
            </p>

            <ul className="text-zinc-200 text-sm sm:text-base flex flex-col gap-3 mb-8">
              <li>
                📍 <strong>Dirección:</strong> {BUSINESS_INFO.mainAddress}, Colombia
              </li>
              <li>
                📱 <strong>Celular & WhatsApp:</strong> {BUSINESS_INFO.mainPhone}
              </li>
              <li>
                ☎️ <strong>Teléfono fijo:</strong> {BUSINESS_INFO.landlinePhone}
              </li>
              <li>
                ✉️ <strong>Correo electrónico:</strong> {BUSINESS_INFO.email}
              </li>
              <li>
                ⏰ <strong>Horario de atención:</strong> Lunes a Sábado con cita previa
              </li>
            </ul>

            <a
              href={visitWpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-apple-primary inline-flex items-center gap-2"
            >
              Agendar Visita al Salón
            </a>
          </div>

          <div className="location-map-wrap rounded-2xl overflow-hidden border border-zinc-800 h-80 lg:h-96">
            <iframe
              src="https://maps.google.com/maps?q=Marinilla%20Antioquia%20Calle%2029%2028-25&t=&z=16&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              title="Mapa de ubicación Banquetes Almar Marinilla"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
