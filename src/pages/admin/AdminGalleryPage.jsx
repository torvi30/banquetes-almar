import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { alertService } from "../../services/alertService.js";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "../../services/cloudinaryService.js";

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formState, setFormState] = useState({
    title: "",
    category: "Bodas",
    imageUrl: "",
    description: ""
  });

  const loadData = async () => {
    setLoading(true);
    const [gal, cats] = await Promise.all([
      dbService.getGallery(),
      dbService.getGalleryCategories()
    ]);
    setItems(gal || []);
    setCategories(cats || ["Bodas", "15 Años", "Salón Marinilla", "Finca El Peñol", "Mobiliario"]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isCloudinaryConfigured()) {
      alertService.warning(
        "Cloudinary no configurado",
        "Por favor configura tus credenciales de Cloudinary en el menú superior."
      );
      return;
    }

    setUploadingImage(true);
    try {
      const res = await uploadImageToCloudinary(file, { folder: "galeria" });
      setFormState((prev) => ({ ...prev, imageUrl: res.url }));
      alertService.toast("Imagen subida a Cloudinary");
    } catch (err) {
      alertService.error("Error al subir", err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!formState.imageUrl) {
      alertService.warning("Falta la imagen", "Debes ingresar una URL o subir un archivo.");
      return;
    }

    try {
      await dbService.addGalleryItem({
        title: formState.title || "Montaje de Gala",
        category: formState.category,
        imageUrl: formState.imageUrl,
        description: formState.description
      });

      alertService.success("¡Foto Publicada!", "La imagen fue agregada a la galería pública.");
      setIsModalOpen(false);
      setFormState({ title: "", category: "Bodas", imageUrl: "", description: "" });
      loadData();
    } catch (err) {
      alertService.error("Error", "No se pudo guardar la foto.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertService.confirm(
      "¿Eliminar foto?",
      "Esta fotografía se retirará de la galería pública.",
      "Eliminar",
      "Cancelar",
      true
    );
    if (!confirmed) return;

    try {
      await dbService.deleteGalleryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      alertService.toast("Foto eliminada");
    } catch (e) {
      alertService.error("Error", "No se pudo eliminar la foto.");
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "Todos") return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
            Portafolio Visual
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">
            Galería Multimedia Cloudinary
          </h1>
          <p className="text-zinc-400 text-sm">
            Publica fotografías reales de montajes, silletería y banquetes en Marinilla y El Peñol.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2"
        >
          <span>+ Subir Fotografía</span>
        </button>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Todos", ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-zinc-950/70 text-zinc-400 border border-zinc-800 hover:text-white"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GALLERY GRID */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
          <p>Cargando galería...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state-card text-center py-16 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <span className="text-4xl block mb-2">📸</span>
          <h3 className="text-white text-lg font-bold mb-1">No hay fotos en esta categoría</h3>
          <p className="text-zinc-400 text-sm">Sube fotografías con Cloudinary para mostrarlas en la portada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md relative group flex flex-col justify-between"
            >
              <div className="h-56 relative overflow-hidden bg-zinc-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 bg-zinc-950/80 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase font-semibold">
                  {item.category}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/80 text-white hover:bg-red-600 text-xs shadow-lg transition opacity-0 group-hover:opacity-100"
                  title="Eliminar foto"
                >
                  🗑️
                </button>
              </div>

              <div className="p-3">
                <h4 className="text-sm font-semibold text-white font-serif truncate">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-zinc-400 text-xs line-clamp-1 mt-0.5">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className="apple-modal-overlay open">
          <div className="apple-modal-content max-w-lg">
            <button
              type="button"
              className="apple-modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            <div className="border-b border-zinc-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Galería de Montajes
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">Subir Fotografía</h2>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Título del Montaje *
                </label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="Ej: Montaje Nupcial Tiffany con Luces Cálidas"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Categoría</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Descripción Corta
                </label>
                <textarea
                  rows={2}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Detalle de flores, manteles, locación..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Archivo de Imagen (Cloudinary) *
                </label>
                <input
                  type="text"
                  value={formState.imageUrl}
                  onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/... o selecciona un archivo"
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

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="btn-apple-primary flex-1 justify-center py-2.5"
                >
                  Publicar en Galería
                </button>
                <button
                  type="button"
                  className="btn-apple-secondary px-5 py-2.5"
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
