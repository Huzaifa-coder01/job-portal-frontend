import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Briefcase, Building2, Eye, EyeOff, Loader2, Lock, Mail, User, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/layout/AuthLayout";
import Field from "../components/ui/Field";
import { cn } from "../utils/helpers";

const ROLES = [
  { id: "candidate", label: "I'm looking for a job", icon: UserRound },
  { id: "employer", label: "I'm hiring", icon: Briefcase },
];

const SignupPage = () => {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [role, setRole] = useState(params.get("role") === "employer" ? "employer" : "candidate");
  const [form, setForm] = useState({ name: "", email: "", password: "", companyName: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 2) found.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = "Enter a valid email address.";
    if (form.password.length < 6) found.password = "Use at least 6 characters.";
    if (role === "employer" && !form.companyName.trim()) found.companyName = "Tell us which company you're hiring for.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      await signup({ ...form, role });
      navigate(role === "employer" ? "/dashboard/post" : "/jobs", { replace: true });
    } catch {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It's free, and takes less than a minute."
      footer={<>Already have an account? <Link to="/login" className="font-bold text-brand-text hover:underline">Log in</Link></>}
    >
      <div className="mb-6 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Account type">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={role === r.id}
            onClick={() => setRole(r.id)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left text-sm font-semibold transition",
              role === r.id
                ? "border-brand-500 bg-brand-soft text-brand-text ring-4 ring-brand-500/10"
                : "border-line bg-surface text-ink-2 hover:border-brand-300",
            )}
          >
            <r.icon className="size-5" />
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-5" noValidate>
        <Field id="name" label="Full name" icon={User} autoComplete="name" placeholder="Jane Cooper" value={form.name} onChange={set("name")} error={errors.name} />
        {role === "employer" && (
          <Field id="company" label="Company name" icon={Building2} placeholder="Acme Inc." value={form.companyName} onChange={set("companyName")} error={errors.companyName} />
        )}
        <Field id="email" label={role === "employer" ? "Work email" : "Email"} type="email" icon={Mail} autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={errors.email} />
        <Field
          id="password" label="Password" type={show ? "text" : "password"} icon={Lock} autoComplete="new-password" placeholder="At least 6 characters"
          value={form.password} onChange={set("password")} error={errors.password}
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
          {loading ? <><Loader2 className="size-4 animate-spin" /> Creating account…</> : "Create account"}
        </button>
        <p className="text-center text-xs text-ink-3">
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
