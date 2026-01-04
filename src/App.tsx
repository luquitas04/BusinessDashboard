import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { protectedRoutes } from "./app/router/router";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./widgets/DashboardLayout";
import { ProtectedRoute } from "./shared/lib/router/ProtectedRoute";
import { RoleGuard } from "./shared/lib/router/RoleGuard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customers" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/customers" replace />} />
          {protectedRoutes.map((route) =>
            route.onlyAdmin ? (
              <Route
                key={route.path}
                element={<RoleGuard allowAdminOnly />}
              >
                <Route path={route.path} element={route.element} />
              </Route>
            ) : (
              <Route key={route.path} path={route.path} element={route.element} />
            )
          )}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/customers" replace />} />
    </Routes>
  );
}

export default App;
