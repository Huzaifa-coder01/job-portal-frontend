import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/helpers";
import { Monogram } from "./CompanyLogo";

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
    {Icon && (
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-text">
        <Icon className="size-6" />
      </span>
    )}
    <h3 className="text-lg font-bold text-ink">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-sm text-ink-2">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const PageHeader = ({ eyebrow, title, description, children }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
      {description && <p className="mt-1.5 max-w-2xl text-ink-2">{description}</p>}
    </div>
    {children}
  </div>
);

export const SectionHeading = ({ eyebrow, title, description, action, center }) => (
  <div className={cn("mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", center && "items-center text-center sm:flex-col sm:items-center")}>
    <div className={center ? "mx-auto max-w-2xl" : ""}>
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 max-w-2xl text-lg text-ink-2">{description}</p>}
    </div>
    {action}
  </div>
);

export const Avatar = ({ name, colors, size = "md", className }) => (
  <Monogram name={name} colors={colors ?? ["#6b5bff", "#e0689c"]} size={size} className={cn("!rounded-full", className)} />
);

const STATUS_STYLES = {
  Applied: "badge badge-sky",
  "In Review": "badge badge-amber",
  Interview: "badge badge-brand",
  Offer: "badge badge-green",
  Rejected: "badge badge-red",
};
export const StatusBadge = ({ status }) => (
  <span className={STATUS_STYLES[status] ?? "badge badge-neutral"}>
    <span className="size-1.5 rounded-full bg-current" />
    {status}
  </span>
);

export const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  const items = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1,
  );
  const withGaps = items.flatMap((p, i) => (i && p - items[i - 1] > 1 ? ["…" + p, p] : [p]));
  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button className="icon-btn !size-9" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="size-4" />
      </button>
      {withGaps.map((p) =>
        typeof p === "string" ? (
          <span key={p} className="px-1 text-ink-3">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "size-9 rounded-xl text-sm font-semibold transition",
              p === page ? "bg-brand-600 text-white" : "text-ink-2 hover:bg-surface-2",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button className="icon-btn !size-9" disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
};

export const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-ink-3">
    {items.map((item, i) => (
      <span key={item.label} className="flex items-center gap-1.5">
        {i > 0 && <ChevronRight className="size-3.5" />}
        {item.to ? (
          <Link to={item.to} className="transition hover:text-brand-text">{item.label}</Link>
        ) : (
          <span className="font-medium text-ink-2">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export const Stat = ({ icon: Icon, label, value, hint, tone = "brand" }) => {
  const tones = {
    brand: "bg-brand-soft text-brand-text",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-2">{label}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-xl", tones[tone])}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-3">{hint}</p>}
    </div>
  );
};
