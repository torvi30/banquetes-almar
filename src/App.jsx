import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

// Layout components
import TopAnnouncementBanner from "./components/layout/TopAnnouncementBanner.jsx";
import PublicNavbar from "./components/layout/PublicNavbar.jsx";
import PublicFooter from "./components/layout/PublicFooter.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import RentalCartDrawer from "./components/common/RentalCartDrawer.jsx";
import WhatsAppConciergeModal from "./components/common/WhatsAppConciergeModal.jsx";

// Core Public Pages (HomePage loaded directly for fastest First Contentful Paint)
import HomePage from "./pages/public/HomePage.jsx";

// Lazy-loaded VIP Portal and Admin Suite for optimal chunk division
const ClientPortalPage = lazy(() => import("./pages/public/ClientPortalPage.jsx"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage.jsx"));
const AdminQuotesPage = lazy(() => import("./pages/admin/AdminQuotesPage.jsx"));
const AdminReservationsPage = lazy(() => import("./pages/admin/AdminReservationsPage.jsx"));
const AdminCalendarPage = lazy(() => import("./pages/admin/AdminCalendarPage.jsx"));
const AdminPackagesPage = lazy(() => import("./pages/admin/AdminPackagesPage.jsx"));
const AdminInventoryPage = lazy(() => import("./pages/admin/AdminInventoryPage.jsx"));
const AdminServicesPage = lazy(() => import("./pages/admin/AdminServicesPage.jsx"));
const AdminPaymentsPage = lazy(() => import("./pages/admin/AdminPaymentsPage.jsx"));
const AdminClientsPage = lazy(() => import("./pages/admin/AdminClientsPage.jsx"));
const AdminClientDetailPage = lazy(() => import("./pages/admin/AdminClientDetailPage.jsx"));
const AdminGalleryPage = lazy(() => import("./pages/admin/AdminGalleryPage.jsx"));
const AdminAnnouncementPage = lazy(() => import("./pages/admin/AdminAnnouncementPage.jsx"));
const AdminContractPage = lazy(() => import("./pages/admin/AdminContractPage.jsx"));

// Elegant Gala Loading Fallback for Suspense transitions
function GalaLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mb-4" />
      <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold font-sans">
        Cargando Plataforma Almar...
      </p>
    </div>
  );
}

// Public layout wrapper
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen print:min-h-0 print:bg-white print:text-black">
      <div className="no-print print:hidden">
        <TopAnnouncementBanner />
        <PublicNavbar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
      <div className="no-print print:hidden">
        <PublicFooter />
        <RentalCartDrawer />
        <WhatsAppConciergeModal />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<GalaLoadingFallback />}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/portafolio-servicios" element={<Navigate to="/#galeria" replace />} />
                <Route path="/portfolio" element={<Navigate to="/#galeria" replace />} />
              </Route>

              {/* STANDALONE VIP CLIENT PORTAL */}
              <Route
                path="/portal-cliente"
                element={
                  <>
                    <ClientPortalPage />
                    <RentalCartDrawer />
                    <WhatsAppConciergeModal />
                  </>
                }
              />

              {/* ADMIN AUTH */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* ADMIN PROTECTED SUITE */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="cotizaciones" element={<AdminQuotesPage />} />
                <Route path="reservas" element={<AdminReservationsPage />} />
                <Route path="eventos" element={<Navigate to="/admin/reservas" replace />} />
                <Route path="calendario" element={<AdminCalendarPage />} />
                <Route path="paquetes" element={<AdminPackagesPage />} />
                <Route path="inventario" element={<AdminInventoryPage />} />
                <Route path="servicios" element={<AdminServicesPage />} />
                <Route path="pagos" element={<AdminPaymentsPage />} />
                <Route path="clientes" element={<AdminClientsPage />} />
                <Route path="cliente" element={<AdminClientDetailPage />} />
                <Route path="galeria" element={<AdminGalleryPage />} />
                <Route path="anuncio" element={<AdminAnnouncementPage />} />
                <Route path="contrato" element={<AdminContractPage />} />
              </Route>

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
