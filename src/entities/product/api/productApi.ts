import { baseApi } from "../../../shared/api/baseApi";
import { Product } from "../types/type";

type GetProductsParams = {
  q?: string;
  status?: Product["status"];
  page?: number;
  limit?: number;
  sort?: keyof Product;
  order?: "asc" | "desc";
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], GetProductsParams | void>({
      query: (params) => {
        const { q, status, page, limit, sort, order } = params || {};
        const searchParams: Record<string, string | number> = {};

        if (q) searchParams.q = q;
        if (status) searchParams.status = status;
        if (page) searchParams._page = page;
        if (limit) searchParams._limit = limit;
        if (sort) searchParams._sort = sort;
        if (order) searchParams._order = order;

        return {
          url: "/products",
          params: searchParams,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Products" as const, id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    createProduct: builder.mutation<Product, Omit<Product, "id">>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: number; data: Partial<Omit<Product, "id">> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
