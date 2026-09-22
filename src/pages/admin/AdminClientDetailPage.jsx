import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { dbService } from "../../services/firebase/dbService.js";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

export default function AdminClientDetailPage() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("id");

  const [client, setClient] = useState(null);
  const [clientReservations, setClientReservations] = useState([]);
  const [clientPayments, setClientPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!clientId) {
      setLoading(false);
      return;
    }

    Promise.all([
      dbService.getClientById(clientId),
      dbService.getReservations(),
      dbService.getPayments()
    ]).then(([cli, allRes, allPmts]) => {
      if (!isMounted) return;
      setClient(cli);

      if (cli) {
        // Filter events by client phone or name
        const cPhone = cli.phone?.replace(/\D/g, "");
        const resList = (allRes || []).filter((r) => {
          const rPhone = r.phone?.replace(/\D/g, "");
          return (
            (cPhone && rPhone && cPhone === rPhone) ||
            r.clientName?.toLowerCase() === cli.name?.toLowerCase()
          );
        });
        setClientReservations(resList);

        // Filter payments
        const resIds = new Set(resList.map((r) => r.id));
        const pmtList = (allPmts || []).filter(
          (p) =>
            resIds.has(p.reservationId) ||
            p.clientName?.toLowerCase() === cli.name?.toLowerCase()
        );
        setClientPayments(pmtList);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  if (loading) {
    return (
      <div className="py-24 text-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
        <p>Cargando expediente del anfitrión...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Cliente no encontrado</h2>
        <p className="text-zinc-400 text-sm mb-6">El cliente especificado no existe o fue retirado.</p>
        <Link to="/admin/clientes" className="btn btn-secondary">
          &larr; Volver al Directorio
        </Link>
      </div>
    );
  }

  const cleanPhone = (client.phone || "").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/57${cleanPhone.startsWith("57") ? cleanPhone.slice(2) : cleanPhone}?text=${encodeURIComponent(
    `Hola ${client.name}, un saludo de Banquetes Almar.`
  )}`;

  const totalSpent = clientPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* TOPBAR */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Link
          to="/admin/clientes"
          className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1"
        >
          &larr; Volver a Clientes
        </Link>

        {cleanPhone.length >= 7 && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary text-xs px-5 py-2 inline-flex items-center gap-2"
          >
            <span>💬 Conversar por WhatsApp</span>
          </a>
        )}
      </div>

      {/* CLIENT PROFILE CARD */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold uppercase tracking-wider inline-block mb-3">
              Expediente VIP &bull; {client.clientType || "Cliente"}
            </span>
            <h1 className="text-3xl font-serif font-bold text-white">{client.name}</h1>
            <p className="text-zinc-400 text-sm mt-1">
              📍 {client.city} {client.address ? `&bull; ${client.address}` : ""}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-zinc-400 block">Total Invertido en Almar:</span>
            <strong className="text-2xl font-serif font-bold text-emerald-400">
              ${totalSpent.toLocaleString("es-CO")}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-800/80 text-sm">
          <div>
            <span className="text-xs text-zinc-500 block">Teléfono / Móvil:</span>
            <strong className="text-white font-mono">{client.phone}</strong>
          </div>
          <div>
            <span className="text-xs text-zinc-500 block">Correo Electrónico:</span>
            <strong className="text-white">{client.email || "No registrado"}</strong>
          </div>
          <div>
            <span className="text-xs text-zinc-500 block">Documento de Identidad:</span>
            <strong className="text-white font-mono">{client.documentId || "No registrada"}</strong>
          </div>
        </div>

        {client.notes && (
          <div className="mt-4 p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-zinc-300">
            <strong>Notas del Anfitrión:</strong> {client.notes}
          </div>
        )}
      </div>

      {/* EVENT HISTORY */}
      <div className="mb-8">
        <h2 className="text-xl font-serif font-bold text-white mb-4">
          Eventos Contratados ({clientReservations.length})
        </h2>

        {clientReservations.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl text-zinc-500 text-sm">
            No se registran eventos activos para este cliente.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientReservations.map((r) => (
              <div
                key={r.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-white font-serif">{r.eventType}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {r.status}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 space-y-1 mb-4">
                  <div>
                    📅 {r.eventDate} &bull; {r.eventTime}
                  </div>
                  <div>👥 {r.guestCount} invitados</div>
                  <div>🏛️ {r.location}</div>
                  <div className="text-amber-300 font-semibold pt-1">
                    Inversión: ${r.totalAmount.toLocaleString("es-CO")} &bull; Saldo: $
                    {r.balanceAmount.toLocaleString("es-CO")}
                  </div>
                </div>

                <Link
                  to={`/admin/contrato?reservationId=${r.id}`}
                  className="btn btn-secondary text-xs w-full justify-center py-2"
                >
                  📜 Ver Contrato Oficial
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAYMENTS HISTORY */}
      <div>
        <h2 className="text-xl font-serif font-bold text-white mb-4">
          Historial de Abonos ({clientPayments.length})
        </h2>

        {clientPayments.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl text-zinc-500 text-sm">
            No hay abonos registrados para este cliente.
          </div>
        ) : (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-950/80 text-amber-300 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Concepto</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {clientPayments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-mono text-xs">{p.paymentDate}</td>
                    <td className="py-3 px-4">{p.concept}</td>
                    <td className="py-3 px-4">{p.method}</td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-emerald-400">
                      ${p.amount.toLocaleString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
