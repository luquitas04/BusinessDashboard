import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppProviders } from "./app/providers/AppProviders";

if (import.meta.env.VITE_API_MODE === "mock") {
  const { worker } = await import("./shared/test/msw/browser");
  await worker.start();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
