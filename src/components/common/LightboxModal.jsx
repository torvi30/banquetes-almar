import React, { useEffect } from "react";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

export default function LightboxModal({
  isOpen,
  onClose,
  currentItem,
  onPrev,
  onNext,
  currentIndex = 0,
  totalCount = 0
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !currentItem) return null;

  const quoteUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
    `Hola Banquetes Almar, me encantó este montaje: "${currentItem.title || "Montaje de Gala"}" (${currentItem.category || "Galería"}). Deseo más información y cotización.`
  )}`;

  return (
    <div className="client-lightbox-overlay open" id="clientLightboxModal" aria-hidden={!isOpen}>
      <div className="client-lightbox-content" role="dialog" aria-modal="true">
        <button
          className="client-lightbox-close"
          id="clientLightboxClose"
          onClick={onClose}
          aria-label="Cerrar vista previa"
          type="button"
        >
          &times;
        </button>

        <div className="client-lightbox-image-stage">
          {totalCount > 1 && (
            <button
              className="client-lightbox-nav prev"
              id="clientLightboxPrev"
              onClick={onPrev}
              aria-label="Foto anterior"
              type="button"
            >
              &#8249;
            </button>
          )}
          <img
            src={currentItem.imageUrl}
            alt={currentItem.title || "Montaje Almar"}
            className="client-lightbox-img"
            id="clientLightboxImg"
          />
          {totalCount > 1 && (
            <button
              className="client-lightbox-nav next"
              id="clientLightboxNext"
              onClick={onNext}
              aria-label="Foto siguiente"
              type="button"
            >
              &#8250;
            </button>
          )}
        </div>

        <div className="client-lightbox-details">
          <div>
            <div className="client-lightbox-header">
              <span className="client-lightbox-category" id="clientLightboxCategory">
                ✨ {currentItem.category || "Banquetes Almar"}
              </span>
              {totalCount > 0 && (
                <span className="client-lightbox-counter" id="clientLightboxCounter">
                  {currentIndex + 1} de {totalCount}
                </span>
              )}
            </div>
            <h3 className="client-lightbox-title" id="clientLightboxTitle">
              {currentItem.title || "Montaje de Gala"}
            </h3>
            <p className="client-lightbox-desc" id="clientLightboxDesc">
              {currentItem.description ||
                "Diseño y decoración profesional para eventos en Marinilla y Antioquia."}
            </p>
          </div>

          <div className="client-lightbox-actions">
            <a
              href={quoteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-apple-primary w-full justify-center no-underline"
              id="clientLightboxWpBtn"
            >
              <span>💬 Cotizar Este Montaje</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
