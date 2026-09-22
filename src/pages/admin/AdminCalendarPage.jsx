import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dbService } from "../../services/firebase/dbService.js";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WEEKDAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function AdminCalendarPage() {
  const [reservations, setReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    dbService.getReservations().then((data) => {
      if (isMounted) {
        setReservations(data || []);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar matrix calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map events to date strings "YYYY-MM-DD"
  const eventsByDate = reservations.reduce((acc, r) => {
    if (!r.eventDate) return acc;
    const dateKey = r.eventDate.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(r);
    return acc;
  }, {});

  const handleDayClick = (dayNum) => {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(dayNum).padStart(2, "0");
    const dateKey = `${year}-${monthStr}-${dayStr}`;
    setSelectedDateStr(dateKey);
    setSelectedDayEvents(eventsByDate[dateKey] || []);
  };

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
            Agenda Visual
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">
            Calendario Mensual de Eventos
          </h1>
          <p className="text-zinc-400 text-sm">
            Monitorea disponibilidad de fechas y cruce de eventos en Marinilla y El Peñol.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/reservas"
            className="btn btn-secondary text-sm px-5 py-2.5 inline-flex items-center gap-2"
          >
            <span>📋 Vista de Lista</span>
          </Link>
        </div>
      </div>

      {/* CALENDAR CONTROLS */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md mb-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif font-bold text-white">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button
              type="button"
              onClick={goToToday}
              className="text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white"
            >
              Hoy
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevMonth}
              className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-amber-400 transition"
              aria-label="Mes anterior"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-amber-400 transition"
              aria-label="Mes siguiente"
            >
              &#8250;
            </button>
          </div>
        </div>

        {/* WEEKDAYS */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-amber-400/90 uppercase tracking-wider mb-2">
          {WEEKDAY_NAMES.map((wd) => (
            <div key={wd} className="py-2">
              {wd}
            </div>
          ))}
        </div>

        {/* DAYS GRID */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 sm:h-28 rounded-2xl bg-zinc-950/20" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const monthStr = String(month + 1).padStart(2, "0");
            const dayStr = String(dayNum).padStart(2, "0");
            const dateKey = `${year}-${monthStr}-${dayStr}`;
            const dayEvents = eventsByDate[dateKey] || [];
            const hasEvents = dayEvents.length > 0;

            const isToday =
              new Date().toISOString().split("T")[0] === dateKey;

            return (
              <div
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={`h-24 sm:h-28 rounded-2xl p-2.5 border transition cursor-pointer flex flex-col justify-between ${
                  isToday
                    ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                    : hasEvents
                    ? "border-amber-500/30 bg-zinc-900/90 hover:border-amber-400"
                    : "border-zinc-800/80 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-bold font-mono ${
                      isToday ? "text-amber-300" : "text-zinc-400"
                    }`}
                  >
                    {dayNum}
                  </span>
                  {hasEvents && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>

                <div className="overflow-hidden space-y-1">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="text-[10px] truncate px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-medium"
                    >
                      {ev.clientName}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] text-zinc-500 font-semibold">
                      +{dayEvents.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED DAY EVENTS MODAL / DRAWER */}
      {selectedDayEvents && (
        <div className="apple-modal-overlay open">
          <div className="apple-modal-content max-w-lg">
            <button
              type="button"
              className="apple-modal-close"
              onClick={() => setSelectedDayEvents(null)}
            >
              &times;
            </button>

            <div className="border-b border-zinc-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Agenda del Día
              </span>
              <h2 className="text-xl font-serif font-bold text-white mt-1">
                {selectedDateStr}
              </h2>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-sm">
                No hay eventos agendados para este día. ¡Fecha disponible para nuevas reservas!
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-bold text-white font-serif">{ev.clientName}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {ev.status}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-300 space-y-1">
                      <div>
                        <strong>Celebración:</strong> {ev.eventType}
                      </div>
                      <div>
                        <strong>Hora:</strong> {ev.eventTime} &bull; <strong>Invitados:</strong>{" "}
                        {ev.guestCount} pers
                      </div>
                      <div>
                        <strong>Sede:</strong> {ev.location}
                      </div>
                      <div>
                        <strong>Total:</strong> ${ev.totalAmount.toLocaleString("es-CO")} &bull;{" "}
                        <strong>Saldo:</strong> ${ev.balanceAmount.toLocaleString("es-CO")}
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Link
                        to={`/admin/contrato?reservationId=${ev.id}`}
                        className="btn btn-secondary text-xs px-3 py-1.5 flex-1 text-center"
                      >
                        Ver Contrato
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 mt-4 border-t border-zinc-800">
              <button
                type="button"
                className="btn-apple-secondary w-full justify-center py-2.5"
                onClick={() => setSelectedDayEvents(null)}
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
