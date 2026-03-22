import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import Problems from "@/pages/Problems";
import ProblemDetail from "@/pages/ProblemDetail";
import Events from "@/pages/Events";
import Analytics from "@/pages/Analytics";
import Contest from "@/pages/Contest";
import Battle from "@/pages/Battle";
import PairProgramming from "@/pages/PairProgramming";
import Submissions from "@/pages/Submissions";
import Heatmap from "@/pages/Heatmap";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogs from "@/pages/AdminLogs";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Navigate to="/login/user" replace />} />
            <Route path="/login/user" element={<Login />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route
              path="/"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/problems"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <Problems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/problems/:id"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <ProblemDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contest"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <Contest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/battle"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <Battle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pair"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <PairProgramming />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submissions"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <Submissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/heatmap"
              element={
                <ProtectedRoute allowRoles={["user"]}>
                  <Heatmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute allowRoles={["admin"]}>
                  <AdminLogs />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
