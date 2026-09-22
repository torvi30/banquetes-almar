import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dbService } from "../../services/firebase/dbService.js";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

export default function ClientPortalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reservation, setReservation] = useState(null);
  const [payments, setPayments] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setHasSearched(true);

    const found = await dbService.findReservationByPhoneOrCode(searchQuery.trim());
    setReservation(found);

    if (found) {
      const pmts = await dbService.getPaymentsByReservation(found.id);
      setPayments(pmts || []);
    } else {
      setPayments([]);
    }

    setSearching(false);
  };

  // Countdown timer effect
  useEffect(() => {
    if (!reservation?.eventDate) return;

    const targetDate = new Date(reservation.eventDate);
    if (isNaN(targetDate.getTime())) return;

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  const total = Number(reservation?.totalAmount || 0);
  const deposit = Number(reservation?.depositAmount || 0);
  const balance = Math.max(0, total - deposit);
  const percentPaid = total > 0 ? Math.min(100, Math.round((deposit / total) * 100)) : 0;

  const advisorWpUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
    `Hola Banquetes Almar, soy ${reservation?.clientName || "el anfitrión"} (Reserva: ${reservation?.id || "N/A"}). Tengo una consulta sobre mi evento.`
  )}`;

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 font-sans pb-16">
      {/* HEADER */}
      <header className="header sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/85 border-b border-zinc-800/80">
        <nav className="navbar container portal-header-nav flex justify-between items-center py-4">
          <Link to="/" className="brand flex items-center gap-3">
            <img
              src="/images/logo-almar.png"
              alt="Logo Banquetes Almar"
              className="brand-logo w-10 h-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="brand-text">
              <span className="logo-main text-lg font-serif font-bold text-amber-300">
                Banquetes Almar
              </span>
              <span className="logo-sub text-xs text-zinc-400">Portal del Anfitrión VIP</span>
            </div>
          </Link>

          <ul className="nav-links portal-nav-links flex items-center gap-4">
            <li>
              <Link to="/" className="nav-back-link text-sm text-zinc-400 hover:text-white transition">
                ← Volver al Sitio
              </Link>
            </li>
            <li>
              <a
                href={advisorWpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-apple-secondary py-2 px-4 text-xs font-medium inline-block"
              >
                💬 Asesor WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="portal-container container max-w-4xl mx-auto px-4 mt-8">
        {/* LOOKUP CARD */}
        <div className="portal-card bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-md mb-8">
          <div className="portal-header text-center max-w-xl mx-auto">
            <span className="section-label text-amber-300 font-semibold tracking-wider text-xs uppercase">
              Acceso Exclusivo para Anfitriones
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-bold mt-2">
              Mi Celebración Banquetes Almar
            </h1>
            <p className="text-zinc-400 mt-3 text-sm sm:text-base leading-relaxed">
              Ingresa tu número de celular o código de reserva para ver la cuenta regresiva, tus abonos
              registrados y tu contrato oficial.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto flex-wrap mt-6">
            <input
              type="text"
              placeholder="Ingresa tu celular (ej: 311 789 2233) o código ALM-..."
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[240px] px-5 py-3.5 bg-zinc-900 border border-zinc-700/80 rounded-full text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 text-sm"
            />
            <button
              type="submit"
              disabled={searching}
              className="btn-apple-primary px-7 py-3.5 text-sm font-semibold rounded-full"
            >
              {searching ? "Buscando..." : "Consultar"}
            </button>
          </form>

          {/* NOT FOUND ALERT */}
          {hasSearched && !reservation && !searching && (
            <div className="text-center p-8 bg-zinc-900/90 border border-dashed border-amber-500/30 rounded-2xl mt-6">
              <span className="text-4xl block mb-2">🔍</span>
              <h3 className="text-white text-lg font-bold mb-1">
                No encontramos una reserva con esos datos
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto mb-5 text-sm">
                Verifica que el número de celular o código coincida con el registrado en tu contrato, o
                comunícate directamente con nuestro equipo de coordinación.
              </p>
              <a
                href={advisorWpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-apple-primary inline-flex items-center gap-2 text-sm px-6 py-2.5"
              >
                💬 Contactar a mi Asesor
              </a>
            </div>
          )}
        </div>

        {/* DETAILS SECTION */}
        {reservation && (
          <div className="space-y-8">
            {/* HERO & COUNTDOWN */}
            <div className="portal-card bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-md">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <span className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                    {reservation.status === "Confirmed" ? "Reserva Confirmada" : reservation.status}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {reservation.eventType} • {reservation.clientName}
                  </h2>
                  <p className="text-amber-300 text-sm sm:text-base mt-1">
                    📍 {reservation.location || "Salón de Gala Almar (Marinilla)"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-400 block">Código de Evento:</span>
                  <div className="font-mono text-lg font-bold text-amber-300">{reservation.id}</div>
                </div>
              </div>

              {/* COUNTDOWN BOX */}
              <div className="countdown-box grid grid-cols-4 gap-4 my-8 text-center">
                <div className="countdown-unit bg-zinc-900/80 border border-amber-500/20 rounded-2xl p-4">
                  <div className="countdown-number text-3xl sm:text-4xl font-serif font-bold text-amber-300">
                    {timeLeft.days}
                  </div>
                  <div className="countdown-label text-xs uppercase tracking-wider text-zinc-400 mt-1">
                    Días
                  </div>
                </div>
                <div className="countdown-unit bg-zinc-900/80 border border-amber-500/20 rounded-2xl p-4">
                  <div className="countdown-number text-3xl sm:text-4xl font-serif font-bold text-amber-300">
                    {timeLeft.hours}
                  </div>
                  <div className="countdown-label text-xs uppercase tracking-wider text-zinc-400 mt-1">
                    Horas
                  </div>
                </div>
                <div className="countdown-unit bg-zinc-900/80 border border-amber-500/20 rounded-2xl p-4">
                  <div className="countdown-number text-3xl sm:text-4xl font-serif font-bold text-amber-300">
                    {timeLeft.minutes}
                  </div>
                  <div className="countdown-label text-xs uppercase tracking-wider text-zinc-400 mt-1">
                    Minutos
                  </div>
                </div>
                <div className="countdown-unit bg-zinc-900/80 border border-amber-500/20 rounded-2xl p-4">
                  <div className="countdown-number text-3xl sm:text-4xl font-serif font-bold text-amber-300">
                    {timeLeft.seconds}
                  </div>
                  <div className="countdown-label text-xs uppercase tracking-wider text-zinc-400 mt-1">
                    Segundos
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-dashed border-amber-500/40 p-4 rounded-xl flex justify-between items-center flex-wrap gap-3">
                <div>
                  <strong className="text-white text-sm font-semibold">📅 Fecha de la Celebración:</strong>
                  <span className="text-amber-300 font-semibold ml-2">{reservation.eventDate}</span>
                </div>
                <div>
                  <strong className="text-white text-sm font-semibold">👥 Invitados:</strong>
                  <span className="text-amber-300 font-semibold ml-2">{reservation.guestCount} personas</span>
                </div>
              </div>
            </div>

            {/* FINANCIAL STATE & PAYMENTS */}
            <div className="portal-card bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-md">
              <h3 className="font-serif text-xl font-bold text-white mb-2">Estado Financiero y Pagos</h3>
              <p className="text-xs text-zinc-400 mb-6">
                Control transparente de inversión, anticipo y saldo de tu evento.
              </p>

              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
                  <span className="text-xs text-zinc-400 block mb-1">Inversión Total Contratada</span>
                  <strong className="text-xl font-serif font-bold text-white">
                    ${total.toLocaleString("es-CO")}
                  </strong>
                </div>

                <div className="bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-4">
                  <span className="text-xs text-emerald-400 block mb-1">Total Abonos Realizados</span>
                  <strong className="text-xl font-serif font-bold text-emerald-400">
                    ${deposit.toLocaleString("es-CO")}
                  </strong>
                </div>

                <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-4">
                  <span className="text-xs text-amber-300 block mb-1">Saldo Pendiente</span>
                  <strong className="text-xl font-serif font-bold text-amber-300">
                    ${balance.toLocaleString("es-CO")}
                  </strong>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-zinc-400 mb-2">
                  <span>Progreso de Pago</span>
                  <span className="font-semibold text-amber-300">{percentPaid}% cubierto</span>
                </div>
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500"
                    style={{ width: `${percentPaid}%` }}
                  />
                </div>
              </div>

              {/* Payments Ledger Table */}
              <h4 className="text-white text-sm font-semibold mb-3">Historial de Abonos Registrados</h4>
              {payments.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-sm border border-zinc-800/80 rounded-xl">
                  No hay abonos registrados para esta reserva aún.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-300">
                    <thead className="text-xs uppercase bg-zinc-900/90 text-amber-300 border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Concepto</th>
                        <th className="py-3 px-4">Método</th>
                        <th className="py-3 px-4 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4">{p.paymentDate}</td>
                          <td className="py-3 px-4">{p.concept}</td>
                          <td className="py-3 px-4">{p.method}</td>
                          <td className="py-3 px-4 text-right font-semibold text-emerald-400">
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
        )}
      </main>
    </div>
  );
}
