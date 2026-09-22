import React from "react";
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

// Public pages
import HomePage from "./pages/public/HomePage.jsx";
import ClientPortalPage from "./pages/public/ClientPortalPage.jsx";

// Admin pages
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminQuotesPage from "./pages/admin/AdminQuotesPage.jsx";
import AdminReservationsPage from "./pages/admin/AdminReservationsPage.jsx";
import AdminCalendarPage from "./pages/admin/AdminCalendarPage.jsx";
import AdminPackagesPage from "./pages/admin/AdminPackagesPage.jsx";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage.jsx";
import AdminServicesPage from "./pages/admin/AdminServicesPage.jsx";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage.jsx";
import AdminClientsPage from "./pages/admin/AdminClientsPage.jsx";
import AdminClientDetailPage from "./pages/admin/AdminClientDetailPage.jsx";
import AdminGalleryPage from "./pages/admin/AdminGalleryPage.jsx";
import AdminAnnouncementPage from "./pages/admin/AdminAnnouncementPage.jsx";
import AdminContractPage from "./pages/admin/AdminContractPage.jsx";

// Public layout wrapper
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopAnnouncementBanner />
      <PublicNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <PublicFooter />
      <RentalCartDrawer />
      <WhatsAppConciergeModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
