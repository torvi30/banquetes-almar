import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { dbService } from "../../services/firebase/dbService.js";
import { alertService } from "../../services/alertService.js";
import { BUSINESS_INFO } from "../../config/businessInfo.js";

export default function AdminContractPage() {
  const [searchParams] = useSearchParams();
  const queryReservationId = searchParams.get("reservationId");

  const [reservations, setReservations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [contractData, setContractData] = useState({
    id: "ALM-2026-001",
    clientName: "Valentina Muñoz",
    clientDoc: "C.C. 1.036.945.112",
    phone: "+57 311 789 2233",
    email: "cliente@banquetesalmar.com",
    city: "Marinilla, Antioquia",
    eventType: "Boda Imperial Campestre",
    eventDate: "2026-11-14",
    eventTime: "16:00",
    location: "Salón de Gala Almar (Calle 29 # 28-25 Marinilla)",
    guestCount: 80,
    totalAmount: 4800000,
    depositAmount: 1440000,
    balanceAmount: 3360000,
    notes: "Incluye banquete a 3 tiempos, decoración floral y silletería Tiffany."
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    dbService.getReservations().then((resList) => {
      if (!isMounted) return;
      setReservations(resList || []);

      const targetId = queryReservationId || (resList && resList[0]?.id) || "";
      setSelectedId(targetId);

      if (targetId && resList) {
        const found = resList.find((r) => r.id === targetId);
        if (found) {
          setContractData({
            id: found.id,
            clientName: found.clientName,
            clientDoc: found.documentId || "C.C. No registrada",
            phone: found.phone,
            email: found.email || "No registrado",
            city: found.location?.includes("Peñol") ? "El Peñol, Antioquia" : "Marinilla, Antioquia",
            eventType: found.eventType,
            eventDate: found.eventDate,
            eventTime: found.eventTime || "16:00",
            location: found.location || "Salón de Gala Banquetes Almar (Marinilla)",
            guestCount: found.guestCount || 50,
            totalAmount: found.totalAmount || 0,
            depositAmount: found.depositAmount || 0,
            balanceAmount: found.balanceAmount || 0,
            notes: found.notes || ""
          });
        }
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [queryReservationId]);

  const handleSelectReservation = (resId) => {
    setSelectedId(resId);
    const found = reservations.find((r) => r.id === resId);
    if (found) {
      setContractData({
        id: found.id,
        clientName: found.clientName,
        clientDoc: found.documentId || "C.C. No registrada",
        phone: found.phone,
        email: found.email || "No registrado",
        city: found.location?.includes("Peñol") ? "El Peñol, Antioquia" : "Marinilla, Antioquia",
        eventType: found.eventType,
        eventDate: found.eventDate,
        eventTime: found.eventTime || "16:00",
        location: found.location || "Salón de Gala Banquetes Almar (Marinilla)",
        guestCount: found.guestCount || 50,
        totalAmount: found.totalAmount || 0,
        depositAmount: found.depositAmount || 0,
        balanceAmount: found.balanceAmount || 0,
        notes: found.notes || ""
      });
    }
  };

  const handleShareWhatsapp = () => {
    const cleanPhone = (contractData.phone || "").replace(/\D/g, "");
    const msg = `📜 *MINUTA DE CONTRATO OFICIAL - BANQUETES ALMAR* 📜
────────────────────────
Estimado(a) *${contractData.clientName}*:
Adjuntamos los términos formales para la celebración de tu evento (*${contractData.eventType}*) programado para el día *${contractData.eventDate}* en ${contractData.location}.

💰 Inversión Total: $${contractData.totalAmount.toLocaleString("es-CO")} COP
💵 Anticipo Asentado: $${contractData.depositAmount.toLocaleString("es-CO")} COP
⏳ Saldo Pendiente: $${contractData.balanceAmount.toLocaleString("es-CO")} COP

Puedes consultar tu contrato oficial o imprimir tu copia en cualquier momento.`;

    const url = `https://wa.me/57${cleanPhone.startsWith("57") ? cleanPhone.slice(2) : cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-zinc-900 text-zinc-900 min-h-screen pb-16 font-sans">
      {/* TOP TOOLBAR (NO-PRINT) */}
      <header className="bg-zinc-950 border-b border-zinc-800 p-4 sticky top-0 z-50 no-print flex justify-between items-center flex-wrap gap-4 text-white">
        <div className="flex items-center gap-3">
          <Link to="/admin/reservas" className="btn btn-secondary text-xs px-4 py-2">
            &larr; Volver
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Cargar Evento:</span>
            <select
              value={selectedId}
              onChange={(e) => handleSelectReservation(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-1.5 rounded-xl outline-none"
            >
              {reservations.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} &bull; {r.clientName} ({r.eventType})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsapp}
            className="btn btn-secondary text-xs px-4 py-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
          >
            💬 Enviar a WhatsApp
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-primary text-xs px-5 py-2 font-bold"
          >
            🖨️ Imprimir / Guardar en PDF
          </button>
        </div>
      </header>

      {/* CONTRACT SHEET (PRINTABLE A4 / LETTER) */}
      <main className="contract-sheet bg-white text-zinc-900 max-w-4xl mx-auto my-8 p-10 sm:p-14 rounded-2xl shadow-2xl border border-zinc-300 print:shadow-none print:border-none print:m-0 print:p-0 print:max-w-full">
        {/* BRAND HEADER */}
        <div className="border-b-2 border-amber-600 pb-4 mb-6 flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/images/logo-almar.png"
                alt="Banquetes Almar"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h2 className="font-serif text-2xl font-bold text-zinc-950">Banquetes Almar</h2>
                <div className="text-[11px] font-bold text-zinc-600">
                  BANQUETES ALMAR S.A.S. &bull; NIT: 71.378.912-4
                </div>
              </div>
            </div>
            <div className="text-[11px] text-zinc-600 leading-tight">
              Sede 1: Calle 29 n° 28-25, Marinilla &bull; Sede 2: Finca El Peñol (Sector Represa)
              <br />
              PBX: (604) 548 5352 &bull; WhatsApp: +57 314 884 9011 &bull; banquetes-almar@hotmail.com
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block bg-amber-100 border border-amber-400 text-amber-900 font-mono font-bold text-xs px-3 py-1 rounded-full uppercase">
              CONTRATO N° {contractData.id}
            </span>
            <div className="text-[11px] text-zinc-500 mt-2">
              Expedido en Marinilla, Antioquia
              <br />
              Fecha de emisión: <strong>{new Date().toLocaleDateString("es-CO")}</strong>
            </div>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center my-6">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 uppercase tracking-wide">
            Contrato de Prestación de Servicios Integrales para Eventos
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Régimen Comercial y Civil de la República de Colombia
          </p>
        </div>

        {/* SECTION 1: PARTIES */}
        <div className="mb-6">
          <h3 className="font-serif font-bold text-sm text-zinc-950 border-b border-zinc-200 pb-1 mb-2 uppercase tracking-wider">
            1. Partes Intervinientes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
            <div>
              <strong>Prestador:</strong> BANQUETES ALMAR S.A.S. (NIT 71.378.912-4)
            </div>
            <div>
              <strong>Representante Legal:</strong> Alejandro Almar (C.C. 71.378.912)
            </div>
            <div>
              <strong>Contratante / Anfitrión:</strong> {contractData.clientName}
            </div>
            <div>
              <strong>Documento de Identidad:</strong> {contractData.clientDoc}
            </div>
            <div>
              <strong>Teléfono / WhatsApp:</strong> {contractData.phone}
            </div>
            <div>
              <strong>Ciudad / Domicilio:</strong> {contractData.city}
            </div>
          </div>
        </div>

        {/* SECTION 2: EVENT SPECIFICATIONS */}
        <div className="mb-6">
          <h3 className="font-serif font-bold text-sm text-zinc-950 border-b border-zinc-200 pb-1 mb-2 uppercase tracking-wider">
            2. Especificaciones de la Celebración
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
            <div>
              <strong>Tipo de Ocasión:</strong> {contractData.eventType}
            </div>
            <div>
              <strong>Fecha del Evento:</strong> {contractData.eventDate} ({contractData.eventTime})
            </div>
            <div>
              <strong>Locación Contratada:</strong> {contractData.location}
            </div>
            <div>
              <strong>Número de Invitados Pactado:</strong> {contractData.guestCount} personas
            </div>
          </div>
          {contractData.notes && (
            <div className="mt-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded border border-zinc-200">
              <strong>Alcance y Servicios Incluidos:</strong> {contractData.notes}
            </div>
          )}
        </div>

        {/* SECTION 3: FINANCIAL AGREEMENT */}
        <div className="mb-6">
          <h3 className="font-serif font-bold text-sm text-zinc-950 border-b border-zinc-200 pb-1 mb-2 uppercase tracking-wider">
            3. Contraprestación Económica y Forma de Pago
          </h3>
          <table className="w-full text-xs text-zinc-700 border border-zinc-200 mb-3">
            <tbody>
              <tr className="border-b border-zinc-200">
                <td className="p-2 font-semibold">Valor Total Contratado:</td>
                <td className="p-2 text-right font-serif font-bold text-zinc-950 text-sm">
                  ${contractData.totalAmount.toLocaleString("es-CO")} COP
                </td>
              </tr>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <td className="p-2 font-semibold">Anticipo de Separación Asentado:</td>
                <td className="p-2 text-right font-serif font-bold text-emerald-800 text-sm">
                  ${contractData.depositAmount.toLocaleString("es-CO")} COP
                </td>
              </tr>
              <tr className="border-b border-zinc-200">
                <td className="p-2 font-semibold">Saldo Pendiente por Liquidar:</td>
                <td className="p-2 text-right font-serif font-bold text-amber-800 text-sm">
                  ${contractData.balanceAmount.toLocaleString("es-CO")} COP
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-[11px] text-zinc-500">
            * El saldo restante deberá cancelarse en su totalidad a más tardar cinco (5) días hábiles
            antes de la fecha programada para la realización del evento.
          </p>
        </div>

        {/* SECTION 4: LEGAL CLAUSES */}
        <div className="space-y-3 text-[11px] text-zinc-600 leading-relaxed border-t border-zinc-200 pt-4 mb-8">
          <p>
            <strong>PRIMERA. OBJETO:</strong> EL PRESTADOR se compromete a suministrar los servicios de
            organización, salón o montaje campestre, banquetería y menaje descritos en el presente
            acuerdo.
          </p>
          <p>
            <strong>SEGUNDA. OBLIGACIONES DEL PRESTADOR:</strong> Garantizar la calidad de los alimentos,
            la puntualidad en el montaje y el funcionamiento óptimo de los equipos e instalaciones.
          </p>
          <p>
            <strong>TERCERA. OBLIGACIONES DEL CONTRATANTE:</strong> Cumplir con los plazos de pago
            pactados y velar por el buen trato de los bienes y mobiliario dispuestos durante la
            celebración.
          </p>
          <p>
            <strong>CUARTA. POLÍTICA DE CANCELACIÓN Y FUERZA MAYOR:</strong> En caso de fuerza mayor o caso
            fortuito debidamente comprobado, las partes concertarán una nueva fecha conforme a la
            disponibilidad de la agenda de BANQUETES ALMAR.
          </p>
        </div>

        {/* SIGNATURES SECTION */}
        <div className="grid grid-cols-2 gap-12 pt-12 border-t-2 border-zinc-300 text-xs text-zinc-800">
          <div className="text-center">
            <div className="border-b border-zinc-400 pb-1 mb-2 font-semibold font-serif">
              Alejandro Almar
            </div>
            <div className="font-bold text-zinc-950">BANQUETES ALMAR S.A.S.</div>
            <div className="text-zinc-500 text-[10px]">Representante Legal &bull; C.C. 71.378.912</div>
          </div>

          <div className="text-center">
            <div className="border-b border-zinc-400 pb-1 mb-2 font-semibold font-serif">
              {contractData.clientName}
            </div>
            <div className="font-bold text-zinc-950">EL CONTRATANTE / ANFITRIÓN</div>
            <div className="text-zinc-500 text-[10px]">{contractData.clientDoc}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
