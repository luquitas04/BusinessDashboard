import { ProductsTable } from "../../../widgets/ProductsTable/ProductsTable";
import { useI18n } from "../../../shared/lib/i18n";

export const ProductsPage = () => {
  const { t } = useI18n();
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">{t("products.title")}</h2>
          <p className="page__subtitle">{t("products.subtitle")}</p>
        </div>
      </div>
      <ProductsTable />
    </div>
  );
};
