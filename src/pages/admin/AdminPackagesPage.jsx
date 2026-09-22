import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { alertService } from "../../services/alertService.js";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "../../services/cloudinaryService.js";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formState, setFormState] = useState({
    id: "",
    title: "",
    category: "bodas",
    badge: "Más Popular",
    description: "",
    pricePerPerson: 55000,
    minGuests: 50,
    imageUrl: "",
    inclusions: []
  });

  const [newInclusion, setNewInclusion] = useState("");

  const loadPackages = async () => {
    setLoading(true);
    const data = await dbService.getPackages();
    setPackages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openNewModal = () => {
    setFormState({
      id: "pkg-" + Date.now(),
      title: "",
      category: "bodas",
      badge: "Nuevo",
      description: "",
      pricePerPerson: 55000,
      minGuests: 50,
      imageUrl: "",
      inclusions: ["Salón de Gala climatizado", "Banquete gourmet a 3 tiempos", "Sillas Tiffany doradas", "DJ y cabezas móviles"]
    });
    setNewInclusion("");
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setFormState({
      id: pkg.id,
      title: pkg.title,
      category: pkg.category || "bodas",
      badge: pkg.badge || "",
      description: pkg.description || "",
      pricePerPerson: pkg.pricePerPerson || 0,
      minGuests: pkg.minGuests || 1,
      imageUrl: pkg.imageUrl || "",
      inclusions: Array.isArray(pkg.inclusions) ? [...pkg.inclusions] : []
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
        "Por favor configura tus credenciales de Cloudinary en el menú de usuario arriba a la derecha."
      );
      return;
    }

    setUploadingImage(true);
    try {
      const result = await uploadImageToCloudinary(file, { folder: "paquetes" });
      setFormState((prev) => ({ ...prev, imageUrl: result.url }));
      alertService.toast("Imagen subida a Cloudinary");
    } catch (err) {
      alertService.error("Error al subir imagen", err.message);
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
      const isEdit = packages.some((p) => p.id === formState.id);
      if (isEdit) {
        await dbService.updatePackage(formState.id, formState);
        alertService.toast("Paquete actualizado");
      } else {
        await dbService.addPackage(formState);
        alertService.toast("Paquete creado exitosamente");
      }
      setIsModalOpen(false);
      loadPackages();
    } catch (err) {
      alertService.error("Error", "No se pudo guardar el paquete.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertService.confirm(
      "¿Eliminar paquete?",
      "Esta acción eliminará el paquete del catálogo público.",
      "Eliminar",
      "Cancelar",
      true
    );
    if (!confirmed) return;

    try {
      await dbService.deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
      alertService.toast("Paquete eliminado");
    } catch (err) {
      alertService.error("Error", "No se pudo eliminar el paquete.");
    }
  };

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
            Catálogo de Gala
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Paquetes Todo Incluido</h1>
          <p className="text-zinc-400 text-sm">
            Administra las propuestas integrales para Bodas, 15 Años y Graduaciones.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="btn btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2"
        >
          <span>+ Nuevo Paquete</span>
        </button>
      </div>

      {/* PACKAGES GRID */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
          <p>Cargando paquetes...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="empty-state-card text-center py-16 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <span className="text-4xl block mb-2">💎</span>
          <h3 className="text-white text-lg font-bold mb-1">No hay paquetes creados</h3>
          <p className="text-zinc-400 text-sm">Crea tu primer paquete de gala para publicarlo en la web.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-zinc-950">
                  {pkg.imageUrl ? (
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">
                      💍
                    </div>
                  )}
                  {pkg.badge && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 text-xs px-2.5 py-1 rounded-full font-bold">
                      {pkg.badge}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-zinc-950/80 text-zinc-300 text-xs px-2.5 py-1 rounded-full border border-zinc-700 uppercase">
                    {pkg.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold font-serif text-white mb-1">{pkg.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-4">
                    {pkg.description}
                  </p>

                  <div className="flex justify-between items-baseline mb-4 pb-3 border-b border-zinc-800">
                    <div>
                      <span className="text-2xl font-serif font-bold text-amber-300">
                        ${pkg.pricePerPerson.toLocaleString("es-CO")}
                      </span>
                      <span className="text-xs text-zinc-400 ml-1">/ pers</span>
                    </div>
                    <span className="text-xs text-zinc-400">Mín: {pkg.minGuests} pers</span>
                  </div>

                  {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 && (
                    <div className="space-y-1 text-xs text-zinc-300 mb-2">
                      <div className="font-semibold text-zinc-400 mb-1">Incluye:</div>
                      {pkg.inclusions.slice(0, 4).map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 truncate">
                          <span className="text-amber-400">✓</span>
                          <span>{inc}</span>
                        </div>
                      ))}
                      {pkg.inclusions.length > 4 && (
                        <div className="text-[10px] text-zinc-500">
                          +{pkg.inclusions.length - 4} inclusiones más
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(pkg)}
                  className="btn btn-secondary flex-1 justify-center py-2 text-xs font-semibold"
                >
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs"
                  title="Eliminar paquete"
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
          <div className="apple-modal-content max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              className="apple-modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            <div className="border-b border-zinc-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Paquetes de Gala
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                {packages.some((p) => p.id === formState.id) ? "Editar Paquete" : "Nuevo Paquete"}
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Título del Paquete *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    placeholder="Ej: Boda Diamante Imperial"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-serif text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Distintivo / Badge
                  </label>
                  <input
                    type="text"
                    value={formState.badge}
                    onChange={(e) => setFormState({ ...formState, badge: e.target.value })}
                    placeholder="Ej: Más Vendido, Exclusivo"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  >
                    <option value="bodas">Bodas</option>
                    <option value="15anos">15 Años</option>
                    <option value="grados">Grados</option>
                    <option value="empresarial">Corporativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Precio por Persona ($ COP) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formState.pricePerPerson}
                    onChange={(e) =>
                      setFormState({ ...formState, pricePerPerson: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Mínimo de Invitados
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formState.minGuests}
                    onChange={(e) =>
                      setFormState({ ...formState, minGuests: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows={2}
                  required
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Descripción de la atmósfera, experiencia y propuesta de valor..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white resize-none"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Foto del Paquete (URL o Subir a Cloudinary)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formState.imageUrl}
                    onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... o sube un archivo"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30"
                  />
                  {uploadingImage && (
                    <span className="text-xs text-amber-300 animate-pulse">
                      Subiendo a Cloudinary...
                    </span>
                  )}
                </div>
              </div>

              {/* Inclusions tag editor */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Lista de Inclusiones del Paquete
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    placeholder="Ej: Montaje con cubertería de oro gala"
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

                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-zinc-950 rounded-xl border border-zinc-800">
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
                  Guardar Paquete
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
