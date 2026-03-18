import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { OJTProvider } from "./app/context/OJTContext";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import { Dashboard } from "./app/pages/Dashboard";
import { Logs } from "./app/pages/Logs";
import { Profile } from "./app/pages/Profile";
import { Welcome } from "./app/pages/Welcome";
import { Login } from "./app/pages/Login";
import { Register } from "./app/pages/Register";
import { Setup } from "./app/pages/Setup";
import Layout from "./app/components/Layout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <OJTProvider key={user?.id ?? "guest"}>
      <Routes>
        <Route path="/welcome" element={<PublicOnlyRoute><Welcome /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

        <Route path="/setup" element={<RequireAuth><Setup /></RequireAuth>} />

        <Route path="/" element={<RequireReady><Layout><Dashboard /></Layout></RequireReady>} />
        <Route path="/logs" element={<RequireReady><Layout><Logs /></Layout></RequireReady>} />
        <Route path="/profile" element={<RequireReady><Layout><Profile /></Layout></RequireReady>} />

        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </OJTProvider>
  );
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isSetupComplete } = useAuth();
  if (isAuthenticated && isSetupComplete) return <Navigate to="/" replace />;
  if (isAuthenticated && !isSetupComplete) return <Navigate to="/setup" replace />;
  return children;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function RequireReady({ children }: { children: ReactNode }) {
  const { isAuthenticated, isSetupComplete } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isSetupComplete) return <Navigate to="/setup" replace />;
  return children;
}

export default App;