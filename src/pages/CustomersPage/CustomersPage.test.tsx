import userEvent from "@testing-library/user-event";
import { screen, waitFor, within } from "@testing-library/react";
import { CustomersPage } from ".";
import { renderWithProviders } from "../../shared/test/renderWithProviders";
import { setCustomers } from "../../shared/test/msw/server";

describe("CustomersPage", () => {
  it("shows loading state initially", () => {
    const { container } = renderWithProviders(<CustomersPage />, {
      preloadedState: { auth: { user: { id: 1, name: "Admin", email: "admin@test.com", role: "admin" }, isAuthenticated: true } },
      route: "/customers",
    });
    expect(container.querySelectorAll(".customers-table__skeleton").length).toBeGreaterThan(0);
  });

  it("shows empty state when no customers", async () => {
    setCustomers([]);
    renderWithProviders(<CustomersPage />, {
      preloadedState: { auth: { user: { id: 1, name: "Admin", email: "admin@test.com", role: "admin" }, isAuthenticated: true } },
      route: "/customers",
    });

    await waitFor(() => {
      expect(screen.getByText(/No hay clientes|No customers/i)).toBeInTheDocument();
    });
  });

  it("creates a customer and renders the new row", async () => {
    setCustomers([]);
    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />, {
      preloadedState: { auth: { user: { id: 1, name: "Admin", email: "admin@test.com", role: "admin" }, isAuthenticated: true } },
      route: "/customers",
    });

    await user.click(screen.getByRole("button", { name: /new customer|nuevo cliente/i }));
    await user.type(screen.getByLabelText(/name|nombre/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@test.com");
    await user.click(screen.getByRole("button", { name: /save|guardar/i }));

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  it("deletes a customer", async () => {
    setCustomers([
      {
        id: 99,
        name: "Delete Me",
        email: "delete@me.com",
        status: "active",
        createdAt: new Date().toISOString() as unknown as Date,
      },
    ]);

    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />, {
      preloadedState: { auth: { user: { id: 1, name: "Admin", email: "admin@test.com", role: "admin" }, isAuthenticated: true } },
      route: "/customers",
    });

    await waitFor(() => {
      expect(screen.getByText("Delete Me")).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole("button", { name: /delete|eliminar/i })[0]);
    const dialog = await screen.findByRole("dialog");
    const confirmButton = await within(dialog).findByRole("button", { name: /delete|eliminar/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText("Delete Me")).not.toBeInTheDocument();
    });
  });
});
