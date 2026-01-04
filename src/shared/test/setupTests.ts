import "@testing-library/jest-dom";
import { server, resetMocks } from "./msw/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  resetMocks();
});
afterAll(() => server.close());
