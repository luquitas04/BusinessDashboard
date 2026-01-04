import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../../features/auth/ui";
import { useAppSelector } from "../../../app/store/hooks";
import "./LoginPage.scss";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/customers", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-page">
      <div className="login-page__card">
        <LoginForm />
      </div>
    </div>
  );
};
