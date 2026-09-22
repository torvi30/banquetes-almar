import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { alertService } from "../../services/alertService.js";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Nuevo / Pendiente", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { value: "Contactado", label: "Contactado", color: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { value: "Confirmado", label: "Confirmado / Convertido", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { value: "Cancelado", label: "Cancelado", color: "bg-red-500/15 text-red-300 border-red-500/30" }
];

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [search, setSearch] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadQuotes = async () => {
    setLoading(true);
    const data = await dbService.getQuotes();
    setQuotes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dbService.updateQuoteStatus(id, newStatus);
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
      alertService.toast("Estado de cotización actualizado");
    } catch (e) {
      alertService.error("Error", "No se pudo actualizar el estado.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertService.confirm(
      "¿Eliminar cotización?",
      "Esta acción eliminará el registro de la solicitud de forma permanente.",
      "Eliminar",
      "Cancelar",
      true
    );
    if (!confirmed) return;

    try {
      await dbService.deleteQuote(id);
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      alertService.toast("Cotización eliminada");
    } catch (e) {
      alertService.error("Error", "No se pudo eliminar la cotización.");
    }
  };

  const handleConvertToReservation = async (q) => {
    const confirmed = await alertService.confirm(
      "¿Convertir a Reserva Oficial?",
      `Se creará una reserva formal para ${q.clientName} por $${q.estimatedTotal.toLocaleString("es-CO")}.`
    );
    if (!confirmed) return;

    try {
      await dbService.addReservation({
        clientName: q.clientName,
        phone: q.phone,
        email: q.email,
        eventType: q.eventType,
        location: q.location || "Salón de Gala (Marinilla)",
        guestCount: q.guestCount,
        eventDate: q.eventDate || new Date().toISOString().split("T")[0],
        totalAmount: q.estimatedTotal,
        depositAmount: q.suggestedDeposit || 0,
        status: "Confirmed",
        notes: `Convertido desde cotización ${q.id}. ${q.message || ""}`
      });

      await dbService.updateQuoteStatus(q.id, "Confirmado");
      setQuotes((prev) =>
        prev.map((item) => (item.id === q.id ? { ...item, status: "Confirmado" } : item))
      );

      alertService.success("¡Reserva Creada!", "La cotización fue convertida en reserva de agenda exitosamente.");
    } catch (e) {
      alertService.error("Error", "No se pudo convertir la cotización a reserva.");
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const matchStatus =
      filterStatus === "todos"
        ? true
        : filterStatus === "Pending"
        ? q.status === "Pending" || q.status === "nuevo"
        : q.status?.toLowerCase() === filterStatus.toLowerCase();

    const qStr = search.toLowerCase();
    const matchSearch =
      q.clientName?.toLowerCase().includes(qStr) ||
      q.phone?.toLowerCase().includes(qStr) ||
      q.eventType?.toLowerCase().includes(qStr) ||
      q.id?.toLowerCase().includes(qStr);

    return matchStatus && matchSearch;
  });

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
            CRM & Prospectos Web
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">
            Bandeja de Cotizaciones
          </h1>
          <p className="text-zinc-400 text-sm">
            Gestiona solicitudes de anfitriones recibidas desde la web pública y el configurador.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-wrap gap-4 justify-between items-center">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {["todos", "Pending", "Contactado", "Confirmado", "Cancelado"].map((st) => (
            <button
              key={st}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filterStatus === st
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-zinc-950/70 text-zinc-400 border border-zinc-800 hover:text-white"
              }`}
              onClick={() => setFilterStatus(st)}
            >
              {st === "todos" ? "Todas" : st === "Pending" ? "Nuevas" : st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por cliente, evento o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* QUOTES LIST */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
          <p>Cargando cotizaciones...</p>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="empty-state-card text-center py-16 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <span className="text-4xl block mb-2">💬</span>
          <h3 className="text-white text-lg font-bold mb-1">No se encontraron cotizaciones</h3>
          <p className="text-zinc-400 text-sm">
            {search ? "Intenta con otro término de búsqueda." : "Aún no se han recibido solicitudes en esta categoría."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((q) => {
            const statusConfig = STATUS_OPTIONS.find((s) => s.value === q.status) || STATUS_OPTIONS[0];
            const cleanPhone = (q.phone || "").replace(/\D/g, "");
            const whatsappChatUrl = `https://wa.me/57${cleanPhone.startsWith("57") ? cleanPhone.slice(2) : cleanPhone}?text=${encodeURIComponent(
              `Hola ${q.clientName}, un saludo cordial desde Banquetes Almar (Marinilla). Te escribimos con respecto a tu solicitud para ${q.eventType}.`
            )}`;

            return (
              <div
                key={q.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div>
                      <h3 className="text-white text-base font-bold font-serif">{q.clientName}</h3>
                      <div className="text-xs text-zinc-400">
                        {q.phone} {q.email ? `&bull; ${q.email}` : ""}
                      </div>
                    </div>

                    <select
                      value={q.status || "Pending"}
                      onChange={(e) => handleStatusChange(q.id, e.target.value)}
                      className={`text-xs px-2.5 py-1 rounded-full border font-semibold outline-none cursor-pointer ${statusConfig.color}`}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-1.5 mb-4 text-xs text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Evento:</span>
                      <span className="font-semibold text-white">{q.eventType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Invitados:</span>
                      <span className="font-semibold text-white">{q.guestCount} personas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Fecha Estimada:</span>
                      <span className="font-semibold text-amber-300">{q.eventDate || "Por definir"}</span>
                    </div>
                    {q.location && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Locación:</span>
                        <span className="font-semibold text-zinc-300">{q.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-zinc-800 pt-1.5 mt-1.5">
                      <span className="text-zinc-400 font-semibold">Total Estimado:</span>
                      <span className="font-bold text-emerald-400 text-sm font-serif">
                        ${q.estimatedTotal.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>

                  {q.message && (
                    <p className="text-zinc-400 text-xs line-clamp-3 mb-4 italic bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      "{q.message}"
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/80">
                  {cleanPhone.length >= 7 && (
                    <a
                      href={whatsappChatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 transition"
                    >
                      💬 WhatsApp
                    </a>
                  )}

                  {q.status !== "Confirmado" && (
                    <button
                      type="button"
                      onClick={() => handleConvertToReservation(q)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition"
                    >
                      📅 Convertir
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedQuote(q)}
                    className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs"
                    title="Ver detalles completos"
                  >
                    👁️
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs"
                    title="Eliminar cotización"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedQuote && (
        <div className="apple-modal-overlay open">
          <div className="apple-modal-content max-w-lg">
            <button
              type="button"
              className="apple-modal-close"
              onClick={() => setSelectedQuote(null)}
            >
              &times;
            </button>

            <div className="border-b border-zinc-800 pb-4 mb-4">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Detalle de Solicitud Web
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                {selectedQuote.clientName}
              </h2>
              <div className="text-xs text-zinc-400">
                Código: {selectedQuote.id} &bull; Recibido: {selectedQuote.createdAt?.split("T")[0]}
              </div>
            </div>

            <div className="space-y-3 text-sm text-zinc-300 mb-6">
              <div>
                <strong className="text-white">Teléfono:</strong> {selectedQuote.phone}
              </div>
              {selectedQuote.email && (
                <div>
                  <strong className="text-white">Correo:</strong> {selectedQuote.email}
                </div>
              )}
              <div>
                <strong className="text-white">Evento:</strong> {selectedQuote.eventType}
              </div>
              <div>
                <strong className="text-white">Fecha Tentativa:</strong> {selectedQuote.eventDate || "Por definir"}
              </div>
              <div>
                <strong className="text-white">Invitados:</strong> {selectedQuote.guestCount} personas
              </div>
              <div>
                <strong className="text-white">Locación:</strong> {selectedQuote.location || "Salón de Gala"}
              </div>
              <div className="border-t border-zinc-800 pt-2 flex justify-between items-baseline">
                <strong className="text-white">Total Estimado:</strong>
                <span className="text-lg font-serif font-bold text-emerald-400">
                  ${selectedQuote.estimatedTotal.toLocaleString("es-CO")}
                </span>
              </div>
              {selectedQuote.message && (
                <div className="pt-2">
                  <strong className="text-white block mb-1">Mensaje / Especificaciones:</strong>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs whitespace-pre-wrap leading-relaxed text-zinc-300">
                    {selectedQuote.message}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="btn-apple-secondary flex-1 justify-center py-2.5"
                onClick={() => setSelectedQuote(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
