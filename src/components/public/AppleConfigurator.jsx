import React, { useState, useMemo } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

const PRICING_MATRIX = {
  celebrations: {
    boda: { basePerPerson: 36000, label: "Boda Nupcial", icon: "💍" },
    quince: { basePerPerson: 32000, label: "Quince Años de Gala", icon: "👑" },
    grado: { basePerPerson: 26000, label: "Grado & Promoción", icon: "🎓" },
    social: { basePerPerson: 24000, label: "Primera Comunión / Bautizo", icon: "🕊️" },
    corporativo: { basePerPerson: 29000, label: "Evento Corporativo", icon: "👔" },
    personalizado: { basePerPerson: 28000, label: "Celebración Personalizada", icon: "✨" }
  },
  locations: {
    salon_almar: { fixedFee: 0, label: "Salón de Gala Almar (Marinilla)", icon: "🏛️" },
    finca_penol: { fixedFee: 300000, label: "Finca Campestre Almar (El Peñol)", icon: "🌄" },
    finca_oriente: { fixedFee: 450000, label: "A Domicilio en Tu Finca (Oriente Antioqueño)", icon: "🚚" }
  },
  caterings: {
    tradicional: { pricePerPerson: 38000, label: "Menú Tradicional", desc: "Plato fuerte balanceado con guarnición y bebida natural." },
    gala_2t: { pricePerPerson: 52000, label: "Menú de Gala (2 Tiempos)", desc: "Entrada gourmet, plato principal selecto y postre artesanal." },
    gourmet_3t: { pricePerPerson: 69000, label: "Menú Imperial (3 Tiempos)", desc: "Degustación previa para novios/anfitriones, 3 tiempos y cristalería de gala." },
    coctel: { pricePerPerson: 34000, label: "Estación de Pasabocas Gourmet", desc: "Mesa interactiva de bocados calientes y fríos, postres y bebidas." }
  },
  stagings: {
    tiffany_oro: { pricePerPerson: 16000, label: "Sillas Tiffany Doradas", desc: "Cojinería de lujo y manteles en damasco o terciopelo." },
    tiffany_blanca: { pricePerPerson: 15000, label: "Sillas Tiffany Blancas", desc: "Estilo limpio y luminoso con vajilla formal completa." },
    crossback: { pricePerPerson: 22000, label: "Sillas Crossback Madera Rústica", desc: "Madera natural vintage, ideal para ambiente campestre y bohemio." }
  },
  addons: {
    arco_floral: { price: 650000, label: "Arco Floral Natural & Backing", icon: "🌸" },
    dj_robotica: { price: 950000, label: "DJ en Vivo + Cabezas Robóticas", icon: "🎧" },
    pista_led: { price: 600000, label: "Pista de Baile LED Iluminada", icon: "✨" },
    hora_loca: { price: 380000, label: "Show de Carnaval & Hora Loca", icon: "🎭" },
    cabina_360: { price: 420000, label: "Cabina de Video 360° (2 Horas)", icon: "📹" },
    brindis_champagne: { price: 280000, label: "Brindis Protocolario con Champaña", icon: "🥂" }
  }
};

const PRESET_GUESTS = [35, 50, 80, 100, 150, 200];

