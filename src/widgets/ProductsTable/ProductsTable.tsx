import { useMemo, useState } from "react";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../entities/product/api/productApi";
import { Product } from "../../entities/product/types/type";
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
import { ProductFormModal } from "./ProductFormModal";
import "./ProductsTable.scss";

export const ProductsTable = () => {
  const { t } = useI18n();
  const { can } = usePermissions();
  const canCreateProducts = can("products", "create");
  const canUpdateProducts = can("products", "update");
  const canDeleteProducts = can("products", "delete");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState<Product["status"] | "all">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      q: debouncedSearch || undefined,
      status: status !== "all" ? status : undefined,
      page,
      limit,
      sort: "name" as keyof Product,
      order: "asc" as const,
    }),
    [debouncedSearch, status, page, limit]
  );

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetProductsQuery(params);

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const handleSubmit = async (payload: Omit<Product, "id">) => {
    try {
      setActionError(null);
      setActionSuccess(null);
      if (editing) {
        if (!canUpdateProducts) return;
        await updateProduct({ id: editing.id, data: payload }).unwrap();
        setActionSuccess(t("products.success.update"));
      } else {
        if (!canCreateProducts) return;
        await createProduct(payload).unwrap();
        setActionSuccess(t("products.success.create"));
      }
      setShowForm(false);
      setEditing(null);
    } catch (error) {
      console.error(error);
      setActionError(t("products.error.save", { error: String(error) }));
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct || !canDeleteProducts) return;
    try {
      setActionError(null);
      setActionSuccess(null);
      await deleteProduct(deletingProduct.id).unwrap();
      setShowDelete(false);
      setDeletingProduct(null);
      setActionSuccess(t("products.success.delete"));
    } catch (error) {
      console.error(error);
      setActionError(t("products.error.delete", { error: String(error) }));
    }
  };

  const disableNext = data.length < limit;
  const showSkeleton = isLoading || (isFetching && data.length === 0);

  return (
    <div className="products-card">
      <div className="products-toolbar">
        <div className="products-toolbar__filters">
          <label className="products-toolbar__search">
            <span>{t("products.search")}</span>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("products.search.placeholder")}
            />
          </label>
          <label className="products-toolbar__search">
            <span>{t("products.status")}</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as Product["status"] | "all");
                setPage(1);
              }}
            >
              <option value="all">{t("common.all")}</option>
              <option value="active">{t("products.form.active")}</option>
              <option value="archived">{t("products.form.archived")}</option>
            </select>
          </label>
          <label className="products-toolbar__search">
            <span>{t("products.pageSize")}</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
        {canCreateProducts && (
          <Button onClick={() => setShowForm(true)}>{t("products.new")}</Button>
        )}
      </div>

      {showSkeleton ? (
        <div className="products-table products-table--loading">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="products-table__skeleton" />
          ))}
        </div>
      ) : isError ? (
        <div className="products-state">
          <p>{t("products.error")}</p>
          <Button variant="secondary" onClick={() => refetch()}>
            {t("products.retry")}
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="products-state">
          <p className="products-state__title">{t("products.empty")}</p>
          <p className="products-state__description">
            {t("products.empty.desc")}
          </p>
          {canCreateProducts && (
            <Button onClick={() => setShowForm(true)}>
              {t("products.new")}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="products-table">
            <div className="products-table__head">
              <span>{t("products.name")}</span>
              <span>{t("products.price")}</span>
              <span>{t("products.stock")}</span>
              <span>{t("products.state")}</span>
              <span>{t("products.actions")}</span>
            </div>
            <div className="products-table__body">
              {data.map((product) => (
                <div className="products-table__row" key={product.id}>
                  <span>{product.name}</span>
                  <span>${product.price}</span>
                  <span>{product.stock}</span>
                  <span>
                    <Badge
                      variant={
                        product.status === "active" ? "success" : "warning"
                      }
                    >
                      {product.status === "active"
                        ? t("products.form.active")
                        : t("products.form.archived")}
                    </Badge>
                  </span>
                  <span className="products-table__actions">
                    {canUpdateProducts && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(product);
                          setShowForm(true);
                        }}
                      >
                        {t("products.edit")}
                      </Button>
                    )}
                    {canDeleteProducts && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingProduct(product);
                          setShowDelete(true);
                        }}
                      >
                        {t("products.delete")}
                      </Button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="products-pagination">
            <span>{t("common.pageLabel", { page })}</span>
            <div className="products-pagination__actions">
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

      {((canCreateProducts && !editing) || (canUpdateProducts && !!editing)) && (
        <ProductFormModal
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
          initialData={editing}
          submitting={creating || updating}
        />
      )}

      {canDeleteProducts && (
        <ConfirmDialog
          open={showDelete}
          onClose={() => {
            setShowDelete(false);
            setDeletingProduct(null);
          }}
          onConfirm={handleDelete}
          loading={deleting}
          title={
            deletingProduct
              ? t("products.delete.confirmName", { name: deletingProduct.name })
              : t("products.delete")
          }
          description={t("common.deleteDesc")}
          confirmText={t("products.delete")}
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
