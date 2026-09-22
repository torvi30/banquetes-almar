import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { alertService } from "../../services/alertService.js";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "../../services/cloudinaryService.js";

const CATEGORIES = ["sillas", "mesas", "carpas", "menaje", "decoracion"];

export default function AdminInventoryPage() {
  const [items, setItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formState, setFormState] = useState({
    id: "",
    name: "",
    category: "sillas",
    price: 15000,
    unit: "unidad/evento",
    stock: 100,
    imageUrl: "",
    description: "",
    isActive: true
  });

  const loadInventory = async () => {
    setLoading(true);
    const data = await dbService.getInventory();
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const openNewModal = () => {
    setFormState({
      id: "inv-" + Date.now(),
      name: "",
      category: "sillas",
      price: 15000,
      unit: "unidad/evento",
      stock: 100,
      imageUrl: "",
      description: "",
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormState({
      id: item.id,
      name: item.name,
      category: item.category || "sillas",
      price: item.price || 0,
      unit: item.unit || "unidad/evento",
      stock: item.stock || 0,
      imageUrl: item.imageUrl || "",
      description: item.description || "",
      isActive: item.isActive !== undefined ? item.isActive : true
    });
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
      const result = await uploadImageToCloudinary(file, { folder: "inventario" });
      setFormState((prev) => ({ ...prev, imageUrl: result.url }));
      alertService.toast("Imagen subida a Cloudinary");
    } catch (err) {
      alertService.error("Error al subir imagen", err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEdit = items.some((i) => i.id === formState.id);
      if (isEdit) {
        await dbService.updateInventoryItem(formState.id, formState);
        alertService.toast("Artículo actualizado");
      } else {
        await dbService.addInventoryItem(formState);
        alertService.toast("Artículo añadido al inventario");
      }
      setIsModalOpen(false);
      loadInventory();
    } catch (err) {
      alertService.error("Error", "No se pudo guardar el artículo.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertService.confirm(
      "¿Eliminar artículo?",
      "Esta acción quitará el producto del inventario y del catálogo de alquiler.",
      "Eliminar",
      "Cancelar",
      true
    );
    if (!confirmed) return;

    try {
      await dbService.deleteInventoryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      alertService.toast("Artículo eliminado");
    } catch (err) {
      alertService.error("Error", "No se pudo eliminar el artículo.");
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const nextActive = !item.isActive;
      await dbService.updateInventoryItem(item.id, { isActive: nextActive });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isActive: nextActive } : i))
      );
      alertService.toast(nextActive ? "Artículo activado" : "Artículo pausado");
    } catch (e) {
      alertService.error("Error", "No se pudo cambiar el estado.");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchCat =
      categoryFilter === "todos"
        ? true
        : item.category?.toLowerCase() === categoryFilter.toLowerCase();

    const qStr = search.toLowerCase();
    const matchSearch =
      item.name?.toLowerCase().includes(qStr) ||
      item.category?.toLowerCase().includes(qStr) ||
      item.id?.toLowerCase().includes(qStr);

    return matchCat && matchSearch;
  });

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
            Control de Activos
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">
            Inventario & Mobiliario de Alquiler
          </h1>
          <p className="text-zinc-400 text-sm">
            Supervisa stock de sillas Tiffany, carpas, mesas, mantelería y menaje de gala.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="btn btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2"
        >
          <span>+ Nuevo Artículo</span>
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {["todos", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                categoryFilter === cat
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-zinc-950/70 text-zinc-400 border border-zinc-800 hover:text-white"
              }`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === "todos" ? "Todos los activos" : cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por nombre o activo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
          <p>Cargando inventario...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state-card text-center py-16 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <span className="text-4xl block mb-2">📦</span>
          <h3 className="text-white text-lg font-bold mb-1">No hay artículos que coincidan</h3>
          <p className="text-zinc-400 text-sm">Añade nuevos artículos o prueba con otro filtro.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW (Full width, NO horizontal scroll) */}
          <div className="hidden lg:block bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-950/80 text-amber-300 border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Artículo</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Stock Disponible</th>
                  <th className="py-3.5 px-4 text-right">Tarifa Alquiler</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-zinc-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                            📦
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-xs text-zinc-500 line-clamp-1 max-w-xs">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 capitalize">{item.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white">{item.stock}</span>
                      <span className="text-xs text-zinc-500 ml-1">uds</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans font-bold text-amber-300 tabular-nums">
                      ${item.price.toLocaleString("es-CO")}
                      <span className="text-xs text-zinc-400 font-sans ml-1">/ {item.unit}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold border transition cursor-pointer ${
                          item.isActive
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-500 border-zinc-700"
                        }`}
                      >
                        {item.isActive ? "Activo" : "Pausado"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs transition cursor-pointer"
                          title="Editar artículo"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs transition cursor-pointer"
                          title="Eliminar artículo"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW (Full width, NO horizontal scroll) */}
          <div className="lg:hidden space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3 backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-zinc-800 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center text-xl shrink-0">
                      📦
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="font-semibold text-white text-base truncate">{item.name}</h3>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border shrink-0 transition ${
                          item.isActive
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-500 border-zinc-700"
                        }`}
                      >
                        {item.isActive ? "Activo" : "Pausado"}
                      </button>
                    </div>
                    <div className="text-xs text-amber-300/80 capitalize mt-0.5">{item.category}</div>
                    {item.description && (
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-zinc-500">Stock: </span>
                    <span className="font-bold text-white tabular-nums">{item.stock}</span>
                    <span className="text-zinc-400 ml-1">unidades</span>
                  </div>
                  <div className="font-sans">
                    <span className="text-zinc-500">Tarifa: </span>
                    <span className="font-bold text-amber-300 tabular-nums">
                      ${item.price.toLocaleString("es-CO")}
                    </span>
                    <span className="text-zinc-400 text-[11px]">/{item.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold text-center transition cursor-pointer"
                  >
                    ✏️ Editar Artículo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs transition cursor-pointer"
                    title="Eliminar artículo"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
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
                Mobiliario & Activos
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                {items.some((i) => i.id === formState.id) ? "Editar Artículo" : "Nuevo Artículo"}
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nombre del Mobiliario *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Ej: Silla Tiffany Dorada con Cojín Blanco"
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
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white capitalize"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Stock Total (Cantidad) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formState.stock}
                    onChange={(e) =>
                      setFormState({ ...formState, stock: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Precio Alquiler ($ COP) *
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

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Unidad de Medida
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.unit}
                    onChange={(e) => setFormState({ ...formState, unit: e.target.value })}
                    placeholder="unidad/evento, día"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
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
                  placeholder="Material, dimensiones, acabados..."
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

              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-apple-primary flex-1 justify-center py-3">
                  Guardar Artículo
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
