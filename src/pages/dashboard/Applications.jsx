import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, FileSearch, FileText, Trash2, Video } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import CompanyLogo from "../../components/ui/CompanyLogo";
import { EmptyState, PageHeader, StatusBadge } from "../../components/ui/Common";
import { APPLICATION_STATUSES } from "../../data/people";
import { cn, formatDate } from "../../utils/helpers";

const STAGES = ["Applied", "In Review", "Interview", "Offer"];

const Stepper = ({ status }) => {
  const rejected = status === "Rejected";
  const current = STAGES.indexOf(status);
  return (
    <ol className="flex items-center" aria-label={`Application stage: ${status}`}>
      {STAGES.map((stage, i) => {
        const done = !rejected && i <= current;
        return (
          <li key={stage} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition",
                  done ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-surface text-ink-3",
                  rejected && i === 0 && "border-red-400 bg-red-400 text-white",
                )}
              >
                {done || (rejected && i === 0) ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn("hidden text-[11px] font-semibold sm:block", done ? "text-ink" : "text-ink-3")}>{stage}</span>
            </div>
            {i < STAGES.length - 1 && (
              <span className={cn("mx-1 mb-0 h-0.5 flex-1 rounded sm:mb-5", !rejected && i < current ? "bg-brand-600" : "bg-line")} />
            )}
          </li>
        );
      })}
    </ol>
  );
};

const Applications = () => {
  const { myApplications, withdrawApplication } = useStore();
  const [filter, setFilter] = useState("All");

  const tabs = ["All", ...APPLICATION_STATUSES];
  const shown = filter === "All" ? myApplications : myApplications.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Applications" title="Track your applications" description="See where you stand with every company you've applied to." />

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
        {tabs.map((t) => {
          const n = t === "All" ? myApplications.length : myApplications.filter((a) => a.status === t).length;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={filter === t}
              onClick={() => setFilter(t)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition",
                filter === t ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-surface text-ink-2 hover:border-brand-300",
              )}
            >
              {t} <span className={cn("ml-1 text-xs", filter === t ? "text-white/70" : "text-ink-3")}>{n}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={myApplications.length ? FileSearch : FileText}
          title={myApplications.length ? `No ${filter.toLowerCase()} applications` : "No applications yet"}
          description={myApplications.length ? "Applications with this status will appear here." : "When you apply to a job, you'll be able to follow its progress here."}
          action={<Link to="/jobs" className="btn btn-primary">Browse jobs</Link>}
        />
      ) : (
        <div className="space-y-4">
          {shown.map((a) => (
            <article key={a.id} className="card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <CompanyLogo company={a.job.company} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-bold text-ink">
                      <Link to={`/jobs/${a.job.id}`} className="hover:text-brand-text">{a.job.title}</Link>
                    </h2>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-ink-2">{a.job.company.name} · {a.job.location}</p>
                  <p className="mt-1 text-xs text-ink-3">Applied {formatDate(a.appliedAt)} · Resume: {a.resumeName}</p>
                </div>
              </div>

              <div className="mt-5 sm:pl-16">
                <Stepper status={a.status} />
              </div>

              {a.status === "Interview" && a.interview && (
                <div className="mt-5 flex items-center gap-3 rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-text sm:ml-16">
                  <Video className="size-4 shrink-0" />
                  <span><strong>{new Date(a.interview.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong> · {a.interview.kind}</span>
                </div>
              )}
              {a.status === "Offer" && (
                <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 sm:ml-16 dark:bg-emerald-500/10 dark:text-emerald-300">
                  🎉 Congratulations! {a.job.company.name} would like to extend you an offer.
                </div>
              )}

              {a.status !== "Offer" && (
                <div className="mt-4 flex justify-end">
                  <button onClick={() => withdrawApplication(a.id)} className="btn btn-ghost btn-sm text-ink-3 hover:!text-red-600">
                    <Trash2 className="size-4" /> Withdraw
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
