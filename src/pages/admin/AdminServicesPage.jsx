import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { alertService } from "../../services/alertService.js";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "../../services/cloudinaryService.js";

const CATEGORIES = ["Producción", "Catering", "Decoración", "Música & DJ", "Audiovisual", "Protocolo"];

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formState, setFormState] = useState({
    id: "",
    name: "",
    category: "Producción",
    price: 600000,
    description: "",
    imageUrl: "",
    inclusions: []
  });

  const [newInclusion, setNewInclusion] = useState("");

  const loadServices = async () => {
    setLoading(true);
    const data = await dbService.getServices();
    setServices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openNewModal = () => {
    setFormState({
      id: "srv-" + Date.now(),
      name: "",
      category: "Producción",
      price: 600000,
      description: "",
      imageUrl: "",
      inclusions: ["Personal calificado", "Transporte e instalación", "Operación durante el evento"]
    });
    setNewInclusion("");
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setFormState({
      id: s.id,
      name: s.name,
      category: s.category || "Producción",
      price: s.price || 0,
      description: s.description || "",
      imageUrl: s.imageUrl || "",
      inclusions: Array.isArray(s.inclusions) ? [...s.inclusions] : []
    });
    setNewInclusion("");
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isCloudinaryConfigured()) {
      alertService.warning(
        "Cloudinary no configurado",
        "Configura tus credenciales de Cloudinary en el menú superior."
      );
      return;
    }

    setUploadingImage(true);
    try {
      const res = await uploadImageToCloudinary(file, { folder: "servicios" });
      setFormState((prev) => ({ ...prev, imageUrl: res.url }));
      alertService.toast("Imagen subida a Cloudinary");
    } catch (err) {
      alertService.error("Error al subir", err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddInclusion = (e) => {
    e.preventDefault();
    if (!newInclusion.trim()) return;
    setFormState((prev) => ({
      ...prev,
      inclusions: [...prev.inclusions, newInclusion.trim()]
    }));
    setNewInclusion("");
  };

  const handleRemoveInclusion = (idx) => {
    setFormState((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEdit = services.some((s) => s.id === formState.id);
      if (isEdit) {
        await dbService.updateService(formState.id, formState);
        alertService.toast("Servicio actualizado");
      } else {
        await dbService.addService(formState);
        alertService.toast("Servicio creado exitosamente");
      }
      setIsModalOpen(false);
      loadServices();
    } catch (err) {
      alertService.error("Error", "No se pudo guardar el servicio.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertService.confirm(
      "¿Eliminar servicio?",
      "Esta acción eliminará el servicio de la oferta.",
      "Eliminar",
      "Cancelar",
      true
    );
    if (!confirmed) return;

    try {
      await dbService.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      alertService.toast("Servicio eliminado");
    } catch (err) {
      alertService.error("Error", "No se pudo eliminar el servicio.");
    }
  };

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
            Producción & Proveeduría
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Servicios & Catering</h1>
          <p className="text-zinc-400 text-sm">
            Control de servicios individuales de banquetería, DJ, luces robóticas y decoración.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="btn btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2"
        >
          <span>+ Nuevo Servicio</span>
        </button>
      </div>

      {/* SERVICES GRID */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
          <p>Cargando servicios...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="empty-state-card text-center py-16 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <span className="text-4xl block mb-2">🍽️</span>
          <h3 className="text-white text-lg font-bold mb-1">No hay servicios registrados</h3>
          <p className="text-zinc-400 text-sm">Añade los servicios complementarios para tus paquetes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="h-44 relative overflow-hidden bg-zinc-950">
                  {srv.imageUrl ? (
                    <img
                      src={srv.imageUrl}
                      alt={srv.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">
                      ✨
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-zinc-950/80 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">
                    {srv.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold font-serif text-white mb-1">{srv.name}</h3>
                  <p className="text-zinc-400 text-xs line-clamp-2 mb-4">{srv.description}</p>

                  <div className="mb-4 pb-3 border-b border-zinc-800">
                    <span className="text-xl font-serif font-bold text-amber-300">
                      ${srv.price.toLocaleString("es-CO")}
                    </span>
                    <span className="text-xs text-zinc-500 ml-1">tarifa base</span>
                  </div>

                  {Array.isArray(srv.inclusions) && srv.inclusions.length > 0 && (
                    <div className="space-y-1 text-xs text-zinc-300 mb-2">
                      {srv.inclusions.slice(0, 3).map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 truncate">
                          <span className="text-amber-400">✓</span>
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(srv)}
                  className="btn btn-secondary flex-1 justify-center py-2 text-xs font-semibold"
                >
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(srv.id)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs"
                  title="Eliminar servicio"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="apple-modal-overlay open">
          <div className="apple-modal-content max-w-lg max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              className="apple-modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            <div className="border-b border-zinc-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Servicios & Producción
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                {services.some((s) => s.id === formState.id) ? "Editar Servicio" : "Nuevo Servicio"}
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Ej: Show de Hora Loca & Carnaval"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tarifa Base ($ COP) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formState.price}
                    onChange={(e) =>
                      setFormState({ ...formState, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Detalles de duración, requerimientos técnicos..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white resize-none"
                />
              </div>

              {/* Cloudinary Image */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Fotografía (URL o Subir a Cloudinary)
                </label>
                <input
                  type="text"
                  value={formState.imageUrl}
                  onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... o sube archivo"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs font-mono mb-2"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30"
                  />
                  {uploadingImage && (
                    <span className="text-xs text-amber-300 animate-pulse">Subiendo...</span>
                  )}
                </div>
              </div>

              {/* Inclusions */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Inclusiones / Entregables
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    placeholder="Ej: DJ profesional con cabezas móviles"
                    className="flex-1 px-3.5 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInclusion(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="btn btn-secondary px-4 py-2 text-xs"
                  >
                    + Agregar
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                  {formState.inclusions.map((inc, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs bg-zinc-900 border border-zinc-700 text-zinc-200 px-3 py-1 rounded-full"
                    >
                      <span>✓ {inc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(i)}
                        className="text-red-400 hover:text-red-300 font-bold ml-1"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-apple-primary flex-1 justify-center py-3">
                  Guardar Servicio
                </button>
                <button
                  type="button"
                  className="btn-apple-secondary px-6 py-3"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
