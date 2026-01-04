import { ReactNode } from "react";

type MessageToasterProps = {
  message: ReactNode;
  onClose?: () => void;
};

export function MessageToaster({ message, onClose }: MessageToasterProps) {
  return (
    <div
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        padding: "0.75rem 1rem",
        backgroundColor: "#ecfdf3",
        color: "#166534",
        border: "1px solid #bbf7d0",
        borderRadius: "8px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
        maxWidth: "320px",
      }}
      role="status"
      aria-live="polite"
    >
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#166534",
            cursor: "pointer",
            fontWeight: 600,
          }}
          aria-label="Cerrar mensaje"
        >
          ×
        </button>
      )}
    </div>
  );
}
