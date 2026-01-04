import { useEffect, useState } from "react";
import { Product } from "../../entities/product/types/type";
import { Button, Input, Modal, Select } from "../../shared/ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id">) => void;
  initialData?: Product | null;
  submitting?: boolean;
};

export const ProductFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting,
}: Props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [status, setStatus] = useState<Product["status"]>("active");
  const [errors, setErrors] = useState<{ name?: string; price?: string; stock?: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price);
      setStock(initialData.stock);
      setStatus(initialData.status);
    } else {
      setName("");
      setPrice("");
      setStock("");
      setStatus("active");
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Nombre requerido";
    if (price === "" || price < 0) newErrors.price = "Precio inválido";
    if (stock === "" || stock < 0) newErrors.stock = "Stock inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      status,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? "Editar producto" : "Nuevo producto"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
        </>
      }
    >
      <div className="products-form">
        <Input
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="Precio"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          error={errors.price}
          required
        />
        <Input
          label="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          error={errors.stock}
          required
        />
        <Select
          label="Estado"
          value={status}
          onChange={(e) => setStatus(e.target.value as Product["status"])}
        >
          <option value="active">Activo</option>
          <option value="archived">Archivado</option>
        </Select>
      </div>
    </Modal>
  );
};
