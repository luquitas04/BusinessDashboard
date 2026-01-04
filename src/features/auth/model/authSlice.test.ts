import { authSlice } from "../../../app/store/slices/authSlice";

const { setUser, logOut } = authSlice.actions;

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("setUser sets user and persists auth", () => {
    const user = { id: 1, name: "Admin", email: "admin@test.com", role: "admin" as const };
    const state = authSlice.reducer(undefined, setUser(user));

    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);

    const stored = localStorage.getItem("auth");
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored || "{}").user).toEqual(user);
  });

  it("logOut clears user and storage", () => {
    const user = { id: 1, name: "Admin", email: "admin@test.com", role: "admin" as const };
    const preloaded = { user, isAuthenticated: true };

    const state = authSlice.reducer(preloaded, logOut());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem("auth")).toBeNull();
  });
});
