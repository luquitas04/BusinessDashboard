import { ReactNode, useEffect, useState } from "react";
import "./MessageToaster.scss";

type MessageToasterProps = {
  message: ReactNode;
  onClose?: () => void;
};

export function MessageToaster({ message, onClose }: MessageToasterProps) {
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
    <div className="message-toaster" role="status" aria-live="polite">
      <span className="message-toaster__content">{message}</span>
      {onClose && (
        <button className="message-toaster__close" onClick={onClose} aria-label="Cerrar mensaje">
          ×
        </button>
      )}
    </div>
  );
}
