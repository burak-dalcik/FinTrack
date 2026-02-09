import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verificationService } from "../../services/verificationService";

interface LocationState {
  email?: string;
}

export const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};

  const [email, setEmail] = useState(state.email ?? "");
  const [code, setCode] = useState("");
  const [secretCode, setSecretCode] = useState<string | undefined>();
  const [codeIndex, setCodeIndex] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"start" | "complete">("start");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.email) {
      void handleStart(state.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = async (targetEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await verificationService.startEmailVerification(targetEmail);
      setEmail(targetEmail);
      setSecretCode(res.secretCode);
      setCodeIndex(res.codeIndex);
      setStep("complete");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to start email verification.");
    } finally {
      setLoading(false);
    }
  };

  const submitStart = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await handleStart(email);
  };

  const submitComplete = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !code) return;
    setError(null);
    setLoading(true);
    try {
      const res = await verificationService.completeEmailVerification(email, code);
      if (res.mobileVerificationNeeded) {
        navigate("/verify-mobile", { replace: true, state: { email } });
      } else {
        navigate("/login", { replace: true, state: { email } });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Verification failed. Please check the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Email Verification</h2>
        <p className="auth-subtitle">
          Please verify your email to continue. A 6-digit code will be sent.
        </p>

        {step === "start" && (
          <form className="form" onSubmit={submitStart}>
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
              {loading ? "Sending code..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {step === "complete" && (
          <form className="form" onSubmit={submitComplete}>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              Code has been sent to <strong>{email}</strong>.
              {codeIndex != null && (
                <>
                  {" "}
                  Use the code with index <strong>{codeIndex}</strong>.
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
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary w-full" disabled={loading} type="submit">
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

