import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { authSlice } from "../../app/store/slices/authSlice";
import { useI18n } from "../../shared/lib/i18n";
import { usePermissions } from "../../shared/lib/permissions/usePermissions";
import "./Sidebar.scss";

const links = [
  { to: "/customers", labelKey: "nav.customers", resource: "customers" as const },
  { to: "/orders", labelKey: "nav.orders", resource: "orders" as const },
  { to: "/products", labelKey: "nav.products", resource: "products" as const },
];

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { logOut } = authSlice.actions;
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;
  const { t } = useI18n();
  const { can } = usePermissions();
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__brand">{t("app.title")}</span>
        {role && <span className="sidebar__role">{role}</span>}
      </div>
      <nav className="sidebar__nav">
        {links
          .filter((link) => can(link.resource, "read"))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
      </nav>
      {isLocalhost && <p className="sidebar__note">{t("nav.mockNotice")}</p>}
      <button className="sidebar__logout" onClick={handleLogout}>
        {t("nav.logout")}
      </button>
    </aside>
  );
};
