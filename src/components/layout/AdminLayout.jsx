import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar.jsx";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans print:bg-white print:text-black print:min-h-0">
      <div className="print:hidden">
        <AdminNavbar />
      </div>
      <div className="flex-1 print:p-0">
        <Outlet />
      </div>
      <footer className="py-6 border-t border-zinc-800 text-center text-xs text-zinc-500 print:hidden">
        Banquetes Almar &bull; Plataforma Ejecutiva de Control y Agenda &bull; Marinilla, Antioquia
      </footer>
    </div>
  );
}
