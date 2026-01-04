import { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { render, RenderOptions } from "@testing-library/react";
import { baseApi } from "../api/baseApi";
import { authSlice } from "../../app/store/slices/authSlice";
import { I18nProvider } from "../lib/i18n";

const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authSlice.reducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
    preloadedState,
  });

type CustomOptions = {
  preloadedState?: any;
  route?: string;
} & Omit<RenderOptions, "queries">;

export const renderWithProviders = (
  ui: ReactElement,
  { preloadedState, route = "/", ...renderOptions }: CustomOptions = {}
) => {
  const store = createStore(preloadedState);

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <I18nProvider>
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    </I18nProvider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
