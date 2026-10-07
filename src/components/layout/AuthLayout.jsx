import { CheckCircle2, Quote } from "lucide-react";
import Logo from "../ui/Logo";
import { Avatar } from "../ui/Common";
import { testimonials } from "../../data/people";

const POINTS = [
  "Salary ranges on every single listing",
  "One-click apply with a reusable profile",
  "Track every application in one place",
];

const AuthLayout = ({ title, subtitle, children, footer }) => {
  const t = testimonials[0];
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-[#8d3df0] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-20 top-1/3 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 size-96 rounded-full bg-pink-400/20 blur-3xl" />
        <Logo light className="relative" />
        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">Your next great role is one click away.</h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 font-medium text-white/90">
                <CheckCircle2 className="size-5 text-accent-400" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <figure className="relative max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
          <Quote className="size-6 text-white/50" />
          <blockquote className="mt-3 leading-relaxed text-white/90">{t.quote}</blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            <Avatar name={t.name} colors={t.colors} size="sm" />
            <div>
              <p className="text-sm font-bold">{t.name}</p>
              <p className="text-xs text-white/70">{t.role}</p>
            </div>
          </figcaption>
        </figure>
      </aside>

      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div className="lg:hidden"><Logo /></div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-extrabold text-ink">{title}</h1>
          <p className="mt-2 text-ink-2">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-center text-sm text-ink-2">{footer}</div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
