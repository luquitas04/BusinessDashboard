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
import { ProductFormModal } from "./ProductFormModal";
import "./ProductsTable.scss";

export const ProductsTable = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState<Product["status"] | "all">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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
        await updateProduct({ id: editing.id, data: payload }).unwrap();
        setActionSuccess("Producto actualizado");
      } else {
        await createProduct(payload).unwrap();
        setActionSuccess("Producto creado");
      }
      setShowForm(false);
      setEditing(null);
    } catch (error) {
      console.error(error);
      setActionError(`No se pudo guardar el producto. Detalle: ${error}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setActionError(null);
      setActionSuccess(null);
      await deleteProduct(deletingId).unwrap();
      setShowDelete(false);
      setDeletingId(null);
      setActionSuccess("Producto eliminado");
    } catch (error) {
      console.error(error);
      setActionError(`No se pudo eliminar el producto. Detalle: ${error}`);
    }
  };

  const disableNext = data.length < limit;

  return (
    <div className="products-card">
      <div className="products-toolbar">
        <div className="products-toolbar__filters">
          <label className="products-toolbar__search">
            <span>Búsqueda</span>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar producto"
            />
          </label>
          <label className="products-toolbar__search">
            <span>Estado</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as Product["status"] | "all");
                setPage(1);
              }}
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="archived">Archivados</option>
            </select>
          </label>
          <label className="products-toolbar__search">
            <span>Por página</span>
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
        <Button onClick={() => setShowForm(true)}>Nuevo producto</Button>
      </div>

      {isLoading ? (
        <div className="products-table products-table--loading">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="products-table__skeleton" />
          ))}
        </div>
      ) : isError ? (
        <div className="products-state">
          <p>Error al cargar productos.</p>
          <Button variant="secondary" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="products-state">
          <p>No hay productos</p>
          <Button onClick={() => setShowForm(true)}>Crear producto</Button>
        </div>
      ) : (
        <>
          <div className="products-table">
            <div className="products-table__head">
              <span>Nombre</span>
              <span>Precio</span>
              <span>Stock</span>
              <span>Estado</span>
              <span>Acciones</span>
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
                      {product.status}
                    </Badge>
                  </span>
                  <span className="products-table__actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditing(product);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeletingId(product.id);
                        setShowDelete(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="products-pagination">
            <span>Página {page}</span>
            <div className="products-pagination__actions">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={disableNext || isFetching}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

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

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar producto"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
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
