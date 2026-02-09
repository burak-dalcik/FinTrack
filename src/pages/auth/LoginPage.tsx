import { FormEvent, useEffect, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { setBusinessCodename, setEnvironment } from "../../services/apiClient";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user, isLoading } = useAuth();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Geliştirme için: varsayılan ortam ve business
  useEffect(() => {
    setEnvironment("preview");
    setBusinessCodename("burak");
  }, []);

  if (user && !isLoading) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const errCode = err?.response?.data?.errCode as string | undefined;
      if (errCode === "EmailVerificationNeeded") {
        navigate("/verify-email", { state: { email } });
        return;
      }
      if (errCode === "MobileVerificationNeeded") {
        navigate("/verify-mobile", { state: { email } });
        return;
      }
      setError(err?.response?.data?.message ?? "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>FinTrack Login</h2>
        <p className="auth-subtitle">Sign in to your business account</p>
        <form onSubmit={handleSubmit} className="form">
          <label className="form-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </label>
          <label className="form-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>
          <button
            type="button"
            className="btn btn-secondary w-full"
            style={{ marginTop: "0.5rem" }}
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password?
          </button>
        </form>
      </div>
    </div>
  );
};

