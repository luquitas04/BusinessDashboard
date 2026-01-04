import { ReactNode, useEffect } from "react";
import "./Modal.scss";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export const Modal = ({ open, title, onClose, children, footer }: Props) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (open) {
      window.addEventListener("keydown", handler);
    }
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ui-modal__backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="ui-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ui-modal__header">
          {title && <h2 className="ui-modal__title">{title}</h2>}
          <button className="ui-modal__close" onClick={onClose} aria-label="Cerrar modal">
            ×
          </button>
        </div>
        <div className="ui-modal__body">{children}</div>
        {footer && <div className="ui-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};
