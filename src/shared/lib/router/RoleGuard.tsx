import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../app/store/hooks";
import { can, Permission, Resource } from "../permissions/permissions";

type Props = {
  resource: Resource;
  action?: Permission;
};

export const RoleGuard = ({ resource, action = "read" }: Props) => {
  const role = useAppSelector((state) => state.auth.user?.role);

  if (!can(role, resource, action)) {
    return <Navigate to="/customers" replace />;
  }

  return <Outlet />;
};
