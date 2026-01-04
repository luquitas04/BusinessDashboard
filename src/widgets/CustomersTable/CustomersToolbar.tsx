import { ChangeEvent } from "react";
import { Button, Input, Select } from "../../shared/ui";
import { useI18n } from "../../shared/lib/i18n";
import "./CustomersTable.scss";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sort: string;
  order: "asc" | "desc";
  onSortChange: (value: string) => void;
  onOrderChange: (value: "asc" | "desc") => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onCreate: () => void;
  canCreate?: boolean;
};

export const CustomersToolbar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  order,
  onSortChange,
  onOrderChange,
  pageSize,
  onPageSizeChange,
  onCreate,
  canCreate = true,
}: Props) => {
  const { t } = useI18n();
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="customers-toolbar">
      <div className="customers-toolbar__filters">
        <Input
          label={t("customers.search")}
          placeholder={t("customers.search.placeholder")}
          value={search}
          onChange={handleSearch}
        />
        <Select
          label={t("customers.status")}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">{t("common.all") ?? "All"}</option>
          <option value="active">{t("customers.form.active")}</option>
          <option value="inactive">{t("customers.form.inactive")}</option>
        </Select>
        <Select
          label={t("customers.sort")}
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="name">{t("customers.name")}</option>
          <option value="email">{t("customers.email")}</option>
          <option value="createdAt">{t("customers.createdAt")}</option>
        </Select>
        <Select
          label={t("customers.order")}
          value={order}
          onChange={(e) => onOrderChange(e.target.value as "asc" | "desc")}
        >
          <option value="asc">{t("customers.order.asc")}</option>
          <option value="desc">{t("customers.order.desc")}</option>
        </Select>
        <Select
          label={t("customers.pageSize")}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Select>
      </div>
      {canCreate && <Button onClick={onCreate}>{t("customers.new")}</Button>}
    </div>
  );
};
