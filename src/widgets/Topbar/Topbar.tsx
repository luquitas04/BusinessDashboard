import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { authSlice } from "../../app/store/slices/authSlice";
import { Button } from "../../shared/ui";
import { useI18n } from "../../shared/lib/i18n";
import "./Topbar.scss";

export const Topbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { logOut } = authSlice.actions;
  const { locale, toggleLocale, t } = useI18n();

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <h1 className="topbar__title">{t("app.title")}</h1>
      <div className="topbar__user">
        <Button variant="secondary" size="sm" onClick={toggleLocale}>
          {locale === "en" ? "ES" : "EN"}
        </Button>
        <div className="topbar__user-meta">
          <span className="topbar__user-name">{user?.name ?? t("login.admin")}</span>
          {user?.role && <span className="topbar__user-role">{user.role}</span>}
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          {t("nav.logout")}
        </Button>
      </div>
    </header>
  );
};
