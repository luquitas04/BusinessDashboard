import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../entities/users/types/type";

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

const STORAGE_KEY = "auth";
const defaultState: UserState = { user: null, isAuthenticated: false };

const loadAuthFromStorage = (): UserState => {
  if (typeof window === "undefined") return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    return JSON.parse(stored) as UserState;
  } catch (error) {
    console.error(error);
    return defaultState;
  }
};

const saveAuthToStorage = (state: UserState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const clearAuthFromStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};

const initialState: UserState = loadAuthFromStorage();

const reducer = {
  setUser: (state: UserState, action: PayloadAction<User>) => {
    state.user = action.payload;
    state.isAuthenticated = true;
    saveAuthToStorage({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    });
  },
  logOut: (state: UserState) => {
    state.isAuthenticated = false;
    state.user = null;
    clearAuthFromStorage();
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: reducer,
});
