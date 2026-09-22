import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dbService } from "../../services/firebase/dbService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { alertService } from "../../services/alertService.js";

export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalPending: 0,
    totalEvents: 0,
    totalQuotes: 0,
    pendingQuotes: [],
    upcomingReservations: []
  });
  const [announcement, setAnnouncement] = useState(null);
  const [inventorySummary, setInventorySummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      dbService.getDashboardMetrics(),
      dbService.getAnnouncement(),
      dbService.getInventory()
    ]).then(([dashData, annoData, invData]) => {
      if (isMounted) {
        setMetrics(dashData);
        setAnnouncement(annoData);
        setInventorySummary((invData || []).slice(0, 5));
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExportCsv = async () => {
    try {
      await dbService.exportFinancialCsv();
      alertService.toast("Informe financiero descargado");
    } catch (e) {
      alertService.error("Error", "No se pudo generar el archivo CSV.");
    }
  };

  return (
    <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* SECTION HEADING */}
      <div className="section-heading text-center mb-8">
        <p className="section-label text-amber-300 font-semibold tracking-wider text-xs uppercase mb-1">
          Suite Ejecutiva
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
          Torre de Control Almar
        </h2>
        <p className="text-zinc-400 text-sm">
          Bienvenido, <strong className="text-amber-200">{currentUser?.name || "Administrador"}</strong>. Centro de operaciones y agenda de gala.
        </p>
      </div>

      {/* FINANCIAL ACTION BAR & EXCEL CSV EXPORT */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
            📊 Estado Financiero Consolidado
          </span>
          <p className="text-white/60 text-sm mt-1 m-0">
            Control maestro de ingresos, recaudos bancarios y saldos pendientes.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="btn btn-primary inline-flex items-center gap-2.5 px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 border border-emerald-400 shadow-lg shadow-emerald-500/30 text-white cursor-pointer rounded-full hover:from-emerald-400 hover:to-emerald-500 transition-all"
        >
          <span>📥 Exportar Informe a Excel (CSV)</span>
        </button>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="admin-summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="summary-card bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="summary-title text-zinc-400 text-xs block mb-1">💰 Total Recaudado</span>
          <strong className="text-2xl font-serif font-bold text-emerald-400">
            ${metrics.totalRevenue.toLocaleString("es-CO")}
          </strong>
        </div>

        <div className="summary-card bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="summary-title text-zinc-400 text-xs block mb-1">⏳ Saldo por Cobrar</span>
          <strong className="text-2xl font-serif font-bold text-amber-300">
            ${metrics.totalPending.toLocaleString("es-CO")}
          </strong>
        </div>

        <div className="summary-card bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="summary-title text-zinc-400 text-xs block mb-1">💍 Eventos en Agenda</span>
          <strong className="text-2xl font-serif font-bold text-white">
            {metrics.totalEvents}
          </strong>
        </div>

        <div className="summary-card bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="summary-title text-zinc-400 text-xs block mb-1">💬 Solicitudes Web</span>
          <strong className="text-2xl font-serif font-bold text-amber-300">
            {metrics.totalQuotes}
          </strong>
        </div>
      </div>

      {/* LIVE ANNOUNCEMENT BANNER WIDGET */}
      <div className="dashboard-announcement-banner bg-amber-500/[0.06] border border-amber-500/30 rounded-[18px] px-6 py-5 my-7 flex items-center justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
              📢 Barra Superior en la Portada
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                announcement?.isActive
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-zinc-800 text-zinc-500 border-zinc-700"
              }`}
            >
              {announcement?.isActive ? "🟢 En Vivo" : "⚪ Oculto"}
            </span>
          </div>

          <div className="bg-[#0a0a0e]/85 border border-amber-500/20 rounded-xl px-4 py-2.5 text-sm text-zinc-200 flex items-center gap-2.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span>{announcement?.icon || "✨"}</span>
            <strong className="text-amber-200">{announcement?.title}</strong>
            <span className="text-zinc-300">{announcement?.message}</span>
            {announcement?.badge && (
              <span className="bg-amber-500/15 border border-amber-500/35 text-amber-200 px-2.5 py-0.5 rounded-full text-xs ml-auto">
                {announcement.badge}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/admin/anuncio" className="btn btn-primary text-sm px-5 py-2.5 whitespace-nowrap">
            ✏️ Configurar Anuncio
          </Link>
          <Link
            to="/"
            target="_blank"
            className="btn btn-secondary text-sm px-4 py-2.5 whitespace-nowrap"
            title="Ver en la web pública"
          >
            🌐 Ver Web
          </Link>
        </div>
      </div>

      {/* 3-COLUMN CONTROL TOWER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: PENDING QUOTES */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                  Atención al Cliente
                </p>
                <h3 className="text-white text-base font-semibold m-0">🔔 Solicitudes Web</h3>
              </div>
              <Link to="/admin/cotizaciones" className="text-xs text-amber-300 hover:underline">
                Ver todas ({metrics.totalQuotes})
              </Link>
            </div>

            <div className="space-y-3">
              {metrics.pendingQuotes.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No hay solicitudes pendientes de atención.
                </div>
              ) : (
                metrics.pendingQuotes.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex justify-between items-center gap-3"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">{q.clientName}</div>
                      <div className="text-xs text-zinc-400">
                        {q.eventType} &bull; {q.guestCount} pers
                      </div>
                      <div className="text-xs text-amber-300/90 font-medium">
                        ${q.estimatedTotal.toLocaleString("es-CO")}
                      </div>
                    </div>
                    <Link
                      to="/admin/cotizaciones"
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition"
                    >
                      Atender
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-800/80 text-center">
            <Link
              to="/admin/cotizaciones"
              className="text-xs text-zinc-400 hover:text-white transition"
            >
              Ir a la bandeja CRM completa &rarr;
            </Link>
          </div>
        </section>

        {/* COLUMN 2: UPCOMING RESERVATIONS */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                  Agenda de Gala
                </p>
                <h3 className="text-white text-base font-semibold m-0">📅 Próximos Eventos</h3>
              </div>
              <Link to="/admin/reservas" className="text-xs text-amber-300 hover:underline">
                Ver agenda
              </Link>
            </div>

            <div className="space-y-3">
              {metrics.upcomingReservations.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No hay reservas confirmadas registradas.
                </div>
              ) : (
                metrics.upcomingReservations.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-semibold text-white">{r.clientName}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {r.status}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      📅 {r.eventDate} &bull; {r.guestCount} invitados
                    </div>
                    <div className="text-xs text-amber-300 font-medium mt-1">
                      Saldo: ${r.balanceAmount.toLocaleString("es-CO")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-800/80 text-center">
            <Link to="/admin/calendario" className="text-xs text-zinc-400 hover:text-white transition">
              Abrir calendario mensual interactivo &rarr;
            </Link>
          </div>
        </section>

        {/* COLUMN 3: INVENTORY SUMMARY */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                  Mobiliario & Menaje
                </p>
                <h3 className="text-white text-base font-semibold m-0">📦 Inventario Activo</h3>
              </div>
              <Link to="/admin/inventario" className="text-xs text-amber-300 hover:underline">
                Gestionar
              </Link>
            </div>

            <div className="space-y-3">
              {inventorySummary.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No hay artículos registrados en el inventario.
                </div>
              ) : (
                inventorySummary.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-sm">
                          📦
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-semibold text-white">{item.name}</div>
                        <div className="text-[10px] text-zinc-400">Stock: {item.stock}</div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-amber-300">
                      ${item.price.toLocaleString("es-CO")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-800/80 text-center">
            <Link to="/admin/inventario" className="text-xs text-zinc-400 hover:text-white transition">
              Administrar catálogo de alquiler &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
