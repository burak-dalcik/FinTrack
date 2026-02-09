import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verificationService } from "../../services/verificationService";

type Mode = "choice" | "email-start" | "email-complete" | "mobile-start" | "mobile-complete";

export const PasswordResetPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("choice");
  const [email, setEmail] = useState("");
  const [secretCode, setSecretCode] = useState<string | undefined>();
  const [codeIndex, setCodeIndex] = useState<number | undefined>();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [mobile, setMobile] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chooseEmail = () => {
    setMode("email-start");
    setError(null);
  };

  const chooseMobile = () => {
    setMode("mobile-start");
    setError(null);
  };

  const startEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await verificationService.startPasswordResetByEmail(email);
      setSecretCode(res.secretCode);
      setCodeIndex(res.codeIndex);
      setMode("email-complete");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to start email reset.");
    } finally {
      setLoading(false);
    }
  };

  const completeEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !code || !password || password !== password2) return;
    setLoading(true);
    setError(null);
    try {
      await verificationService.completePasswordResetByEmail(email, code, password);
      navigate("/login", { replace: true, state: { email } });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const startMobile = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await verificationService.startPasswordResetByMobile(email);
      setSecretCode(res.secretCode);
      setCodeIndex(res.codeIndex);
      setMobile(res.mobile);
      setMode("mobile-complete");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to start mobile reset.");
    } finally {
      setLoading(false);
    }
  };

  const completeMobile = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !code || !password || password !== password2) return;
    setLoading(true);
    setError(null);
    try {
      await verificationService.completePasswordResetByMobile(email, code, password);
      navigate("/login", { replace: true, state: { email } });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="auth-subtitle">
          Choose how you want to verify your identity, then set a new password.
        </p>

        {mode === "choice" && (
          <div className="form">
            <button className="btn btn-primary w-full" onClick={chooseEmail}>
              Verify via Email
            </button>
            <button className="btn btn-secondary w-full" onClick={chooseMobile}>
              Verify via Mobile
            </button>
          </div>
        )}

        {mode === "email-start" && (
          <form className="form" onSubmit={startEmail}>
            <label className="form-label">
              Email
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary w-full" disabled={loading} type="submit">
              {loading ? "Sending code..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {mode === "email-complete" && (
          <form className="form" onSubmit={completeEmail}>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              Code sent to <strong>{email}</strong>.
              {codeIndex != null && (
                <>
                  {" "}
                  Use index <strong>{codeIndex}</strong>.
                </>
              )}
            </div>
            {secretCode && (
              <div style={{ fontSize: "0.8rem", color: "#4ade80" }}>
                Test mode code: <strong>{secretCode}</strong>
              </div>
            )}
            <label className="form-label">
              Verification Code
              <input
                className="input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </label>
            <label className="form-label">
              New Password
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label className="form-label">
              Confirm Password
              <input
                type="password"
                className="input"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </label>
            {password && password2 && password !== password2 && (
              <div className="form-error">Passwords do not match.</div>
            )}
            {error && <div className="form-error">{error}</div>}
            <button
              className="btn btn-primary w-full"
              disabled={loading || !password || password !== password2}
              type="submit"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {mode === "mobile-start" && (
          <form className="form" onSubmit={startMobile}>
            <label className="form-label">
              Email
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary w-full" disabled={loading} type="submit">
              {loading ? "Sending code..." : "Send SMS Code"}
            </button>
          </form>
        )}

        {mode === "mobile-complete" && (
          <form className="form" onSubmit={completeMobile}>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              Code sent to your mobile {mobile ?? ""}.
              {codeIndex != null && (
                <>
                  {" "}
                  Use index <strong>{codeIndex}</strong>.
                </>
              )}
            </div>
            {secretCode && (
              <div style={{ fontSize: "0.8rem", color: "#4ade80" }}>
                Test mode code: <strong>{secretCode}</strong>
              </div>
            )}
            <label className="form-label">
              Verification Code
              <input
                className="input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </label>
            <label className="form-label">
              New Password
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label className="form-label">
              Confirm Password
              <input
                type="password"
                className="input"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </label>
            {password && password2 && password !== password2 && (
              <div className="form-error">Passwords do not match.</div>
            )}
            {error && <div className="form-error">{error}</div>}
            <button
              className="btn btn-primary w-full"
              disabled={loading || !password || password !== password2}
              type="submit"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

