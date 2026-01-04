import { Routes, Route } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";

describe("RoleGuard", () => {
  it("prevents staff from accessing admin route", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/customers" element={<div>Customers</div>} />
          <Route element={<RoleGuard allowAdminOnly />}>
            <Route path="/products" element={<div>Products</div>} />
          </Route>
        </Route>
        <Route path="/login" element={<div>Login</div>} />
      </Routes>,
      {
        route: "/products",
        preloadedState: {
          auth: {
            user: { id: 2, name: "Staff", email: "staff@test.com", role: "staff" },
            isAuthenticated: true,
          },
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByText(/Customers/)).toBeInTheDocument();
    });
  });

  it("allows admin to access admin route", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowAdminOnly />}>
            <Route path="/products" element={<div>Products</div>} />
          </Route>
        </Route>
        <Route path="/login" element={<div>Login</div>} />
      </Routes>,
      {
        route: "/products",
        preloadedState: {
          auth: {
            user: { id: 1, name: "Admin", email: "admin@test.com", role: "admin" },
            isAuthenticated: true,
          },
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByText(/Products/)).toBeInTheDocument();
    });
  });
});
