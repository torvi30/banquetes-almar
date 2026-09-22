import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar.jsx";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AdminNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="py-6 border-t border-zinc-800 text-center text-xs text-zinc-500">
        Banquetes Almar &bull; Plataforma Ejecutiva de Control y Agenda &bull; Marinilla, Antioquia
      </footer>
    </div>
  );
}
