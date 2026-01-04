import { useState } from "react";
import { useAppDispatch } from "../../../app/store/hooks";
import { authSlice } from "../../../app/store/slices/authSlice";
import { useLoginByEmailMutation } from "../../../entities/users/api/authApi";
import { ErrorToaster, MessageToaster } from "../../../shared/ui/toaster";

const { setUser, logOut } = authSlice.actions;

function LoginForm() {
  const dispatch = useAppDispatch();
  const [loginByEmail, { isLoading, error }] = useLoginByEmailMutation();
  const [email, setEmail] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async () => {
    setInfoMessage("");
    setErrorMessage("");
    try {
      const user = await loginByEmail({ email }).unwrap();
      if (user) {
        dispatch(setUser(user));
        setInfoMessage("Inicio de sesión exitoso");
      } else {
        dispatch(logOut());
        setErrorMessage("Email no encontrado");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo iniciar sesión");
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button disabled={isLoading}>Entrar</button>
        {error && <p>Error al contactar el servicio</p>}
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
    </>
  );
}

export default LoginForm;
