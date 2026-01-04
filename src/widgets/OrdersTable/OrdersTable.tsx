import { useMemo, useState } from "react";
import {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../entities/order/api/orderApi";
import { Order } from "../../entities/order/types/type";
import {
  Badge,
  Button,
  ErrorToaster,
  Input,
  MessageToaster,
  Select,
} from "../../shared/ui";
import { useDebouncedValue } from "../../shared/lib/useDebouncedValue";
import { useI18n } from "../../shared/lib/i18n";
import { OrderFormModal } from "./OrderFormModal";
import "./OrdersTable.scss";

const formatDate = (value: Order["createdAt"]) =>
  new Date(value).toLocaleDateString();

export const OrdersTable = () => {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState<Order["status"] | "all">("all");
  const [sort, setSort] = useState<keyof Order>("createdAt");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const params = useMemo(
    () => ({
      q: debouncedSearch || undefined,
      status: status !== "all" ? status : undefined,
      page,
      limit,
      sort,
      order: orderDir,
    }),
    [debouncedSearch, status, page, limit, sort, orderDir]
  );

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetOrdersQuery(params);

  const [updateStatus, { isLoading: updating }] =
    useUpdateOrderStatusMutation();
  const [createOrder, { isLoading: creating }] = useCreateOrderMutation();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (id: number, newStatus: Order["status"]) => {
    setUpdatingId(id);
    setActionError(null);
    setActionSuccess(null);
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      setActionSuccess(t("orders.success.update"));
    } catch (error) {
      console.error(error);
      setActionError(t("orders.error.update", { error: String(error) }));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreate = async (payload: Omit<Order, "id">) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await createOrder(payload).unwrap();
      setActionSuccess(t("orders.success.create"));
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setActionError(t("orders.error.create", { error: String(error) }));
    }
  };

  const disableNext = data.length < limit;

  return (
    <div className="orders-card">
      <div className="orders-toolbar">
        <div className="orders-toolbar__filters">
          <Input
            label={t("orders.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("orders.search.placeholder")}
          />
          <Select
            label={t("orders.status")}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as Order["status"] | "all");
              setPage(1);
            }}
          >
            <option value="all">{t("common.all")}</option>
            <option value="pending">{t("orders.form.pending")}</option>
            <option value="paid">{t("orders.form.paid")}</option>
            <option value="cancelled">{t("orders.form.cancelled")}</option>
          </Select>
          <Select
            label={t("orders.sort")}
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as keyof Order);
              setPage(1);
            }}
          >
            <option value="createdAt">{t("orders.createdAt")}</option>
            <option value="total">{t("orders.total")}</option>
            <option value="customerId">{t("orders.customer")}</option>
          </Select>
          <Select
            label={t("orders.order")}
            value={orderDir}
            onChange={(e) => {
              setOrderDir(e.target.value as "asc" | "desc");
              setPage(1);
            }}
          >
            <option value="asc">{t("orders.order.asc")}</option>
            <option value="desc">{t("orders.order.desc")}</option>
          </Select>
          <Select
            label={t("orders.pageSize")}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Select>
        </div>
        <div className="orders-toolbar__actions">
          <Button onClick={() => setShowForm(true)}>{t("orders.new")}</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="orders-table orders-table--loading">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="orders-table__skeleton" />
          ))}
        </div>
      ) : isError ? (
        <div className="orders-state">
          <p>{t("orders.error")}</p>
          <Button variant="secondary" onClick={() => refetch()}>
            {t("common.retry")}
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="orders-state">
          <p>{t("orders.empty")}</p>
        </div>
      ) : (
        <>
          <div className="orders-table">
            <div className="orders-table__head">
              <span>{t("orders.id")}</span>
              <span>{t("orders.customer")}</span>
              <span>{t("orders.total")}</span>
              <span>{t("orders.status")}</span>
              <span>{t("orders.createdAt")}</span>
              <span>{t("common.actions")}</span>
            </div>
            <div className="orders-table__body">
              {data.map((order) => (
                <div className="orders-table__row" key={order.id}>
                  <span>#{order.id}</span>
                  <span>{order.customerId}</span>
                  <span>${order.total}</span>
                  <span>
                    <Badge
                      variant={
                        order.status === "paid"
                          ? "success"
                          : order.status === "pending"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {order.status === "paid"
                        ? t("orders.form.paid")
                        : order.status === "pending"
                          ? t("orders.form.pending")
                          : t("orders.form.cancelled")}
                    </Badge>
                  </span>
                  <span>{formatDate(order.createdAt)}</span>
                  <span className="orders-table__actions">
                    {order.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStatusChange(order.id, "paid")}
                          disabled={updating && updatingId === order.id}
                        >
                          {updating && updatingId === order.id
                            ? t("common.saving")
                            : t("orders.markPaid")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleStatusChange(order.id, "cancelled")
                          }
                          disabled={updating && updatingId === order.id}
                        >
                          {t("orders.cancel")}
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" disabled>
                        {t("orders.noActions")}
                      </Button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="orders-pagination">
            <span>{t("common.pageLabel", { page })}</span>
            <div className="orders-pagination__actions">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
              >
                {t("common.prev")}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={disableNext || isFetching}
              >
                {t("common.next")}
              </Button>
            </div>
          </div>
        </>
      )}
      {actionError && (
        <ErrorToaster
          message={actionError}
          onClose={() => setActionError(null)}
        />
      )}
      {actionSuccess && (
        <MessageToaster
          message={actionSuccess}
          onClose={() => setActionSuccess(null)}
        />
      )}
      <OrderFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        submitting={creating}
      />
    </div>
  );
};
