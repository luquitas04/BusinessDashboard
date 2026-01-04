import { OrdersTable } from "../../../widgets/OrdersTable/OrdersTable";
import { useI18n } from "../../../shared/lib/i18n";

export const OrdersPage = () => {
  const { t } = useI18n();
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">{t("orders.title")}</h2>
          <p className="page__subtitle">{t("orders.subtitle")}</p>
        </div>
      </div>
      <OrdersTable />
    </div>
  );
};
