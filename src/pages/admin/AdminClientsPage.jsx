import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dbService } from "../../services/firebase/dbService.js";
import { alertService } from "../../services/alertService.js";

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formState, setFormState] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    documentId: "",
    address: "",
    city: "Marinilla",
    clientType: "Cliente Particular",
    notes: ""
  });

  const loadClients = async () => {
    setLoading(true);
    const data = await dbService.getClients();
    setClients(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const openNewModal = () => {
    setFormState({
      id: "cli-" + Date.now(),
      name: "",
      phone: "",
      email: "",
      documentId: "",
      address: "",
      city: "Marinilla",
      clientType: "Cliente Particular",
      notes: ""
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dbService.addClient(formState);
      alertService.toast("Cliente registrado exitosamente");
      setIsModalOpen(false);
      loadClients();
    } catch (err) {
      alertService.error("Error", "No se pudo registrar el cliente.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertService.confirm(
      "¿Eliminar cliente?",
      "Esta acción quitará al cliente del directorio.",
      "Eliminar",
      "Cancelar",
      true
    );
    if (!confirmed) return;

    try {
      await dbService.deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      alertService.toast("Cliente eliminado");
    } catch (e) {
      alertService.error("Error", "No se pudo eliminar el cliente.");
    }
  };

  const filteredClients = clients.filter((c) => {
    const qStr = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(qStr) ||
      c.phone?.toLowerCase().includes(qStr) ||
      c.email?.toLowerCase().includes(qStr) ||
      c.city?.toLowerCase().includes(qStr) ||
      c.documentId?.toLowerCase().includes(qStr)
    );
  });

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
            Base de Anfitriones
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Directorio de Clientes</h1>
          <p className="text-zinc-400 text-sm">
            Historial consolidado de personas y empresas que han celebrado con Banquetes Almar.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="btn btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2"
        >
          <span>+ Registrar Cliente</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mb-6 flex justify-between items-center">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o teléfono..."
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
          <p>Cargando directorio de clientes...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="empty-state-card text-center py-16 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <span className="text-4xl block mb-2">👥</span>
          <h3 className="text-white text-lg font-bold mb-1">No hay clientes registrados</h3>
          <p className="text-zinc-400 text-sm">Registra tu primer cliente o verifica el término de búsqueda.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW (Full width, NO horizontal scroll) */}
          <div className="hidden lg:block bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-950/80 text-amber-300 border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Anfitrión / Cliente</th>
                  <th className="py-3.5 px-4">Contacto</th>
                  <th className="py-3.5 px-4">Ciudad / Dirección</th>
                  <th className="py-3.5 px-4">Documento</th>
                  <th className="py-3.5 px-4 text-center">Eventos</th>
                  <th className="py-3.5 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/admin/cliente?id=${c.id}`}
                        className="font-semibold text-white hover:text-amber-300 transition"
                      >
                        {c.name}
                      </Link>
                      <div className="text-xs text-zinc-500">{c.clientType}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs text-zinc-200">{c.phone}</div>
                      <div className="text-xs text-zinc-400">{c.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{c.city}</div>
                      <div className="text-xs text-zinc-500">{c.address}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-zinc-400">
                      {c.documentId || "No registrada"}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 tabular-nums">
                        {c.eventsCount || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          to={`/admin/cliente?id=${c.id}`}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition"
                        >
                          👁️ Perfil
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs transition cursor-pointer"
                          title="Eliminar cliente"
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
            {filteredClients.map((c) => (
              <div
                key={c.id}
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3 backdrop-blur-md"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <Link
                      to={`/admin/cliente?id=${c.id}`}
                      className="font-semibold text-white text-base hover:text-amber-300 transition"
                    >
                      {c.name}
                    </Link>
                    <div className="text-xs text-zinc-400 mt-0.5">{c.clientType}</div>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                    {c.eventsCount || 0} eventos
                  </span>
                </div>

                <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Teléfono:</span>
                    <span className="font-mono text-zinc-200">{c.phone}</span>
                  </div>
                  {c.email && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Correo:</span>
                      <span className="text-zinc-300 truncate max-w-[200px]">{c.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Ciudad:</span>
                    <span className="text-zinc-200">{c.city || "No especificada"}</span>
                  </div>
                  {c.documentId && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Documento:</span>
                      <span className="font-mono text-zinc-400">{c.documentId}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={`/admin/cliente?id=${c.id}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold text-center transition"
                  >
                    👁️ Ver Perfil & Eventos
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs transition cursor-pointer"
                    title="Eliminar cliente"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CREATE CLIENT MODAL */}
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
                Directorio
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">Registrar Cliente</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nombre Completo / Razón Social *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Ej: Carolina Arango Morales"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="Ej: 310 445 8892"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Cédula / NIT
                  </label>
                  <input
                    type="text"
                    value={formState.documentId}
                    onChange={(e) => setFormState({ ...formState, documentId: e.target.value })}
                    placeholder="Ej: 1037... / 901..."
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="cliente@correo.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Municipio
                  </label>
                  <input
                    type="text"
                    value={formState.city}
                    onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                    placeholder="Marinilla, Rionegro..."
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Dirección de Residencia
                </label>
                <input
                  type="text"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  placeholder="Calle ... # ... - ..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Notas / Observaciones
                </label>
                <textarea
                  rows={2}
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  placeholder="Preferencias del anfitrión..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-apple-primary flex-1 justify-center py-2.5">
                  Guardar Cliente
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
