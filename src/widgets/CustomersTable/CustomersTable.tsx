import { useEffect, useMemo, useState } from "react";
import {
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} from "../../entities/customer/api/customerApi";
import { Customers } from "../../entities/customer/types/type";
import {
  Badge,
  Button,
  ConfirmDialog,
  ErrorToaster,
  MessageToaster,
} from "../../shared/ui";
import { useDebouncedValue } from "../../shared/lib/useDebouncedValue";
import { useI18n } from "../../shared/lib/i18n";
import { usePermissions } from "../../shared/lib/permissions/usePermissions";
import { CustomersToolbar } from "./CustomersToolbar";
import { CustomersPagination } from "./CustomersPagination";
import { CustomerFormModal } from "./CustomerFormModal";
import "./CustomersTable.scss";

const formatDate = (value: Customers["createdAt"]) =>
  new Date(value).toLocaleDateString();

export const CustomersTable = () => {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState<Customers["status"] | "all">("all");
  const [sort, setSort] = useState<keyof Customers>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customers | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customers | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const { can } = usePermissions();
  const canCreateCustomers = can("customers", "create");
  const canUpdateCustomers = can("customers", "update");
  const canDeleteCustomers = can("customers", "delete");

  const params = useMemo(
    () => ({
      q: debouncedSearch || undefined,
      status: status !== "all" ? status : undefined,
      sort,
      order,
      page,
      limit,
    }),
    [debouncedSearch, status, sort, order, page, limit]
  );

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetCustomersQuery(params);

  const [createCustomer, { isLoading: creating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: updating }] = useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: deleting }] =
    useDeleteCustomerMutation();

  const handleSubmitForm = async (payload: Omit<Customers, "id">) => {
    try {
      setActionError(null);
      setActionSuccess(null);
      if (editing) {
        if (!canUpdateCustomers) return;
        await updateCustomer({ id: editing.id, data: payload }).unwrap();
        setActionSuccess(t("customers.success.update"));
      } else {
        if (!canCreateCustomers) return;
        await createCustomer(payload).unwrap();
        setActionSuccess(t("customers.success.create"));
      }
      setShowForm(false);
      setEditing(null);
    } catch (error) {
      console.error(error);
      setActionError(t("customers.error.save", { error: String(error) }));
    }
  };

  const handleDelete = async () => {
    if (!deletingCustomer || !canDeleteCustomers) return;
    const id = deletingCustomer.id;
    try {
      setActionError(null);
      setActionSuccess(null);
      await deleteCustomer(id).unwrap();
      setActionSuccess(t("customers.success.delete"));
      setShowDelete(false);
      setDeletingCustomer(null);
    } catch (error) {
      console.error(error);
      setActionError(t("customers.error.delete", { error: String(error) }));
    }
  };

  useEffect(() => {
    if (isError) {
      setActionError(t("customers.error.load"));
    }
  }, [isError, t]);

  const openEdit = (customer: Customers) => {
    if (!canUpdateCustomers) return;
    setEditing(customer);
    setShowForm(true);
  };

  const openDelete = (customer: Customers) => {
    if (!canDeleteCustomers) return;
    setDeletingCustomer(customer);
    setShowDelete(true);
  };

  const disableNext = data.length < limit;
  const showSkeleton = isLoading || (isFetching && data.length === 0);

  return (
    <div className="customers-card">
      <CustomersToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={(v) => setStatus(v as Customers["status"] | "all")}
        sort={sort}
        order={order}
        onSortChange={(v) => setSort(v as keyof Customers)}
        onOrderChange={setOrder}
        pageSize={limit}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        onCreate={() => {
          if (!canCreateCustomers) return;
          setShowForm(true);
        }}
        canCreate={canCreateCustomers}
      />

      {showSkeleton ? (
        <div className="customers-table customers-table--loading">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="customers-table__skeleton" />
          ))}
        </div>
      ) : isError ? (
        <div className="customers-state">
          <p>{t("customers.error")}</p>
          <Button variant="secondary" onClick={() => refetch()}>
            {t("common.retry")}
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="customers-state">
          <p className="customers-state__title">{t("customers.empty")}</p>
          <p className="customers-state__description">
            {t("customers.empty.desc")}
          </p>
          {canCreateCustomers && (
            <Button onClick={() => setShowForm(true)}>
              {t("customers.new")}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="customers-table">
            <div className="customers-table__head">
              <span>{t("customers.name")}</span>
              <span>{t("customers.email")}</span>
              <span>{t("customers.state")}</span>
              <span>{t("customers.createdAt")}</span>
              <span>{t("common.actions")}</span>
            </div>
            <div className="customers-table__body">
              {data.map((customer) => (
                <div className="customers-table__row" key={customer.id}>
                  <span>{customer.name}</span>
                  <span>{customer.email}</span>
                  <span>
                    <Badge
                      variant={
                        customer.status === "active" ? "success" : "warning"
                      }
                    >
                      {customer.status === "active"
                        ? t("customers.form.active")
                        : t("customers.form.inactive")}
                    </Badge>
                  </span>
                  <span>{formatDate(customer.createdAt)}</span>
                  <span className="customers-table__actions">
                    {canUpdateCustomers && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(customer)}
                      >
                        {t("customers.edit")}
                      </Button>
                    )}
                    {canDeleteCustomers && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDelete(customer)}
                      >
                        {t("customers.delete")}
                      </Button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <CustomersPagination
            page={page}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
            disablePrev={page === 1 || isFetching}
            disableNext={disableNext || isFetching}
          />
        </>
      )}

      {((canCreateCustomers && !editing) || (canUpdateCustomers && !!editing)) && (
        <CustomerFormModal
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          initialData={editing}
          onSubmit={handleSubmitForm}
          submitting={creating || updating}
        />
      )}

      {canDeleteCustomers && (
        <ConfirmDialog
          open={showDelete}
          onClose={() => {
            setShowDelete(false);
            setDeletingCustomer(null);
          }}
          onConfirm={handleDelete}
          loading={deleting}
          title={
            deletingCustomer
              ? t("customers.delete.confirmName", {
                  name: deletingCustomer.name,
                })
              : t("customers.delete.confirm")
          }
          description={t("customers.delete.desc")}
          confirmText={t("customers.delete")}
        />
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
    </div>
  );
};
