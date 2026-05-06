import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import Documents from "../pages/Documents";
import Search from "../pages/Search";
import Chat from "../pages/Chat";
import Users from "../pages/Users";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoutes";
import AdminRoute from "./AdminRoute";

const pageVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.98 },
};

const pageTransition = {
  duration: 0.35,
  ease: "easeOut",
};

function PageWrapper({ children }) {
  return (
    <motion.div
      className="page-motion"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🔓 Public Routes */}
        <Route
          path="/"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Documents />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Search />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Chat />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Upload />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* 👑 Admin Only */}
        <Route
          path="/users"
          element={
            <AdminRoute>
              <PageWrapper>
                <Users />
              </PageWrapper>
            </AdminRoute>
          }
        />

        {/* ❌ 404 */}
        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFound />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default AppRoutes;
