import { Button } from "../../shared/ui";
import { useI18n } from "../../shared/lib/i18n";
import "./CustomersTable.scss";

type Props = {
  page: number;
  onPrev: () => void;
  onNext: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
};

export const CustomersPagination = ({
  page,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: Props) => {
  const { t } = useI18n();
  return (
    <div className="customers-pagination">
      <span>
        {t("common.pageLabel", { page })}
      </span>
      <div className="customers-pagination__actions">
        <Button variant="secondary" size="sm" onClick={onPrev} disabled={disablePrev}>
          {t("common.prev")}
        </Button>
        <Button variant="secondary" size="sm" onClick={onNext} disabled={disableNext}>
          {t("common.next")}
        </Button>
      </div>
    </div>
  );
};
