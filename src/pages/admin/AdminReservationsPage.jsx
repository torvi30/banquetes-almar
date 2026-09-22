import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dbService } from "../../services/firebase/dbService.js";
import { alertService } from "../../services/alertService.js";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields for reservation
  const [formState, setFormState] = useState({
    id: "",
    clientName: "",
    phone: "",
    email: "",
    eventType: "Boda",
    location: "Salón de Gala (Marinilla)",
    guestCount: 80,
    eventDate: "",
    eventTime: "16:00",
    totalAmount: 0,
    depositAmount: 0,
    status: "Confirmed",
    notes: ""
  });

  // Form fields for new payment
  const [paymentState, setPaymentState] = useState({
    amount: 0,
    concept: "Abono a Reserva",
    method: "Transferencia Bancolombia",
    reference: "",
    paymentDate: new Date().toISOString().split("T")[0]
  });

  const loadReservations = async () => {
    setLoading(true);
    const data = await dbService.getReservations();
    setReservations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const openNewModal = () => {
    setFormState({
      id: "ALM-RES" + Math.floor(100 + Math.random() * 900),
      clientName: "",
      phone: "",
      email: "",
      eventType: "Boda",
      location: "Salón de Gala (Marinilla)",
      guestCount: 80,
      eventDate: "",
      eventTime: "16:00",
      totalAmount: 0,
      depositAmount: 0,
      status: "Confirmed",
      notes: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setFormState({
      id: r.id,
      clientName: r.clientName,
      phone: r.phone,
      email: r.email || "",
      eventType: r.eventType,
      location: r.location || "Salón de Gala (Marinilla)",
      guestCount: r.guestCount || 50,
      eventDate: r.eventDate || "",
      eventTime: r.eventTime || "16:00",
      totalAmount: r.totalAmount || 0,
      depositAmount: r.depositAmount || 0,
      status: r.status || "Confirmed",
      notes: r.notes || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveReservation = async (e) => {
    e.preventDefault();
    try {
      const isEdit = reservations.some((r) => r.id === formState.id);
      if (isEdit) {
        await dbService.updateReservation(formState.id, formState);
        alertService.toast("Reserva actualizada");
      } else {
        await dbService.addReservation(formState);
        alertService.toast("Reserva agendada exitosamente");
      }
      setIsModalOpen(false);
      loadReservations();
    } catch (err) {
      alertService.error("Error", "No se pudo guardar la reserva.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertService.confirm(
      "¿Eliminar reserva?",
      "Esta acción cancelará y eliminará el evento de la agenda de forma permanente.",
      "Eliminar",
      "Cancelar",
      true
    );
    if (!confirmed) return;

    try {
      await dbService.deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      alertService.toast("Reserva eliminada");
    } catch (e) {
      alertService.error("Error", "No se pudo eliminar la reserva.");
    }
  };

  const openQuickPayment = (r) => {
    setCurrentReservation(r);
    setPaymentState({
      amount: Math.min(500000, r.balanceAmount || 500000),
      concept: "Abono a Reserva",
      method: "Transferencia Bancolombia",
      reference: "",
      paymentDate: new Date().toISOString().split("T")[0]
    });
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (!currentReservation) return;

    try {
      await dbService.addPayment({
        reservationId: currentReservation.id,
        clientName: currentReservation.clientName,
        amount: Number(paymentState.amount),
        concept: paymentState.concept,
        method: paymentState.method,
        reference: paymentState.reference,
        paymentDate: paymentState.paymentDate
      });

      alertService.success("¡Abono Registrado!", "El pago fue asentado en el libro financiero y el saldo recalculado.");
      setIsPaymentModalOpen(false);
      loadReservations();
    } catch (e) {
      alertService.error("Error", "No se pudo registrar el pago.");
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const matchStatus =
      statusFilter === "todos"
        ? true
        : r.status?.toLowerCase() === statusFilter.toLowerCase();

    const qStr = search.toLowerCase();
    const matchSearch =
      r.clientName?.toLowerCase().includes(qStr) ||
      r.phone?.toLowerCase().includes(qStr) ||
      r.eventType?.toLowerCase().includes(qStr) ||
      r.id?.toLowerCase().includes(qStr);

    return matchStatus && matchSearch;
  });

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
            Agenda Oficial
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">
            Gestión de Eventos & Reservas
          </h1>
          <p className="text-zinc-400 text-sm">
            Control de fechas agendadas, saldos por cobrar y vinculación a contratos legales.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/calendario"
            className="btn btn-secondary text-sm px-5 py-2.5 inline-flex items-center gap-2"
          >
            <span>📅 Vista Calendario</span>
          </Link>
          <button
            type="button"
            onClick={openNewModal}
            className="btn btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2"
          >
            <span>+ Nueva Reserva</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {["todos", "Confirmed", "Completed", "Pending", "Cancelled"].map((st) => (
            <button
              key={st}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                statusFilter === st
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-zinc-950/70 text-zinc-400 border border-zinc-800 hover:text-white"
              }`}
              onClick={() => setStatusFilter(st)}
            >
              {st === "todos"
                ? "Todas"
                : st === "Confirmed"
                ? "Confirmadas"
                : st === "Completed"
                ? "Completadas"
                : st === "Pending"
                ? "Pendientes"
                : "Canceladas"}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por cliente, evento o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* RESERVATIONS TABLE */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
          <p>Cargando eventos de agenda...</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="empty-state-card text-center py-16 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <span className="text-4xl block mb-2">📅</span>
          <h3 className="text-white text-lg font-bold mb-1">No hay reservas registradas</h3>
          <p className="text-zinc-400 text-sm">Crea una nueva reserva o ajusta los filtros de búsqueda.</p>
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-950/80 text-amber-300 border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-4">Código / Cliente</th>
                  <th className="py-4 px-4">Evento / Sede</th>
                  <th className="py-4 px-4">Fecha & Hora</th>
                  <th className="py-4 px-4">Invitados</th>
                  <th className="py-4 px-4 text-right">Inversión</th>
                  <th className="py-4 px-4 text-right">Saldo</th>
                  <th className="py-4 px-4 text-center">Estado</th>
                  <th className="py-4 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{r.clientName}</div>
                      <div className="text-xs text-amber-300/80 font-mono">{r.id}</div>
                      <div className="text-xs text-zinc-500">{r.phone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{r.eventType}</div>
                      <div className="text-xs text-zinc-400 truncate max-w-xs">{r.location}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{r.eventDate}</div>
                      <div className="text-xs text-zinc-400">{r.eventTime}</div>
                    </td>
                    <td className="py-4 px-4 font-medium">{r.guestCount} pers</td>
                    <td className="py-4 px-4 text-right font-serif font-bold text-white">
                      ${r.totalAmount.toLocaleString("es-CO")}
                    </td>
                    <td className="py-4 px-4 text-right font-serif font-bold text-amber-300">
                      ${r.balanceAmount.toLocaleString("es-CO")}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openQuickPayment(r)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-semibold"
                          title="Registrar abono de dinero"
                        >
                          💵 Abono
                        </button>
                        <Link
                          to={`/admin/contrato?reservationId=${r.id}`}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 text-xs font-semibold"
                          title="Ver contrato oficial"
                        >
                          📜 Contrato
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(r)}
                          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs"
                          title="Editar reserva"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs"
                          title="Eliminar reserva"
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
        </div>
      )}

      {/* CREATE / EDIT RESERVATION MODAL */}
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
                Agenda de Gala
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                {reservations.some((r) => r.id === formState.id)
                  ? "Editar Reserva"
                  : "Crear Nueva Reserva"}
              </h2>
            </div>

            <form onSubmit={handleSaveReservation} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Código de Evento
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.id}
                    onChange={(e) => setFormState({ ...formState, id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nombre del Anfitrión / Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.clientName}
                    onChange={(e) => setFormState({ ...formState, clientName: e.target.value })}
                    placeholder="Ej: Valentina Gómez"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="Ej: 314 884 9011"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tipo de Celebración
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.eventType}
                    onChange={(e) => setFormState({ ...formState, eventType: e.target.value })}
                    placeholder="Ej: Boda, 15 Años"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Fecha del Evento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formState.eventDate}
                    onChange={(e) => setFormState({ ...formState, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white color-scheme-dark"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={formState.eventTime}
                    onChange={(e) => setFormState({ ...formState, eventTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white color-scheme-dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Locación / Sede
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Número de Invitados
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formState.guestCount}
                    onChange={(e) =>
                      setFormState({ ...formState, guestCount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Total Inversión ($ COP)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formState.totalAmount}
                    onChange={(e) =>
                      setFormState({ ...formState, totalAmount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Anticipo / Abonos Iniciales
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formState.depositAmount}
                    onChange={(e) =>
                      setFormState({ ...formState, depositAmount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Estado de la Reserva
                  </label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  >
                    <option value="Confirmed">Confirmada</option>
                    <option value="Pending">Pendiente</option>
                    <option value="Completed">Completada</option>
                    <option value="Cancelled">Cancelada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Notas / Observaciones del Contrato
                </label>
                <textarea
                  rows={3}
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  placeholder="Detalles de menú, montaje, pagos diferidos..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-apple-primary flex-1 justify-center py-3">
                  Guardar Reserva
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

      {/* QUICK PAYMENT MODAL */}
      {isPaymentModalOpen && currentReservation && (
        <div className="apple-modal-overlay open">
          <div className="apple-modal-content max-w-md">
            <button
              type="button"
              className="apple-modal-close"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              &times;
            </button>

            <div className="border-b border-zinc-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                Libro de Caja
              </span>
              <h2 className="text-xl font-serif font-bold text-white mt-1">Registrar Abono</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Cliente: <strong className="text-white">{currentReservation.clientName}</strong> &bull; Saldo actual:{" "}
                <strong className="text-amber-300 font-mono">
                  ${currentReservation.balanceAmount.toLocaleString("es-CO")}
                </strong>
              </p>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Monto del Abono ($ COP) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={paymentState.amount}
                  onChange={(e) =>
                    setPaymentState({ ...paymentState, amount: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono text-lg font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Método de Pago
                </label>
                <select
                  value={paymentState.method}
                  onChange={(e) => setPaymentState({ ...paymentState, method: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                >
                  <option value="Transferencia Bancolombia">Transferencia Bancolombia</option>
                  <option value="Efectivo en Sede">Efectivo en Sede</option>
                  <option value="Nequi / Daviplata">Nequi / Daviplata</option>
                  <option value="Tarjeta de Crédito/Débito">Tarjeta de Crédito/Débito</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Concepto del Pago
                </label>
                <input
                  type="text"
                  required
                  value={paymentState.concept}
                  onChange={(e) => setPaymentState({ ...paymentState, concept: e.target.value })}
                  placeholder="Ej: Segundo abono de catering"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Número de Comprobante
                  </label>
                  <input
                    type="text"
                    value={paymentState.reference}
                    onChange={(e) =>
                      setPaymentState({ ...paymentState, reference: e.target.value })
                    }
                    placeholder="Ej: REC-8891"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Fecha del Abono
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentState.paymentDate}
                    onChange={(e) =>
                      setPaymentState({ ...paymentState, paymentDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white color-scheme-dark"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="btn-apple-primary flex-1 justify-center py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold"
                >
                  Asentar Abono
                </button>
                <button
                  type="button"
                  className="btn-apple-secondary px-5 py-2.5"
                  onClick={() => setIsPaymentModalOpen(false)}
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
