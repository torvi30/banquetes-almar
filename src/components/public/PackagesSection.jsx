import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

export default function PackagesSection() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPackages, setExpandedPackages] = useState({});

  const togglePackage = (id) => {
    setExpandedPackages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    let isMounted = true;
    dbService.getPackages().then((data) => {
      if (isMounted) {
        setPackages(data || []);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const buildPackageWpUrl = (pkg) => {
    const text = `Hola Banquetes Almar, deseo cotizar el "${pkg.title}" (${pkg.pricePerPerson > 0 ? `$${pkg.pricePerPerson.toLocaleString("es-CO")} por persona` : "personalizado"}). ¿Tienen disponibilidad?`;
    return `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section className="section bg-zinc-950" id="paquetes">
      <div className="container">
        <div className="section-heading">
          <span className="section-label">💎 EXPERIENCIAS COMPLETAS SIN ESTRÉS</span>
          <h2>
            Colección de Paquetes <span className="gold-gradient-text">Todo Incluido de Gala</span>
          </h2>
          <p>
            Propuestas maestras diseñadas minuciosamente para que los anfitriones disfruten sin preocupaciones.
            Incluyen salón o montaje en finca, banquete gourmet a 3 tiempos, decoración floral de autor, mobiliario Tiffany y producción técnica integral.
          </p>
          <div className="section-features-bar">
            <span className="section-feature-pill">🛡️ Cero Costos Ocultos</span>
            <span className="section-feature-pill">🍽️ Banquete Gourmet & Degustación</span>
            <span className="section-feature-pill">💐 Decoración Floral de Autor</span>
            <span className="section-feature-pill">🔊 Cabezas Móviles, Humo & DJ en Vivo</span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-400">
            <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
            <p>Cargando paquetes de gala...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="empty-state-card text-center py-12">
            <h3>No hay paquetes publicados en este momento</h3>
            <p>Contáctanos directamente por WhatsApp para diseñar una propuesta a tu medida.</p>
          </div>
        ) : (
          <div className="packages-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="packagesListContainer">
            {packages.map((pkg) => (
              <article
                key={pkg.id}
                className="package-card border border-zinc-800 bg-zinc-900/60 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="package-image-wrap h-56 relative overflow-hidden">
                    {pkg.imageUrl ? (
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.title}
                        className="package-image w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-3xl">
                        💎
                      </div>
                    )}
                    {pkg.badge && (
                      <span className="package-badge bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black font-semibold">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <div className="package-body p-6">
                    <h3 className="package-title text-xl font-bold font-serif text-white mb-2">
                      {pkg.title}
                    </h3>
                    <p className="package-desc text-zinc-400 text-sm mb-4 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="package-price-wrap mb-4 pb-4 border-b border-white/10 flex justify-between items-baseline">
                      <div>
                        <span className="text-2xl font-bold text-amber-300 font-serif">
                          ${pkg.pricePerPerson.toLocaleString("es-CO")}
                        </span>
                        <span className="text-xs text-zinc-400 ml-1">/ persona</span>
                      </div>
                      <span className="text-xs text-zinc-400">
                        Mín. {pkg.minGuests} personas
                      </span>
                    </div>

                    {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 && (() => {
                      const isExpanded = !!expandedPackages[pkg.id];
                      const hasMore = pkg.inclusions.length > 3;
                      const visibleInclusions = isExpanded ? pkg.inclusions : pkg.inclusions.slice(0, 3);

                      return (
                        <div className="package-inclusions-wrapper mb-6">
                          <ul className="package-inclusions-list text-xs text-zinc-300 space-y-1.5 mb-3">
                            {visibleInclusions.map((inc, i) => (
                              <li key={i} className="leading-relaxed">
                                {inc}
                              </li>
                            ))}
                          </ul>

                          {hasMore && (
                            <button
                              type="button"
                              onClick={() => togglePackage(pkg.id)}
                              className="w-full text-xs font-medium py-2 px-3 rounded-lg border border-amber-400/25 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                            >
                              {isExpanded ? (
                                <>
                                  <span>Mostrar menos</span>
                                  <svg className="w-3.5 h-3.5 transform rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  <span>+ Ver {pkg.inclusions.length - 3} inclusiones más</span>
                                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={buildPackageWpUrl(pkg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-apple-primary w-full justify-center text-center block text-sm font-semibold py-3"
                  >
                    Cotizar este Paquete
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
