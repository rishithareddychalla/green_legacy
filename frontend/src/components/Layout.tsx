import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

export const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdminRoute && <WhatsAppButton />}
      <Footer />
    </div>
  );
};
