import { baseApi } from "../../../shared/api/baseApi";
import { Order } from "../types/type";

type GetOrdersParams = {
  q?: string;
  status?: Order["status"];
  customerId?: number;
  page?: number;
  limit?: number;
  sort?: keyof Order;
  order?: "asc" | "desc";
};

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], GetOrdersParams | void>({
      query: (params) => {
        const { q, status, customerId, page, limit, sort, order } = params || {};
        const searchParams: Record<string, string | number> = {};

        if (q) searchParams.q = q;
        if (status) searchParams.status = status;
        if (customerId) searchParams.customerId = customerId;
        if (page) searchParams._page = page;
        if (limit) searchParams._limit = limit;
        if (sort) searchParams._sort = sort;
        if (order) searchParams._order = order;

        return {
          url: "/orders",
          params: searchParams,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Orders" as const, id })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    updateOrderStatus: builder.mutation<
      Order,
      { id: number; status: Order["status"] }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = orderApi;
