const DEFAULT_DEV_API_URL = "http://localhost:4000";

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

const resolveBaseUrl = () => {
  const fromEnv =
    (typeof process !== "undefined" && process.env?.VITE_API_URL) ||
    (typeof globalThis !== "undefined"
      ? ((globalThis as Record<string, unknown>).__API_BASE_URL__ as
          | string
          | undefined)
      : undefined);

  if (fromEnv) {
    return normalizeBaseUrl(fromEnv);
  }

  if (typeof window !== "undefined" && window.location) {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocalhost) {
      return DEFAULT_DEV_API_URL;
    }

    if (window.location.origin) {
      return normalizeBaseUrl(window.location.origin);
    }
  }

  return DEFAULT_DEV_API_URL;
};

export const API_BASE_URL = resolveBaseUrl();
