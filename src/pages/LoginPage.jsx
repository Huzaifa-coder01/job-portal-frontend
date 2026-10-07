import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { DEMO_CREDENTIALS } from "../context/auth-context";
import AuthLayout from "../components/layout/AuthLayout";
import Field from "../components/ui/Field";

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const validate = (values) => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 6) next.password = "Password must be at least 6 characters.";
    return next;
  };

  const attempt = async (values) => {
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = DEMO_CREDENTIALS[role];
    setForm(creds);
    attempt(creds);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your job search."
      footer={<>New to Hirova? <Link to="/signup" className="font-bold text-brand-text hover:underline">Create an account</Link></>}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          attempt(form);
        }}
        className="space-y-5"
        noValidate
      >
        <Field
          id="email" label="Email" type="email" icon={Mail} autoComplete="email" placeholder="you@example.com"
          value={form.email} error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Field
          id="password" label="Password" type={show ? "text" : "password"} icon={Lock} autoComplete="current-password" placeholder="••••••••"
          value={form.password} error={errors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          right={
            <button
              type="button" onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-3 hover:text-ink"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          }
        />
        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
          {loading ? <><Loader2 className="size-4 animate-spin" /> Logging in…</> : "Log in"}
        </button>
      </form>

      <div className="my-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-ink-3">
        <span className="h-px flex-1 bg-line" /> Try the demo <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" disabled={loading} onClick={() => fillDemo("candidate")} className="btn btn-secondary">As candidate</button>
        <button type="button" disabled={loading} onClick={() => fillDemo("employer")} className="btn btn-secondary">As employer</button>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
