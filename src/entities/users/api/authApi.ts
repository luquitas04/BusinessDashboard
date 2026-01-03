import { baseApi } from "../../../shared/api/baseApi";
import { User } from "../types/type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginByEmail: builder.mutation<User | null, { email: string }>({
      query: ({ email }) => ({
        url: "/users",
        method: "GET",
        params: { email },
      }),
      transformResponse: (response: User[]) => response[0] ?? null,
    }),
  }),
});

export const { useLoginByEmailMutation } = authApi;
