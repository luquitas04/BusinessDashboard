import { ReactNode } from "react";

type ErrorToasterProps = {
  message: ReactNode;
  onClose?: () => void;
};

export function ErrorToaster({ message, onClose }: ErrorToasterProps) {
  return (
    <div
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        padding: "0.75rem 1rem",
        backgroundColor: "#fef2f2",
        color: "#991b1b",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
        maxWidth: "320px",
      }}
      role="alert"
      aria-live="assertive"
    >
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#991b1b",
            cursor: "pointer",
            fontWeight: 600,
          }}
          aria-label="Cerrar alerta"
        >
          ×
        </button>
      )}
    </div>
  );
}
