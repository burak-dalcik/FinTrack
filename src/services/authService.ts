import { authClient } from "./apiClient";
import { AuthSession } from "../types/auth";

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    // Login is tenant-scoped; use authClient so headers/interceptors are applied.
    const response = await authClient.post<AuthSession>("/login", {
      username: email,
      password
    });
    return response.data;
  },

  async getCurrentUser(token: string): Promise<AuthSession> {
    // Current session info: GET /currentuser
    const baseURL = (authClient.defaults.baseURL as string) ?? "";
    const response = await axios.get<AuthSession>(`${baseURL}/currentuser`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

