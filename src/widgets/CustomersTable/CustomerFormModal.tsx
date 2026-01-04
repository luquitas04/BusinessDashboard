import { useEffect, useState } from "react";
import { Customers } from "../../entities/customer/types/type";
import { Button, Input, Modal, Select } from "../../shared/ui";
import { useI18n } from "../../shared/lib/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Customers, "id">) => void;
  initialData?: Customers | null;
  submitting?: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CustomerFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting,
}: Props) => {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Customers["status"]>("active");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setStatus(initialData.status);
    } else {
      setName("");
      setEmail("");
      setStatus("active");
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = t("customers.form.nameError");
    if (!email.trim()) newErrors.email = t("customers.form.emailError");
    else if (!emailRegex.test(email)) newErrors.email = t("customers.form.emailInvalid");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const createdAtValue =
      initialData?.createdAt ?? new Date().toISOString();
    const payload: Omit<Customers, "id"> = {
      name: name.trim(),
      email: email.trim(),
      status,
      createdAt: createdAtValue as unknown as Date,
    };
    onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? t("customers.form.title.edit") : t("customers.form.title.new")}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {t("customers.form.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("common.saving") : t("customers.form.save")}
          </Button>
        </>
      }
    >
      <div className="customers-form">
        <Input
          label={t("customers.form.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />
        <Input
          label={t("customers.form.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        <Select
          label={t("customers.form.status")}
          value={status}
          onChange={(e) => setStatus(e.target.value as Customers["status"])}
        >
          <option value="active">{t("customers.form.active")}</option>
          <option value="inactive">{t("customers.form.inactive")}</option>
        </Select>
      </div>
    </Modal>
  );
};
