import { CustomersPage } from "../../pages/CustomersPage";
import { OrdersPage } from "../../pages/OrdersPage";
import { ProductsPage } from "../../pages/ProductsPage";

type RouteConfig = {
  path: string;
  element: JSX.Element;
  onlyAdmin?: boolean;
};

export const protectedRoutes: RouteConfig[] = [
  { path: "/customers", element: <CustomersPage /> },
  { path: "/orders", element: <OrdersPage /> },
  { path: "/products", element: <ProductsPage />, onlyAdmin: true },
];
