import { CustomersTable } from "../../../widgets/CustomersTable/CustomersTable";
import { useI18n } from "../../../shared/lib/i18n";

export const CustomersPage = () => {
  const { t } = useI18n();
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">{t("customers.title")}</h2>
          <p className="page__subtitle">{t("customers.subtitle")}</p>
        </div>
      </div>
      <CustomersTable />
    </div>
  );
};
