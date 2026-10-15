import React from "react";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

/**
 * High-fidelity printable corporate quote & proforma modal for Banquetes Almar.
 * Formatted for standard screen display and clean A4 / Letter PDF output on window.print().
 */
export default function QuotePrintModal({ isOpen, onClose, quoteData }) {
  if (!isOpen || !quoteData) return null;

  const {
    id = "ALM-COT-PROFORMA",
    createdAt = new Date().toISOString().split("T")[0],
    clientName = "Cliente Exclusivo",
    phone = "",
    email = "",
    eventType = "Celebración de Gala",
    eventDate = "Por convenir",
    guestCount = 80,
    location = "Salón de Gala Almar (Marinilla)",
    catering = "Menú de Gala (2 Tiempos)",
    staging = "Sillas Tiffany & Mantelería de Gala",
    addons = [],
    total = 0,
    depositSuggested = Math.round(total * 0.3),
    notes = ""
  } = quoteData;

  const formattedDate = createdAt ? createdAt.split("T")[0] : new Date().toISOString().split("T")[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container Dialog */}
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:max-w-full print:rounded-none">
        
        {/* ACTION BAR (NO-PRINT) */}
        <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex justify-between items-center no-print">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-serif text-lg font-bold">Banquetes Almar</span>
            <span className="text-zinc-500 text-xs hidden sm:inline">&bull; Proforma Oficial de Cotización</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              🖨️ Descargar en PDF / Imprimir
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              ✕ Cerrar
            </button>
          </div>
        </div>

        {/* PRINTABLE SHEET (Pure white paper in print mode) */}
        <div className="printable-sheet bg-white text-zinc-900 p-6 sm:p-10 print:p-0 text-sm print:text-xs leading-relaxed font-sans">
          
          {/* HEADER & LETTERHEAD */}
          <div className="border-b-2 border-amber-600 pb-5 mb-6 flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-serif font-black tracking-tight text-amber-700">BANQUETES ALMAR</span>
              </div>
              <p className="text-zinc-600 font-serif italic text-xs mb-1">
                {BUSINESS_INFO.slogan || "Momentos inolvidables con elegancia excepcional"}
              </p>
              <div className="text-[11px] text-zinc-500 space-y-0.5">
                <p><strong>NIT:</strong> 901.458.712-4 &bull; Régimen Simplificado / Eventos de Gala</p>
                <p>📍 <strong>Sede Marinilla:</strong> {BUSINESS_INFO.mainAddress || "Calle 29 # 28-25, Marinilla, Antioquia"}</p>
                <p>🌄 <strong>Sede Campestre:</strong> Finca Almar &bull; El Peñol, Antioquia</p>
                <p>📞 <strong>Tel / WhatsApp:</strong> {BUSINESS_INFO.mainPhone || "+57 311 789 2233"}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl inline-block text-left mb-2 print:border-zinc-300">
                <p className="text-[10px] uppercase font-bold tracking-wider text-amber-800">COTIZACIÓN / PROFORMA</p>
                <p className="text-base font-bold font-mono text-zinc-900">#{id}</p>
                <p className="text-[10px] text-zinc-500">Emisión: {formattedDate}</p>
                <p className="text-[10px] text-amber-700 font-semibold">Vigencia: 15 días</p>
              </div>
            </div>
          </div>

          {/* CLIENT & EVENT SPECIFICATIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-6 print:border-zinc-300">
            <div>
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-amber-800 mb-2 border-b border-zinc-200 pb-1">
                Datos del Anfitrión / Solicitante
              </h4>
              <p className="text-sm font-bold text-zinc-900 mb-0.5">{clientName}</p>
              {phone && <p className="text-zinc-600 text-xs"><strong>Teléfono:</strong> {phone}</p>}
              {email && <p className="text-zinc-600 text-xs"><strong>Correo:</strong> {email}</p>}
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-amber-800 mb-2 border-b border-zinc-200 pb-1">
                Especificaciones del Evento
              </h4>
              <p className="text-xs text-zinc-700"><strong>Tipo de Celebración:</strong> {eventType}</p>
              <p className="text-xs text-zinc-700"><strong>Fecha Programada:</strong> {eventDate}</p>
              <p className="text-xs text-zinc-700"><strong>Capacidad / Aforo:</strong> <span className="font-bold text-zinc-900">{guestCount} Invitados</span></p>
              <p className="text-xs text-zinc-700"><strong>Sede / Locación:</strong> {location}</p>
            </div>
          </div>

          {/* ITEMIZED PROPOSAL TABLE */}
          <div className="mb-6">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-zinc-800 mb-2">
              Desglose de Servicios & Producción de Gala
            </h4>
            <table className="w-full border-collapse text-left border border-zinc-200 text-xs">
              <thead>
                <tr className="bg-amber-100/70 border-b border-zinc-200 text-zinc-800 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Concepto / Servicio</th>
                  <th className="py-2.5 px-3">Detalle & Especificación</th>
                  <th className="py-2.5 px-3 text-right">Cantidad / Base</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-zinc-900">Locación & Producción</td>
                  <td className="py-2.5 px-3 text-zinc-600">{location}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-700">1 Sede</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-zinc-900">Servicio de Gastronomía</td>
                  <td className="py-2.5 px-3 text-zinc-600">{catering} (Incluye cata de menú para anfitriones)</td>
                  <td className="py-2.5 px-3 text-right text-zinc-700">{guestCount} platos</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-zinc-900">Mobiliario & Montaje</td>
                  <td className="py-2.5 px-3 text-zinc-600">{staging} con cristalería y mantelería fina</td>
                  <td className="py-2.5 px-3 text-right text-zinc-700">{guestCount} puestos</td>
                </tr>
                {addons && addons.length > 0 && (
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 align-top">Adicionales & Espectáculo</td>
                    <td className="py-2.5 px-3 text-zinc-600" colSpan={2}>
                      <ul className="list-disc list-inside space-y-0.5">
                        {addons.map((item, index) => (
                          <li key={index} className="text-zinc-700">
                            {typeof item === "string" ? item : item.label || item.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
                {notes && (
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 align-top">Observaciones</td>
                    <td className="py-2.5 px-3 text-zinc-600 italic" colSpan={2}>{notes}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FINANCIAL SUMMARY TOTALS */}
          <div className="flex justify-end mb-6">
            <div className="w-full sm:w-80 bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs space-y-2 print:border-zinc-300">
              <div className="flex justify-between text-zinc-700">
                <span>Inversión Estimada:</span>
                <span className="font-semibold">${Number(total).toLocaleString("es-CO")} COP</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Anticipo de Reserva (30%):</span>
                <span>${Number(depositSuggested).toLocaleString("es-CO")} COP</span>
              </div>
              <div className="flex justify-between text-zinc-600 border-t border-zinc-200 pt-1.5">
                <span>Saldo Final Restante:</span>
                <span>${Number(total - depositSuggested).toLocaleString("es-CO")} COP</span>
              </div>
              <div className="border-t-2 border-amber-600 pt-2 flex justify-between items-baseline font-bold text-zinc-950 text-sm">
                <span>TOTAL PROPUESTA:</span>
                <span className="text-amber-700 text-base font-serif font-black">
                  ${Number(total).toLocaleString("es-CO")} COP
                </span>
              </div>
            </div>
          </div>

          {/* TERMS & SIGNATURE CLAUSES */}
          <div className="border-t border-zinc-200 pt-4 text-[10px] text-zinc-500 space-y-1 mb-8 print:mb-6">
            <p className="font-bold text-zinc-700 uppercase tracking-wide">Condiciones Generales & Validez Comercial:</p>
            <p>1. Esta propuesta formal de servicios tiene una vigencia legal de quince (15) días calendario a partir de su expedición.</p>
            <p>2. La reserva de la fecha en la agenda exclusiva de Banquetes Almar se consolida únicamente con la firma del contrato y el pago del anticipo estipulado.</p>
            <p>3. Los paquetes todo incluido con más de 50 invitados cuentan con sesión de degustación y cata de menú para 2 a 4 personas en nuestra sede de Marinilla.</p>
            <p>4. Medios de pago autorizados: Transferencia bancaria oficial (Bancolombia / Nequi / Davivienda) o pago en sede administrativa.</p>
          </div>

          {/* SIGNATURE BLOCK */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-zinc-300 text-center text-xs text-zinc-800">
            <div>
              <div className="border-b border-zinc-400 pb-1 mb-1 font-semibold font-serif">
                Alejandro Almar
              </div>
              <p className="font-bold text-zinc-950">BANQUETES ALMAR S.A.S.</p>
              <p className="text-zinc-500 text-[10px]">Dirección Comercial & Eventos &bull; Marinilla, Antioquia</p>
            </div>
            <div>
              <div className="border-b border-zinc-400 pb-1 mb-1 font-semibold font-serif">
                {clientName}
              </div>
              <p className="font-bold text-zinc-950">ANFITRIÓN / CLIENTE RESPONSABLE</p>
              <p className="text-zinc-500 text-[10px]">Aceptación de Propuesta & Términos</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