export default function AppleConfigurator() {
  const [celebration, setCelebration] = useState("boda");
  const [customCelebrationName, setCustomCelebrationName] = useState("");
  const [guests, setGuests] = useState(80);
  const [location, setLocation] = useState("salon_almar");
  const [catering, setCatering] = useState("gala_2t");
  const [staging, setStaging] = useState("tiffany_oro");
  const [selectedAddons, setSelectedAddons] = useState(new Set(["arco_floral", "dj_robotica"]));

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  // Form fields
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadDate, setLeadDate] = useState("");
  const [leadNotes, setLeadNotes] = useState("");

  const toggleAddon = (id) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Calculations
  const calc = useMemo(() => {
    const cel = PRICING_MATRIX.celebrations[celebration] || PRICING_MATRIX.celebrations.boda;
    const loc = PRICING_MATRIX.locations[location] || PRICING_MATRIX.locations.salon_almar;
    const cat = PRICING_MATRIX.caterings[catering] || PRICING_MATRIX.caterings.gala_2t;
    const stg = PRICING_MATRIX.stagings[staging] || PRICING_MATRIX.stagings.tiffany_oro;

    const perPersonUnit = cel.basePerPerson + cat.pricePerPerson + stg.pricePerPerson;
    const guestsSubtotal = perPersonUnit * guests;

    let fixedTotal = loc.fixedFee;
    selectedAddons.forEach((id) => {
      const addon = PRICING_MATRIX.addons[id];
      if (addon) fixedTotal += addon.price;
    });

    const total = guestsSubtotal + fixedTotal;
    const perPersonFinal = Math.round(total / guests);
    const depositSuggested = Math.round(total * 0.3);

    return {
      total,
      perPersonFinal,
      depositSuggested,
      guestsSubtotal,
      fixedTotal
    };
  }, [celebration, location, catering, staging, selectedAddons, guests]);

  const activeCelebrationLabel =
    celebration === "personalizado" && customCelebrationName.trim()
      ? customCelebrationName.trim()
      : PRICING_MATRIX.celebrations[celebration]?.label || "Celebración Especial";

  const handleLeadSubmit = async (e) => {
    e.preventDefault();

    const loc = PRICING_MATRIX.locations[location];
    const cat = PRICING_MATRIX.caterings[catering];
    const stg = PRICING_MATRIX.stagings[staging];

    const addonsText = Array.from(selectedAddons)
      .map((id) => `• ${PRICING_MATRIX.addons[id]?.label || id}`)
      .join("\n");

    // Save to Firestore
    try {
      await dbService.addQuote({
        clientName: leadName,
        phone: leadPhone,
        eventType: activeCelebrationLabel,
        location: loc.label,
        guestCount: guests,
        estimatedTotal: calc.total,
        suggestedDeposit: calc.depositSuggested,
        eventDate: leadDate || "Por definir",
        message: `Menú: ${cat.label}\nMobiliario: ${stg.label}\nAdicionales:\n${addonsText}${
          leadNotes ? `\nNotas: ${leadNotes}` : ""
        }`
      });
    } catch (err) {
      console.warn("Offline quote fallback:", err);
    }

    setIsLeadModalOpen(false);

    // Build WhatsApp message
    const message = `💎 *COTIZACIÓN EXCLUSIVA - BANQUETES ALMAR* 💎
──────────────────────────────
👤 *Anfitrión:* ${leadName}
📱 *Contacto:* ${leadPhone}
📅 *Fecha Tentativa:* ${leadDate || "Por definir"}
👥 *Invitados:* ${guests} personas
✨ *Tipo de Evento:* ${activeCelebrationLabel}
🏛️ *Locación:* ${loc.label}

🍽️ *Gastronomía:* ${cat.label}
🪑 *Mobiliario & Estilo:* ${stg.label}
${selectedAddons.size > 0 ? `\n🌟 *Servicios y Producción Especial:*\n${addonsText}\n` : ""}${
      leadNotes ? `\n📝 *Notas:* ${leadNotes}\n` : ""
    }──────────────────────────────
💰 *INVERSIÓN TOTAL ESTIMADA:* $${calc.total.toLocaleString("es-CO")} COP
🏷️ *Inversión por Invitado:* $${calc.perPersonFinal.toLocaleString("es-CO")} COP
💵 *Anticipo Sugerido para Reserva (30%):* $${calc.depositSuggested.toLocaleString("es-CO")} COP
──────────────────────────────
Solicito verificar disponibilidad de fecha en el salón de Marinilla (Calle 29 # 28-25) o Finca Campestre Almar.`;

    const url = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="section bg-zinc-950" id="cotizador">
      <div className="container">
        <div className="section-heading">
          <span className="section-label">✨ COTIZADOR INTELIGENTE EN TIEMPO REAL</span>
          <h2>
            Diseña Tu Celebración <span className="gold-gradient-text">a la Medida</span>
          </h2>
          <p>
            Calcula al instante la inversión exacta para tu evento. Personaliza ocasión, invitados,
            locación, menú y servicios adicionales con total transparencia y cotización instantánea.
          </p>
          <div className="section-features-bar">
            <span className="section-feature-pill">⚡ Presupuesto en Segundos</span>
            <span className="section-feature-pill">📄 Propuesta Formal en PDF</span>
            <span className="section-feature-pill">📲 Envío Directo a WhatsApp Almar</span>
            <span className="section-feature-pill">💳 Facilidades de Pago & Reserva con 30%</span>
          </div>
        </div>

        {/* 2-COLUMN STUDIO LAYOUT */}
        <div className="studio-layout">
          {/* LEFT COLUMN: STEPS */}
          <div className="studio-steps-column studio-configurator">
            {/* STEP 1: CELEBRATION TYPE */}
            <div className="studio-step-header">
              <span className="studio-step-number">1</span>
              <h3 className="studio-step-title">Tipo de Celebración</h3>
              <span className="studio-step-desc">Selecciona la ocasión o escribe la tuya</span>
            </div>

            <div className="celebration-selector-grid" id="celebrationSelectorGrid">
              {[
                { type: "boda", icon: "💍", name: "Boda" },
                { type: "quince", icon: "👑", name: "Quince Años" },
                { type: "grado", icon: "🎓", name: "Grado" },
                { type: "social", icon: "🕊️", name: "Comunión / Bautizo" },
                { type: "corporativo", icon: "👔", name: "Corporativo" },
                { type: "personalizado", icon: "✨", name: "Otra Ocasión" }
              ].map((c) => (
                <button
                  key={c.type}
                  type="button"
                  className={`celebration-card segment-celebration ${celebration === c.type ? "active" : ""}`}
                  onClick={() => setCelebration(c.type)}
                >
                  <span className="celebration-card-icon">{c.icon}</span>
                  <span className="celebration-card-name">{c.name}</span>
                </button>
              ))}
            </div>

            {/* Custom Celebration Input */}
            {celebration === "personalizado" && (
              <div className="custom-celebration-wrapper" style={{ display: "block" }}>
                <div className="custom-celebration-card">
                  <span className="custom-celebration-icon">✍️</span>
                  <input
                    type="text"
                    className="custom-celebration-input"
                    placeholder="Escribe tu tipo de celebración (Ej: Aniversario, Cumpleaños 50, Baby Shower...)"
                    maxLength={60}
                    value={customCelebrationName}
                    onChange={(e) => setCustomCelebrationName(e.target.value)}
                    autoFocus
                  />
                  <span className="custom-celebration-badge">Personalizado</span>
                </div>
              </div>
            )}

            {/* STEP 2: NUMBER OF GUESTS */}
            <div className="studio-step-header">
              <span className="studio-step-number">2</span>
              <h3 className="studio-step-title">Número de Invitados</h3>
            </div>

            <div className="guest-dial-container">
              {/* Stepper with prominent display */}
              <div className="guest-stepper-panel">
                <button
                  type="button"
                  className="btn-guest-stepper"
                  onClick={() => setGuests((g) => Math.max(20, g - 5))}
                  title="Reducir 5 invitados"
                  aria-label="Reducir 5 invitados"
                >
                  <span>−</span>
                </button>

                <div className="guest-count-center">
                  <div className="guest-count-display">
                    <span>{guests}</span>
                    <span className="guest-count-unit">invitados</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-guest-stepper"
                  onClick={() => setGuests((g) => Math.min(300, g + 5))}
                  title="Aumentar 5 invitados"
                  aria-label="Aumentar 5 invitados"
                >
                  <span>+</span>
                </button>
              </div>

              {/* Quick Presets */}
              <div className="guest-presets-box">
                <div className="guest-presets guest-presets-clean">
                  {PRESET_GUESTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`preset-chip ${guests === preset ? "active" : ""}`}
                      onClick={() => setGuests(preset)}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Range Slider */}
              <div className="guest-slider-container">
                <div className="slider-labels-row">
                  <span>20</span>
                  <span>150</span>
                  <span>300</span>
                </div>
                <input
                  type="range"
                  className="apple-slider"
                  min="20"
                  max="300"
                  step="5"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                />
              </div>

              {/* Capacity Note */}
              <div className="capacity-indicator">
                {location === "finca_penol" ? (
                  <>
                    🌄 <strong>Finca Campestre El Peñol:</strong> Rodeada de naturaleza, jardines y quiosco campestre. Capacidad de hasta 250 invitados con vista panorámica.
                  </>
                ) : location === "salon_almar" ? (
                  guests > 180 ? (
                    <>
                      🌟 <strong>Salón Marinilla:</strong> Para {guests} personas habilitamos distribución especial de pista y montaje optimizado.
                    </>
                  ) : (
                    <>
                      ✨ <strong>Salón Marinilla:</strong> Aforo perfecto y confort climatizado en Calle 29 # 28-25 (hasta 200 personas).
                    </>
                  )
                ) : (
                  <>
                    🚚 <strong>Montaje a Domicilio:</strong> Llevamos menaje, cocina y carpas a cualquier finca del Oriente Antioqueño.
                  </>
                )}
              </div>
            </div>

            {/* STEP 3: LOCATION */}
            <div className="studio-step-header">
              <span className="studio-step-number">3</span>
              <h3 className="studio-step-title">Locación del Evento</h3>
              <span className="studio-step-desc">Salón propio o finca campestre</span>
            </div>

            <div className="interactive-tiles-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                className={`selectable-tile tile-location ${location === "salon_almar" ? "active" : ""}`}
                onClick={() => setLocation("salon_almar")}
              >
                <span className="tile-badge">Sede Urbana</span>
                <div>
                  <span className="tile-icon">🏛️</span>
                  <h4 className="tile-title">Salón de Gala (Marinilla)</h4>
                  <p className="tile-desc">Calle 29 # 28-25 Marinilla. Climatizado, acústica para fiesta, cocina industrial y fácil acceso.</p>
                </div>
                <span className="tile-price">Incluido en la propuesta</span>
              </div>

              <div
                className={`selectable-tile tile-location ${location === "finca_penol" ? "active" : ""}`}
                onClick={() => setLocation("finca_penol")}
              >
                <span className="tile-badge bg-gradient-to-r from-teal-300 to-indigo-300 text-black font-semibold">
                  Sede Campestre
                </span>
                <div>
                  <span className="tile-icon">🌄</span>
                  <h4 className="tile-title">Finca Almar (El Peñol)</h4>
                  <p className="tile-desc">Entorno campestre cerca a la represa. Jardines para ceremonias, quiosco nocturno, fogata y vista natural.</p>
                </div>
                <span className="tile-price">+$300.000 uso campestre</span>
              </div>

              <div
                className={`selectable-tile tile-location ${location === "finca_oriente" ? "active" : ""}`}
                onClick={() => setLocation("finca_oriente")}
              >
                <span className="tile-badge">A Domicilio</span>
                <div>
                  <span className="tile-icon">🚚</span>
                  <h4 className="tile-title">Tu Propia Finca (Oriente)</h4>
                  <p className="tile-desc">Traslado de menaje, cocina y montaje a fincas en Rionegro, El Retiro, Guarne, La Ceja o El Carmen.</p>
                </div>
                <span className="tile-price">+$450.000 logística</span>
              </div>
            </div>

            {/* STEP 4: GASTRONOMY */}
            <div className="studio-step-header">
              <span className="studio-step-number">4</span>
              <h3 className="studio-step-title">Experiencia Gastronómica</h3>
              <span className="studio-step-desc">Menús de gala y degustación previa</span>
            </div>

            <div className="interactive-tiles-grid">
              <div
                className={`selectable-tile tile-catering ${catering === "tradicional" ? "active" : ""}`}
                onClick={() => setCatering("tradicional")}
              >
                <div>
                  <span className="tile-icon">🍲</span>
                  <h4 className="tile-title">Menú Tradicional</h4>
                  <p className="tile-desc">Plato principal con opciones de carnes seleccionadas, guarnición y bebida natural.</p>
                </div>
                <span className="tile-price">$38.000 / persona</span>
              </div>

              <div
                className={`selectable-tile tile-catering ${catering === "gala_2t" ? "active" : ""}`}
                onClick={() => setCatering("gala_2t")}
              >
                <span className="tile-badge">Más Popular</span>
                <div>
                  <span className="tile-icon">🍽️</span>
                  <h4 className="tile-title">Menú de Gala (2 Tiempos)</h4>
                  <p className="tile-desc">Entrada gourmet, plato fuerte selecto (lomo o pechuga rellena), postre artesanal y bebidas.</p>
                </div>
                <span className="tile-price">$52.000 / persona</span>
              </div>

              <div
                className={`selectable-tile tile-catering ${catering === "gourmet_3t" ? "active" : ""}`}
                onClick={() => setCatering("gourmet_3t")}
              >
                <span className="tile-badge">Alta Gama</span>
                <div>
                  <span className="tile-icon">🍷</span>
                  <h4 className="tile-title">Menú Imperial (3 Tiempos)</h4>
                  <p className="tile-desc">Degustación previa para novios/anfitriones, 3 tiempos de alta cocina y cristalería de gala.</p>
                </div>
                <span className="tile-price">$69.000 / persona</span>
              </div>

              <div
                className={`selectable-tile tile-catering ${catering === "coctel" ? "active" : ""}`}
                onClick={() => setCatering("coctel")}
              >
                <div>
                  <span className="tile-icon">🍸</span>
                  <h4 className="tile-title">Estación Cóctel & Pasabocas</h4>
                  <p className="tile-desc">Mesa interactiva con variedades de pasabocas calientes y fríos, postres y coctelería.</p>
                </div>
                <span className="tile-price">$34.000 / persona</span>
              </div>
            </div>

            {/* STEP 5: FURNITURE / STAGING */}
            <div className="studio-step-header">
              <span className="studio-step-number">5</span>
              <h3 className="studio-step-title">Mobiliario & Estilo</h3>
              <span className="studio-step-desc">El confort y la estética de tus invitados</span>
            </div>

            <div className="interactive-tiles-grid">
              <div
                className={`selectable-tile tile-staging ${staging === "tiffany_oro" ? "active" : ""}`}
                onClick={() => setStaging("tiffany_oro")}
              >
                <span className="tile-badge">Elegancia Clásica</span>
                <div>
                  <span className="tile-icon">🪑</span>
                  <h4 className="tile-title">Sillas Tiffany Doradas</h4>
                  <p className="tile-desc">Con cojinería acolchada de lujo, mesas vestidas y mantelería en finos textiles.</p>
                </div>
                <span className="tile-price">$16.000 / puesto</span>
              </div>

              <div
                className={`selectable-tile tile-staging ${staging === "tiffany_blanca" ? "active" : ""}`}
                onClick={() => setStaging("tiffany_blanca")}
              >
                <div>
                  <span className="tile-icon">🤍</span>
                  <h4 className="tile-title">Sillas Tiffany Blancas</h4>
                  <p className="tile-desc">Estilo fresco, minimalista y luminoso. Excelente para recepciones diurnas y quinceaños.</p>
                </div>
                <span className="tile-price">$15.000 / puesto</span>
              </div>

              <div
                className={`selectable-tile tile-staging ${staging === "crossback" ? "active" : ""}`}
                onClick={() => setStaging("crossback")}
              >
                <span className="tile-badge">Tendencia Vintage</span>
                <div>
                  <span className="tile-icon">🪵</span>
                  <h4 className="tile-title">Crossback Madera Rústica</h4>
                  <p className="tile-desc">Madera natural artesanal, favorita para bodas campestres y boho chic en el Oriente.</p>
                </div>
                <span className="tile-price">$22.000 / puesto</span>
              </div>
            </div>

            {/* STEP 6: ADD-ONS */}
            <div className="studio-step-header">
              <span className="studio-step-number">6</span>
              <h3 className="studio-step-title">Producción Especial & Adicionales</h3>
              <span className="studio-step-desc">Toca para activar o desactivar servicios</span>
            </div>

            <div className="addon-chips-grid">
              {Object.entries(PRICING_MATRIX.addons).map(([id, addon]) => {
                const isActive = selectedAddons.has(id);
                return (
                  <div
                    key={id}
                    className={`addon-chip ${isActive ? "active" : ""}`}
                    onClick={() => toggleAddon(id)}
                  >
                    <div className="addon-chip-info">
                      <span className="addon-checkbox-circle">{isActive ? "✓" : ""}</span>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {addon.icon} {addon.label}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-amber-300 text-xs sm:text-sm">
                      +${addon.price.toLocaleString("es-CO")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY SUMMARY */}
          <aside className="studio-summary-column">
            <div className="studio-summary-card" id="studioSummaryCard">
              <div className="summary-card-header">
                <span className="summary-badge">⚡ Cotización en Vivo</span>
                <h4 className="summary-title">Resumen de Inversión</h4>
                <p className="summary-subtitle">Total consolidado con transparencia absoluta</p>
              </div>

              {/* Pricing Block */}
              <div className="summary-pricing-block">
                <span className="summary-price-caption">Inversión Total Estimada</span>
                <div className="summary-total-amount">
                  <span className="summary-total-val">${calc.total.toLocaleString("es-CO")}</span>
                </div>
                <div className="summary-per-guest-row">
                  <span className="summary-per-guest-text">
                    Equivale a{" "}
                    <strong className="text-amber-300 font-bold">
                      ${calc.perPersonFinal.toLocaleString("es-CO")}
                    </strong>{" "}
                    / persona
                  </span>
                </div>
                <div className="summary-deposit-row">
                  <span>Anticipo de separación (30%):</span>
                  <strong className="text-white font-bold">
                    ${calc.depositSuggested.toLocaleString("es-CO")}
                  </strong>
                </div>
              </div>

              {/* Specs Breakdown */}
              <div className="summary-specs-list">
                <div className="summary-spec-item">
                  <span className="spec-label">Celebración:</span>
                  <span className="spec-value">{activeCelebrationLabel}</span>
                </div>
                <div className="summary-spec-item">
                  <span className="spec-label">Invitados:</span>
                  <span className="spec-value">{guests} personas</span>
                </div>
                <div className="summary-spec-item">
                  <span className="spec-label">Locación:</span>
                  <span className="spec-value">{PRICING_MATRIX.locations[location]?.label}</span>
                </div>
                <div className="summary-spec-item">
                  <span className="spec-label">Banquete:</span>
                  <span className="spec-value">{PRICING_MATRIX.caterings[catering]?.label}</span>
                </div>
                <div className="summary-spec-item">
                  <span className="spec-label">Mobiliario:</span>
                  <span className="spec-value">{PRICING_MATRIX.stagings[staging]?.label}</span>
                </div>
                <div className="summary-spec-item">
                  <span className="spec-label">Adicionales:</span>
                  <span className="spec-value">{selectedAddons.size} servicios</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="summary-actions-box">
                <button
                  type="button"
                  className="btn-apple-primary btn-summary-cta"
                  onClick={() => setIsLeadModalOpen(true)}
                >
                  📲 Enviar a WhatsApp Almar
                </button>
                <button
                  type="button"
                  className="btn-apple-secondary btn-summary-sub"
                  onClick={() => setIsProposalModalOpen(true)}
                >
                  📄 Ver Propuesta Formal (PDF)
                </button>
              </div>

              {/* Trust Footer */}
              <div className="summary-trust-footer">
                <div className="trust-bullet">
                  <span>✓</span> Degustación de menú incluida
                </div>
                <div className="trust-bullet">
                  <span>✓</span> Contrato formal y garantía Almar
                </div>
                <div className="trust-bullet">
                  <span>✓</span> Sin costos sorpresa ni imprevistos
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* MOBILE STICKY FLOATING BAR */}
        <div className="mobile-cotizador-bar" id="mobileCotizadorBar">
          <div className="mobile-cotizador-info">
            <span className="mobile-cotizador-label">Total Estimado</span>
            <span className="mobile-cotizador-total">${calc.total.toLocaleString("es-CO")}</span>
          </div>
          <div className="mobile-cotizador-actions">
            <button
              type="button"
              className="btn-mobile-quote-cta"
              onClick={() => setIsLeadModalOpen(true)}
            >
              <span>📲 Cotizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* LEAD CONFIRMATION MODAL */}
      {isLeadModalOpen && (
        <div className="apple-modal-overlay open">
          <div className="apple-modal-content">
            <button
              type="button"
              className="apple-modal-close"
              onClick={() => setIsLeadModalOpen(false)}
            >
              &times;
            </button>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--apple-gold-light)",
                  fontWeight: 700
                }}
              >
                Experiencia Personalizada
              </span>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#fff",
                  fontSize: "1.8rem",
                  marginTop: "0.3rem"
                }}
              >
                Confirmar Cotización
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--apple-text-secondary)",
                  maxWidth: "420px",
                  margin: "0.5rem auto 0"
                }}
              >
                {activeCelebrationLabel} para {guests} personas en{" "}
                {PRICING_MATRIX.locations[location]?.label}.
              </p>
            </div>

            <div
              style={{
                background: "rgba(212, 175, 55, 0.08)",
                border: "1px dashed var(--apple-gold)",
                borderRadius: "12px",
                padding: "1rem 1.2rem",
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem"
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--apple-text-secondary)",
                    textTransform: "uppercase"
                  }}
                >
                  Inversión Total Estimada
                </span>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "#fff",
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  ${calc.total.toLocaleString("es-CO")} COP
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--apple-gold-light)",
                    textTransform: "uppercase"
                  }}
                >
                  Anticipo Sugerido (30%)
                </span>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--apple-gold-light)"
                  }}
                >
                  ${calc.depositSuggested.toLocaleString("es-CO")} COP
                </div>
              </div>
            </div>

            <form onSubmit={handleLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#ccc", marginBottom: "0.3rem" }}>
                  Nombre y Apellidos del Anfitrión *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Valentina Gómez Restrepo"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    background: "#121214",
                    border: "1px solid var(--apple-border)",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "0.95rem"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#ccc", marginBottom: "0.3rem" }}>
                    WhatsApp / Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 314 884 9011"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      background: "#121214",
                      border: "1px solid var(--apple-border)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#ccc", marginBottom: "0.3rem" }}>
                    Fecha Tentativa *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={leadDate}
                    onChange={(e) => setLeadDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      background: "#121214",
                      border: "1px solid var(--apple-border)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "0.95rem",
                      colorScheme: "dark"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#ccc", marginBottom: "0.3rem" }}>
                  Notas o Requerimientos Especiales (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Preferencia por menú vegetariano para 10 personas, llegada a las 4:00 PM..."
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "#121214",
                    border: "1px solid var(--apple-border)",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "0.85rem",
                    resize: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                <button
                  type="submit"
                  className="btn-apple-primary"
                  style={{ flex: 1, minWidth: "200px", padding: "0.9rem", justifyContent: "center" }}
                >
                  💬 Enviar Cotización por WhatsApp
                </button>
                <button
                  type="button"
                  className="btn-apple-secondary"
                  style={{ padding: "0.9rem 1.2rem", justifyContent: "center" }}
                  onClick={() => {
                    setIsLeadModalOpen(false);
                    setIsProposalModalOpen(true);
                  }}
                >
                  📄 Ver PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORMAL PROPOSAL MODAL (PRINTABLE PDF VIEW) */}
      {isProposalModalOpen && (
        <div className="apple-modal-overlay open">
          <div className="apple-modal-content" id="printableProposal">
            <button
              type="button"
              className="apple-modal-close"
              onClick={() => setIsProposalModalOpen(false)}
            >
              &times;
            </button>

            <div
              style={{
                textAlign: "center",
                borderBottom: "1px solid var(--apple-border)",
                paddingBottom: "1.5rem",
                marginBottom: "1.5rem"
              }}
            >
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "var(--apple-gold-light)",
                  fontSize: "1.8rem"
                }}
              >
                Banquetes Almar
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--apple-text-secondary)" }}>
                {BUSINESS_INFO.slogan}
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--apple-text-tertiary)" }}>
                📍 {BUSINESS_INFO.mainAddress} • 📞 {BUSINESS_INFO.mainPhone}
              </p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "0.8rem" }}>
                Resumen de la Propuesta:
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", color: "#ddd" }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "0.5rem 0" }}>Celebración:</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#fff" }}>
                      {activeCelebrationLabel}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "0.5rem 0" }}>Invitados:</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#fff" }}>
                      {guests} personas
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "0.5rem 0" }}>Locación:</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#fff" }}>
                      {PRICING_MATRIX.locations[location]?.label}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "0.5rem 0" }}>Gastronomía:</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#fff" }}>
                      {PRICING_MATRIX.caterings[catering]?.label}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "0.5rem 0" }}>Mobiliario & Estilo:</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#fff" }}>
                      {PRICING_MATRIX.stagings[staging]?.label}
                    </td>
                  </tr>
                  {selectedAddons.size > 0 && (
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <td style={{ padding: "0.5rem 0", verticalAlign: "top" }}>Producción y Adicionales:</td>
                      <td style={{ textAlign: "right", color: "var(--apple-gold-light)" }}>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {Array.from(selectedAddons).map((id) => (
                            <li key={id}>{PRICING_MATRIX.addons[id]?.label || id}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                  <tr style={{ borderTop: "2px solid var(--apple-gold)", fontWeight: 700 }}>
                    <td style={{ padding: "0.8rem 0", color: "#fff", fontSize: "1.05rem" }}>
                      Inversión Total Estimada:
                    </td>
                    <td style={{ textAlign: "right", color: "var(--apple-gold-light)", fontSize: "1.3rem" }}>
                      ${calc.total.toLocaleString("es-CO")} COP
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.2rem 0", color: "#aaa", fontSize: "0.85rem" }}>
                      Anticipo sugerido (30%):
                    </td>
                    <td style={{ textAlign: "right", color: "#fff", fontSize: "0.95rem" }}>
                      ${calc.depositSuggested.toLocaleString("es-CO")} COP
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-apple-primary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => window.print()}
              >
                🖨️ Imprimir / Guardar en PDF
              </button>
              <button
                type="button"
                className="btn-apple-secondary"
                style={{ justifyContent: "center" }}
                onClick={() => setIsProposalModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
