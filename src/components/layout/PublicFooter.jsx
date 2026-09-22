import React from "react";
import { Link } from "react-router-dom";

export default function PublicFooter() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 py-14 px-4 sm:px-6 text-zinc-400 text-sm">
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <div>
          <h4 className="text-amber-300 font-serif text-xl font-bold mb-3">Banquetes Almar</h4>
          <p>
            Especialistas en bodas, 15 años, eventos corporativos, catering de gala y alquiler de
            mobiliario en Marinilla y todo el Oriente Antioqueño.
          </p>
        </div>

        <div>
          <h4 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            Servicios
          </h4>
          <ul className="flex flex-col gap-2 text-sm text-zinc-300">
            <li>
              <a href="#paquetes">Bodas de Ensueño</a>
            </li>
            <li>
              <a href="#paquetes">Quince Años de Gala</a>
            </li>
            <li>
              <a href="#gastronomia">Gastronomía & Banquetería</a>
            </li>
            <li>
              <a href="#galeria">Galería de Montajes</a>
            </li>
            <li>
              <a href="#alquiler">Alquiler de Sillas Tiffany</a>
            </li>
            <li>
              <a href="#alquiler">Carpas y Estructuras</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            Oriente Antioqueño
          </h4>
          <p>
            Prestamos servicio en: Marinilla, Rionegro, Guarne, El Carmen de Viboral, El Santuario,
            El Retiro, La Ceja y San Vicente Ferrer.
          </p>
        </div>

        <div>
          <h4 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            Contacto & Accesos
          </h4>
          <p>📱 +57 314 8849011</p>
          <p>📍 Calle 29 n° 28-25, Marinilla</p>
          <p className="mt-3">
            <Link
              to="/portal-cliente"
              className="text-amber-300 underline font-medium hover:text-amber-200"
            >
              👑 Portal del Anfitrión (Mi Evento)
            </Link>
          </p>
        </div>
      </div>

      <div className="container text-center border-t border-white/5 pt-6 text-xs text-zinc-500">
        <p>© 2026 Banquetes Almar. Diseñado con excelencia y precisión para Marinilla, Antioquia.</p>
      </div>
    </footer>
  );
}
