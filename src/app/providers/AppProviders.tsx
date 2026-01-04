import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter } from "react-router-dom";
import { I18nProvider } from "../../shared/lib/i18n";

type Props = {
  children: ReactNode;
};

export const AppProviders = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <I18nProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </I18nProvider>
    </Provider>
  );
};
