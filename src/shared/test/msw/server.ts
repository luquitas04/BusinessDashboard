import { setupServer } from "msw/node";
import { handlers, resetMockData, setCustomers, setOrders, setProducts } from "./handlers";

export const server = setupServer(...handlers);

export const resetMocks = () => {
  resetMockData();
};

export { setCustomers, setProducts, setOrders };
