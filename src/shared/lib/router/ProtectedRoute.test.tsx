import { Routes, Route } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";
import { ProtectedRoute } from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  it("redirects to /login when unauthenticated", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/customers" element={<div>Customers</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { route: "/customers", preloadedState: { auth: { user: null, isAuthenticated: false } } }
    );

    await waitFor(() => {
      expect(screen.getByText(/Login Page/)).toBeInTheDocument();
    });
  });

  it("renders protected route when authenticated", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/customers" element={<div>Customers</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      {
        route: "/customers",
        preloadedState: {
          auth: {
            user: { id: 1, name: "Admin", email: "admin@test.com", role: "admin" },
            isAuthenticated: true,
          },
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByText(/Customers/)).toBeInTheDocument();
    });
  });
});
