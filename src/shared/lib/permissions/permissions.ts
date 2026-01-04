import { Role } from "../../../entities/users/types/type";

export type Resource = "customers" | "products" | "orders";
export type Permission = "read" | "create" | "update" | "delete";

const permissions: Record<Role, Record<Resource, Permission[]>> = {
  admin: {
    customers: ["read", "create", "update", "delete"],
    products: ["read", "create", "update", "delete"],
    orders: ["read", "create", "update"],
  },
  staff: {
    customers: ["read", "update"],
    products: ["read"],
    orders: ["read"],
  },
};

export const can = (
  role: Role | undefined,
  resource: Resource,
  action: Permission
) => {
  if (!role) return false;
  const rolePermissions = permissions[role];
  return rolePermissions?.[resource]?.includes(action) ?? false;
};

export const getPermissionsForRole = (role: Role | undefined) => ({
  canReadCustomers: can(role, "customers", "read"),
  canCreateCustomers: can(role, "customers", "create"),
  canUpdateCustomers: can(role, "customers", "update"),
  canDeleteCustomers: can(role, "customers", "delete"),
  canReadProducts: can(role, "products", "read"),
  canCreateProducts: can(role, "products", "create"),
  canUpdateProducts: can(role, "products", "update"),
  canDeleteProducts: can(role, "products", "delete"),
  canReadOrders: can(role, "orders", "read"),
  canCreateOrders: can(role, "orders", "create"),
  canUpdateOrders: can(role, "orders", "update"),
});
