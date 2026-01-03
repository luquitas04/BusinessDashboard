import { baseApi } from "../../../shared/api/baseApi";
import { Customers } from "../types/type";

type GetCustomersParams = {
  q?: string;
  status?: Customers["status"];
  page?: number;
  limit?: number;
  sort?: keyof Customers;
  order?: "asc" | "desc";
};

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customers[], GetCustomersParams | void>({
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
          url: "/customers",
          params: searchParams,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Customers" as const, id })),
              { type: "Customers", id: "LIST" },
            ]
          : [{ type: "Customers", id: "LIST" }],
    }),
    createCustomer: builder.mutation<Customers, Omit<Customers, "id">>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Customers", id: "LIST" }],
    }),
    updateCustomer: builder.mutation<
      Customers,
      { id: number; data: Partial<Omit<Customers, "id">> }
    >({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Customers", id },
        { type: "Customers", id: "LIST" },
      ],
    }),
    deleteCustomer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Customers", id },
        { type: "Customers", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
