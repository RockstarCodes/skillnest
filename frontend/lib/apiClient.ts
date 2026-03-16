import axios from "axios";
import { API_BASE_URL } from "./config";
import { authStore } from "../store/authStore";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        withCredentials: true
      }
    );
    const accessToken = res.data?.accessToken as string | undefined;
    const user = res.data?.user as any;
    if (accessToken) authStore.getState().setSession({ accessToken, user });
    return accessToken ?? null;
  } catch {
    authStore.getState().clear();
    return null;
  }
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original || original._retry) throw error;

    if (error.response?.status === 401) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken().finally(() => {
          isRefreshing = false;
        });
      }

      const token = await refreshPromise;
      if (!token) throw error;

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${token}`;
      return apiClient.request(original);
    }

    throw error;
  }
);

