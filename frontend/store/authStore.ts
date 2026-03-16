import { create } from "zustand";

export type AuthUser = { id: number; email: string; name: string } | null;

type AuthState = {
  user: AuthUser;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (input: { user: AuthUser; accessToken: string }) => void;
  clear: () => void;
};

export const authStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setSession: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken)
    }),
  clear: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false
    })
}));

