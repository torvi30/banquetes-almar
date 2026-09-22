import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { alertService } from "../../services/alertService.js";
import { DEFAULT_ANNOUNCEMENT } from "../../config/businessInfo.js";

const PRESETS = [
  {
    icon: "✨",
    title: "Temporada de Eventos 2026-2027:",
    message: "Salón de Gala en Marinilla & Finca Campestre en El Peñol",
    badge: "Oriente Antioqueño",
    subtext: "Degustación Previa de Menú Incluida"
  },
  {
    icon: "💍",
    title: "Mes de las Bodas de Ensueño:",
    message: "Reserva tu fecha y recibe cortesía especial en iluminación robótica",
    badge: "Marinilla • El Peñol",
    subtext: "Cupos Limitados para Sábados"
  },
  {
    icon: "🪑",
    title: "Alquiler de Mobiliario de Lujo:",
    message: "Sillas Tiffany Doradas, Crossback y Carpas Estructurales",
    badge: "Entrega Inmediata",
    subtext: "Cobertura en Todo el Oriente"
  }
];

export default function AdminAnnouncementPage() {
  const [formState, setFormState] = useState(DEFAULT_ANNOUNCEMENT);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    dbService.getAnnouncement().then((data) => {
      if (isMounted) {
        if (data) setFormState(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleApplyPreset = (preset) => {
    setFormState((prev) => ({
      ...prev,
      ...preset
    }));
    alertService.toast("Plantilla aplicada");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dbService.updateAnnouncement(formState);
      alertService.success(
        "¡Anuncio Actualizado!",
        "La franja superior en la portada de Banquetes Almar fue actualizada en vivo."
      );
    } catch (err) {
      alertService.error("Error", "No se pudo actualizar el anuncio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
          Marketing & Portada
        </span>
        <h1 className="font-serif text-3xl font-bold text-white mt-1">
          Barra de Anuncios Superior
        </h1>
        <p className="text-zinc-400 text-sm">
          Personaliza la franja de noticias y promociones de gala visible en el encabezado de la web pública.
        </p>
      </div>

      {/* LIVE PREVIEW CONTAINER */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Vista Previa en Tiempo Real
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              formState.isActive
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-zinc-800 text-zinc-500 border-zinc-700"
            }`}
          >
            {formState.isActive ? "🟢 Visible al Público" : "⚪ Desactivada"}
          </span>
        </div>

        {/* Real Banner Simulation */}
        <div className="top-announcement-bar rounded-xl overflow-hidden shadow-2xl">
          <div className="announcement-inner flex justify-between items-center flex-wrap gap-2 px-4 py-2 text-xs">
            <div className="announcement-left flex items-center gap-2">
              <span className="announcement-sparkle">{formState.icon || "✨"}</span>
              <span className="announcement-highlight font-bold text-amber-200">
                {formState.title}
              </span>
              <span className="announcement-venues text-zinc-300">{formState.message}</span>
            </div>
            <div className="announcement-right flex items-center gap-2">
              {formState.badge && (
                <span className="announcement-badge bg-amber-500/15 border border-amber-500/35 text-amber-200 px-2 py-0.5 rounded-full text-[10px]">
                  {formState.badge}
                </span>
              )}
              {formState.subtext && (
                <>
                  <span className="announcement-dot text-zinc-500">&bull;</span>
                  <span className="text-zinc-300 text-xs">{formState.subtext}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PRESETS */}
      <div className="mb-6">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
          Plantillas Rápidas:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-left p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition text-xs group"
            >
              <div className="font-semibold text-white group-hover:text-amber-300 flex items-center gap-1.5 mb-1">
                <span>{p.icon}</span>
                <span>{p.title}</span>
              </div>
              <div className="text-[11px] text-zinc-500 line-clamp-1">{p.message}</div>
            </button>
          ))}
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSave}
        className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md space-y-4 text-sm"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="font-semibold text-white block">Estado de la Franja</span>
            <span className="text-xs text-zinc-400">
              Activa o desactiva la visibilidad en la cabecera del sitio
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formState.isActive}
              onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Emoji / Ícono
            </label>
            <input
              type="text"
              required
              value={formState.icon}
              onChange={(e) => setFormState({ ...formState, icon: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-center text-lg"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Título Destacado *
            </label>
            <input
              type="text"
              required
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              placeholder="Ej: Temporada de Bodas 2026-2027:"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Mensaje Principal *
          </label>
          <input
            type="text"
            required
            value={formState.message}
            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
            placeholder="Ej: Salón de Gala en Marinilla & Finca Campestre en El Peñol"
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Distintivo / Badge
            </label>
            <input
              type="text"
              value={formState.badge}
              onChange={(e) => setFormState({ ...formState, badge: e.target.value })}
              placeholder="Ej: Oriente Antioqueño"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Texto Complementario
            </label>
            <input
              type="text"
              value={formState.subtext}
              onChange={(e) => setFormState({ ...formState, subtext: e.target.value })}
              placeholder="Ej: Degustación Previa Incluida"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full justify-center py-3 text-sm font-semibold"
          >
            {saving ? "Guardando cambios..." : "Guardar y Publicar en la Web"}
          </button>
        </div>
      </form>
    </div>
  );
}
