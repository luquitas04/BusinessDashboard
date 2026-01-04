import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { authSlice } from "../../app/store/slices/authSlice";
import { useI18n } from "../../shared/lib/i18n";
import "./Sidebar.scss";

const links = [
  { to: "/customers", labelKey: "nav.customers" },
  { to: "/orders", labelKey: "nav.orders" },
  { to: "/products", labelKey: "nav.products", onlyAdmin: true },
];

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { logOut } = authSlice.actions;
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;
  const { t } = useI18n();

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
          .filter((link) => (link.onlyAdmin ? role === "admin" : true))
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
      <p className="sidebar__note">{t("nav.mockNotice")}</p>
      <button className="sidebar__logout" onClick={handleLogout}>
        {t("nav.logout")}
      </button>
    </aside>
  );
};
