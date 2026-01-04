import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../app/store/hooks";
import { authSlice } from "../../../../app/store/slices/authSlice";
import { useLoginByEmailMutation } from "../../../../entities/users/api/authApi";
import {
  Button,
  ErrorToaster,
  Input,
  MessageToaster,
} from "../../../../shared/ui";
import { useI18n } from "../../../../shared/lib/i18n";
import "./LoginForm.scss";

const { setUser, logOut } = authSlice.actions;

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [loginByEmail, { isLoading, error }] = useLoginByEmailMutation();
  const [email, setEmail] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage(t("login.error.required"));
      return;
    }
    setInfoMessage("");
    setErrorMessage("");
    try {
      const user = await loginByEmail({ email }).unwrap();
      if (user) {
        dispatch(setUser(user));
        setInfoMessage(t("login.success"));
        navigate("/customers", { replace: true });
      } else {
        dispatch(logOut());
        setErrorMessage(t("login.error.notFound"));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(t("login.error.failed", { error: String(error) }));
    }
  };

  return (
    <div className="login-card">
      <h2 className="login-card__title">{t("login.title")}</h2>
      <p className="login-card__subtitle">
        {t("login.subtitle")}
        <br />
        {t("login.admin")}: <strong>admin@test.com</strong> <br/>
        {t("login.staff")}: <strong>staff@test.com</strong>
      </p>
      <form
        className="login-card__form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@test.com"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t("common.saving") : t("login.button")}
        </Button>
        {error && (
          <span className="login-card__error">
            {t("login.error.service")}
          </span>
        )}
      </form>
      {errorMessage && (
        <ErrorToaster
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
      {infoMessage && (
        <MessageToaster
          message={infoMessage}
          onClose={() => setInfoMessage("")}
        />
      )}
    </div>
  );
};
