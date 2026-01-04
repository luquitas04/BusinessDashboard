import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../app/store/hooks";

type Props = {
  allowAdminOnly?: boolean;
};

export const RoleGuard = ({ allowAdminOnly }: Props) => {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  if (allowAdminOnly && !isAdmin) {
    return <Navigate to="/customers" replace />;
  }

  return <Outlet />;
};
