import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthState, AuthSession, Role, User } from "../types/auth";
import { authService } from "../services/authService";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role[] | Role) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_TOKEN_KEY = "fintrack_auth_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true
  });

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!storedToken) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }
      try {
        const session = await authService.getCurrentUser(storedToken);
        const user = mapSessionToUser(session);
        setState({ user, token: storedToken, isLoading: false });
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setState({ user: null, token: null, isLoading: false });
      }
    };
    void bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    const session = await authService.login(email, password);
    const token = session.accessToken;
    const user = mapSessionToUser(session);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setState({ user, token, isLoading: false });
    navigate("/", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setState({ user: null, token: null, isLoading: false });
    navigate("/login", { replace: true });
  };

  const hasRole = (roles: Role[] | Role) => {
    if (!state.user) return false;
    const list = Array.isArray(roles) ? roles : [roles];
    return list.includes(state.user.role);
  };

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      login,
      logout,
      hasRole
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const mapSessionToUser = (session: AuthSession): User => {
  const roleId = (session.roleId ?? "").toString().toLowerCase();
  let role: Role;
  switch (roleId) {
    case "owner":
    case "tenantowner":
      role = Role.Owner;
      break;
    case "accountant":
      role = Role.Accountant;
      break;
    default:
      role = Role.User;
  }

  return {
    id: session.userId,
    name: (session.fullname as string) ?? session.email,
    email: session.email,
    role
  };
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

