import { useState, useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import { motion } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CartProvider } from "@/contexts/CartContext";
import { RewardsProvider } from "@/contexts/RewardsContext";
import { BrandOpening } from "@/components/BrandOpening";
import ScrollToTop from "./ScrollToTop";
import Index from "./pages/Index";
import Donate from "./pages/Donate";
import ChooseTree from "./pages/ChooseTree";
import Subscribe from "./pages/Subscribe";
import Impact from "./pages/Impact";
import About from "./pages/About";
import GetInvolved from "./pages/GetInvolved";
import Media from "./pages/Media";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";
import { AdminRoutes } from "./pages/admin/AdminRoutes";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering");  // Debug log
  const [showOpening, setShowOpening] = useState(() => {
    return !sessionStorage.getItem('openingShown');
  });

  const handleOpeningComplete = () => {
    sessionStorage.setItem('openingShown', 'true');
    setShowOpening(false);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Suspense fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-white text-black text-xl">
              <p>Loading Green Legacy...</p>
            </div>
          }>
            <div className="min-h-screen bg-background">
              <Toaster />
              <Sonner />
              {showOpening && <BrandOpening onComplete={handleOpeningComplete} />}
              <BrowserRouter>
                <CartProvider>
                  <RewardsProvider>
                    <ScrollToTop />
                    <Routes>
                    <Route path="/auth" element={<Auth />} />
                        <Route 
                          path="/admin/*" 
                          element={
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <AdminAuthProvider>
                                <AdminRoutes />
                              </AdminAuthProvider>
                            </motion.div>
                          } 
                        />
                        <Route path="/" element={<Layout />}>
                          <Route index element={<Index />} />
                          <Route 
                            path="donate" 
                            element={
                              <ProtectedRoute>
                                <Donate />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="choose-tree" 
                            element={
                              <ProtectedRoute>
                                <ChooseTree />
                              </ProtectedRoute>
                            } 
                          />
                          <Route path="subscribe" element={<Subscribe />} />
                          <Route path="impact" element={<Impact />} />
                          <Route path="about" element={<About />} />
                          <Route path="get-involved" element={<GetInvolved />} />
                          <Route path="media" element={<Media />} />
                          <Route path="contact" element={<Contact />} />
                          <Route 
                            path="payment" 
                            element={
                              <ProtectedRoute>
                                <Payment />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="dashboard" 
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="rewards" 
                            element={
                              <ProtectedRoute>
                                <Rewards />
                              </ProtectedRoute>
                            } 
                          />
                          <Route path="*" element={<NotFound />} />
                        </Route>
                      </Routes>
                    </RewardsProvider>
                  </CartProvider>
                </BrowserRouter>
            </div>
          </Suspense>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;