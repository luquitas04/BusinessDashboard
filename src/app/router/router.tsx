import { CustomersPage } from "../../pages/CustomersPage";
import { OrdersPage } from "../../pages/OrdersPage";
import { ProductsPage } from "../../pages/ProductsPage";
import { Resource } from "../../shared/lib/permissions/permissions";

type RouteConfig = {
  path: string;
  element: JSX.Element;
  resource: Resource;
};

export const protectedRoutes: RouteConfig[] = [
  { path: "/customers", element: <CustomersPage />, resource: "customers" },
  { path: "/orders", element: <OrdersPage />, resource: "orders" },
  { path: "/products", element: <ProductsPage />, resource: "products" },
];
