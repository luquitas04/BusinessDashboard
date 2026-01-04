import { ReactNode, useEffect, useState } from "react";
import "./ErrorToaster.scss";

type ErrorToasterProps = {
  message: ReactNode;
  onClose?: () => void;
};

export function ErrorToaster({ message, onClose }: ErrorToasterProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    setVisible(true);
  }, [message]);

  if (!visible) return null;

  return (
    <div className="error-toaster" role="alert" aria-live="assertive">
      <span className="error-toaster__content">{message}</span>
      {onClose && (
        <button className="error-toaster__close" onClick={onClose} aria-label="Cerrar alerta">
          ×
        </button>
      )}
    </div>
  );
}
