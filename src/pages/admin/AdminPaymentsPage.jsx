import React, { useState, useEffect } from "react";
import { dbService } from "../../services/firebase/dbService.js";
import { alertService } from "../../services/alertService.js";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formState, setFormState] = useState({
    id: "",
    reservationId: "",
    clientName: "",
    amount: 500000,
    concept: "Abono Inicial (Anticipo de Reserva)",
    method: "Transferencia Bancolombia",
    reference: "",
    paymentDate: new Date().toISOString().split("T")[0]
  });

  const loadData = async () => {
    setLoading(true);
    const [pmts, res] = await Promise.all([
      dbService.getPayments(),
      dbService.getReservations()
    ]);
    setPayments(pmts || []);
    setReservations(res || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    const firstRes = reservations[0];
    setFormState({
      id: "pay-" + Date.now(),
      reservationId: firstRes?.id || "",
      clientName: firstRes?.clientName || "",
      amount: 500000,
      concept: "Abono Inicial (Anticipo de Reserva)",
      method: "Transferencia Bancolombia",
      reference: "TRF-" + Math.floor(1000 + Math.random() * 9000),
      paymentDate: new Date().toISOString().split("T")[0]
    });
    setIsModalOpen(true);
  };

  const handleReservationSelect = (resId) => {
    const target = reservations.find((r) => r.id === resId);
    setFormState((prev) => ({
      ...prev,
      reservationId: resId,
      clientName: target?.clientName || prev.clientName
    }));
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    try {
      await dbService.addPayment({
        ...formState,
        amount: Number(formState.amount)
      });
      alertService.success("¡Abono Asentado!", "El ingreso fue registrado en el libro contable de Banquetes Almar.");
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alertService.error("Error", "No se pudo registrar el pago.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await alertService.confirm(
      "¿Anular abono?",
      "Esta acción revertirá el pago y recalculará el saldo pendiente de la reserva.",
      "Anular",
      "Cancelar",
      true
    );
    if (!confirmed) return;

    try {
      await dbService.deletePayment(id);
      setPayments((prev) => prev.filter((p) => p.id !== id));
      alertService.toast("Abono anulado");
      loadData();
    } catch (err) {
      alertService.error("Error", "No se pudo anular el abono.");
    }
  };

  const totalCollected = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  const filteredPayments = payments.filter((p) => {
    const qStr = search.toLowerCase();
    return (
      p.clientName?.toLowerCase().includes(qStr) ||
      p.reservationId?.toLowerCase().includes(qStr) ||
      p.concept?.toLowerCase().includes(qStr) ||
      p.method?.toLowerCase().includes(qStr) ||
      p.reference?.toLowerCase().includes(qStr)
    );
  });

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
            Libro Contable & Finanzas
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">
            Registro de Pagos & Abonos
          </h1>
          <p className="text-zinc-400 text-sm">
            Control de anticipos, consignaciones y emisión de recibos de caja oficiales.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={openNewModal}
            className="btn btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2"
          >
            <span>+ Registrar Abono</span>
          </button>
        </div>
      </div>

      {/* FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="text-xs text-zinc-400 block mb-1">💰 Total Recaudado Acumulado</span>
          <strong className="text-2xl font-serif font-bold text-emerald-400">
            ${totalCollected.toLocaleString("es-CO")}
          </strong>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="text-xs text-zinc-400 block mb-1">🧾 Total Recibos Asentados</span>
          <strong className="text-2xl font-serif font-bold text-white">
            {payments.length} transacciones
          </strong>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="text-xs text-zinc-400 block mb-1">📊 Promedio por Abono</span>
          <strong className="text-2xl font-serif font-bold text-amber-300">
            $
            {payments.length > 0
              ? Math.round(totalCollected / payments.length).toLocaleString("es-CO")
              : 0}
          </strong>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mb-6 flex justify-between items-center">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Buscar por cliente, referencia o reserva..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
          <p>Cargando libro financiero...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="empty-state-card text-center py-16 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <span className="text-4xl block mb-2">💵</span>
          <h3 className="text-white text-lg font-bold mb-1">No se encontraron pagos</h3>
          <p className="text-zinc-400 text-sm">Registra un nuevo abono para alimentar el historial.</p>
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-950/80 text-amber-300 border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-4">Fecha</th>
                  <th className="py-4 px-4">Cliente / Reserva</th>
                  <th className="py-4 px-4">Concepto</th>
                  <th className="py-4 px-4">Método / Ref</th>
                  <th className="py-4 px-4 text-right">Monto</th>
                  <th className="py-4 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-4 font-mono text-xs">{p.paymentDate}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{p.clientName}</div>
                      <div className="text-xs text-amber-300/80 font-mono">{p.reservationId}</div>
                    </td>
                    <td className="py-4 px-4">{p.concept}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {p.method}
                      </span>
                      {p.reference && (
                        <div className="text-[10px] text-zinc-500 font-mono mt-1">
                          Ref: {p.reference}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right font-serif font-bold text-emerald-400 text-base">
                      ${p.amount.toLocaleString("es-CO")}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptPayment(p)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 text-xs font-semibold"
                          title="Imprimir comprobante oficial"
                        >
                          📄 Recibo
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs"
                          title="Anular abono"
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

      {/* NEW PAYMENT MODAL */}
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
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                Caja & Recaudos
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">Registrar Nuevo Abono</h2>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Vincular a Reserva de Agenda *
                </label>
                <select
                  required
                  value={formState.reservationId}
                  onChange={(e) => handleReservationSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                >
                  <option value="">Selecciona una reserva...</option>
                  {reservations.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} &bull; {r.clientName} ({r.eventType}) &bull; Saldo: ${r.balanceAmount.toLocaleString("es-CO")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nombre del Cliente / Pagador *
                </label>
                <input
                  type="text"
                  required
                  value={formState.clientName}
                  onChange={(e) => setFormState({ ...formState, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Monto Recaudado ($ COP) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formState.amount}
                    onChange={(e) =>
                      setFormState({ ...formState, amount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono text-base font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Método de Pago
                  </label>
                  <select
                    value={formState.method}
                    onChange={(e) => setFormState({ ...formState, method: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                  >
                    <option value="Transferencia Bancolombia">Transferencia Bancolombia</option>
                    <option value="Efectivo en Sede">Efectivo en Sede</option>
                    <option value="Nequi / Daviplata">Nequi / Daviplata</option>
                    <option value="Tarjeta Débito/Crédito">Tarjeta Débito/Crédito</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Concepto del Pago *
                </label>
                <input
                  type="text"
                  required
                  value={formState.concept}
                  onChange={(e) => setFormState({ ...formState, concept: e.target.value })}
                  placeholder="Ej: Anticipo de 30% para separación de fecha"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Número de Comprobante / Ref
                  </label>
                  <input
                    type="text"
                    value={formState.reference}
                    onChange={(e) => setFormState({ ...formState, reference: e.target.value })}
                    placeholder="TRF-9821"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Fecha del Pago *
                  </label>
                  <input
                    type="date"
                    required
                    value={formState.paymentDate}
                    onChange={(e) => setFormState({ ...formState, paymentDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white color-scheme-dark"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="btn-apple-primary flex-1 justify-center py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold"
                >
                  Guardar Pago
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

      {/* PRINTABLE RECEIPT MODAL */}
      {selectedReceiptPayment && (
        <div className="apple-modal-overlay open">
          <div className="apple-modal-content max-w-md bg-white text-zinc-900 border-none shadow-2xl p-8 rounded-2xl">
            <button
              type="button"
              className="apple-modal-close text-zinc-800 hover:text-black"
              onClick={() => setSelectedReceiptPayment(null)}
            >
              &times;
            </button>

            {/* RECEIPT HEADER */}
            <div className="text-center border-b border-zinc-200 pb-4 mb-4">
              <img
                src="/images/logo-almar.png"
                alt="Banquetes Almar"
                className="w-14 h-14 mx-auto mb-2 object-contain"
              />
              <h2 className="font-serif text-xl font-bold text-zinc-950">Banquetes Almar</h2>
              <p className="text-xs text-zinc-600">{BUSINESS_INFO.slogan}</p>
              <p className="text-[11px] text-zinc-500 mt-1">
                📍 {BUSINESS_INFO.mainAddress} &bull; 📞 {BUSINESS_INFO.mainPhone}
              </p>
              <div className="mt-3 inline-block bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Recibo Oficial de Caja &bull; {selectedReceiptPayment.id}
              </div>
            </div>

            {/* RECEIPT BODY */}
            <div className="space-y-2 text-xs text-zinc-700 mb-6">
              <div className="flex justify-between border-b border-zinc-100 py-1">
                <span>Fecha:</span>
                <span className="font-semibold text-zinc-900">{selectedReceiptPayment.paymentDate}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 py-1">
                <span>Recibido de:</span>
                <span className="font-semibold text-zinc-900">{selectedReceiptPayment.clientName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 py-1">
                <span>Reserva:</span>
                <span className="font-semibold text-zinc-900 font-mono">
                  {selectedReceiptPayment.reservationId}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 py-1">
                <span>Concepto:</span>
                <span className="font-semibold text-zinc-900">{selectedReceiptPayment.concept}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 py-1">
                <span>Forma de Pago:</span>
                <span className="font-semibold text-zinc-900">{selectedReceiptPayment.method}</span>
              </div>
              {selectedReceiptPayment.reference && (
                <div className="flex justify-between border-b border-zinc-100 py-1">
                  <span>Referencia / TRF:</span>
                  <span className="font-mono text-zinc-900">{selectedReceiptPayment.reference}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t-2 border-zinc-300">
                <span className="text-sm font-bold text-zinc-900">Total Recibido:</span>
                <span className="text-base font-serif font-bold text-emerald-700">
                  ${selectedReceiptPayment.amount.toLocaleString("es-CO")} COP
                </span>
              </div>
            </div>

            {/* FOOTER */}
            <div className="text-center text-[10px] text-zinc-400 border-t border-zinc-200 pt-3 mb-5">
              Este documento certifica el abono formal de recursos para la prestación de servicios
              de eventos de Banquetes Almar en Marinilla, Antioquia.
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="btn btn-primary flex-1 justify-center py-2.5 text-xs font-bold"
                onClick={() => window.print()}
              >
                🖨️ Imprimir Recibo
              </button>
              <button
                type="button"
                className="btn btn-secondary py-2.5 px-4 text-xs font-semibold text-zinc-700 border-zinc-300"
                onClick={() => setSelectedReceiptPayment(null)}
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
