import { ReactNode } from "react";
import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: ReactNode;
  confirmText?: string;
};

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Confirmar",
  description = "¿Seguro que deseas continuar?",
  confirmText = "Confirmar",
}: Props) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Procesando..." : confirmText}
          </Button>
        </>
      }
    >
      <div>{description}</div>
    </Modal>
  );
};
