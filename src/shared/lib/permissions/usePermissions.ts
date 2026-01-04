import { useAppSelector } from "../../../app/store/hooks";
import { getPermissionsForRole, can, Permission, Resource } from "./permissions";

export const usePermissions = () => {
  const role = useAppSelector((state) => state.auth.user?.role);
  const mapped = getPermissionsForRole(role);

  return {
    role,
    ...mapped,
    can: (resource: Resource, action: Permission) => can(role, resource, action),
  };
};
