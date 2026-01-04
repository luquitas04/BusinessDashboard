import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import { LoginPage } from "./index";
import { CustomersPage } from "../CustomersPage";
import { renderWithProviders } from "../../shared/test/renderWithProviders";

describe("LoginPage", () => {
  it("logs in admin and redirects to customers", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>,
      { route: "/login" }
    );

    await user.type(screen.getByLabelText(/email/i), "admin@test.com");
    await user.click(screen.getByRole("button", { name: /sign in|entrar/i }));

    expect(
      await screen.findByRole("heading", { name: /customers/i })
    ).toBeInTheDocument();
  });

  it("shows error on invalid login", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>,
      { route: "/login" }
    );

    await user.type(screen.getByLabelText(/email/i), "unknown@test.com");
    await user.click(screen.getByRole("button", { name: /sign in|entrar/i }));

    expect(
      await screen.findByText(/email no encontrado|email not found/i)
    ).toBeInTheDocument();
  });
});
