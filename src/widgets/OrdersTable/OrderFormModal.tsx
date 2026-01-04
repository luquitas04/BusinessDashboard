import { useEffect, useState } from "react";
import { Order } from "../../entities/order/types/type";
import { Button, Input, Modal, Select } from "../../shared/ui";
import { useI18n } from "../../shared/lib/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Order, "id">) => void;
  submitting?: boolean;
};

export const OrderFormModal = ({ open, onClose, onSubmit, submitting }: Props) => {
  const { t } = useI18n();
  const [customerId, setCustomerId] = useState<number | "">("");
  const [total, setTotal] = useState<number | "">("");
  const [status, setStatus] = useState<Order["status"]>("pending");
  const [errors, setErrors] = useState<{ customerId?: string; total?: string }>({});

  useEffect(() => {
    if (!open) {
      setCustomerId("");
      setTotal("");
      setStatus("pending");
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (customerId === "" || Number(customerId) <= 0) newErrors.customerId = t("orders.form.customerError");
    if (total === "" || Number(total) <= 0) newErrors.total = t("orders.form.totalError");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      customerId: Number(customerId),
      total: Number(total),
      status,
      createdAt: new Date().toISOString() as unknown as Date,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("orders.form.title")}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {t("orders.form.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("common.creating") : t("orders.form.create")}
          </Button>
        </>
      }
    >
      <div className="orders-form">
        <Input
          label={t("orders.form.customer")}
          type="number"
          value={customerId}
          onChange={(e) => setCustomerId(Number(e.target.value))}
          error={errors.customerId}
          required
        />
        <Input
          label={t("orders.form.total")}
          type="number"
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
          error={errors.total}
          required
        />
        <Select
          label={t("orders.form.status")}
          value={status}
          onChange={(e) => setStatus(e.target.value as Order["status"])}
        >
          <option value="pending">{t("orders.form.pending")}</option>
          <option value="paid">{t("orders.form.paid")}</option>
          <option value="cancelled">{t("orders.form.cancelled")}</option>
        </Select>
      </div>
    </Modal>
  );
};
