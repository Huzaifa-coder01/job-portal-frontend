import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, PlusCircle, Trophy, UserCheck, Users } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../hooks/useStore";
import { Avatar, PageHeader, Stat, StatusBadge } from "../../components/ui/Common";
import { APPLICATION_STATUSES } from "../../data/people";
import { cn, daysSince, timeAgo } from "../../utils/helpers";

const DAYS = 14;

const EmployerOverview = () => {
  const { user } = useAuth();
  const { employerJobs, getApplicants } = useStore();
  const [now] = useState(() => Date.now());

  const applicants = useMemo(
    () => employerJobs.flatMap((job) => getApplicants(job.id).map((a) => ({ ...a, job }))),
    [employerJobs, getApplicants],
  );

  const byStatus = Object.fromEntries(APPLICATION_STATUSES.map((s) => [s, applicants.filter((a) => a.status === s).length]));

  // Applicants received per day over the last two weeks.
  const series = Array.from({ length: DAYS }, (_, i) => {
    const age = DAYS - 1 - i;
    const date = new Date(now - age * 86_400_000);
    return {
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: applicants.filter((a) => daysSince(a.appliedAt) === age).length,
    };
  });
  const max = Math.max(...series.map((s) => s.count), 1);
  const recent = [...applicants].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow={user.companyName} title={`Welcome back, ${user.name.split(" ")[0]} 👋`} description="A snapshot of your hiring pipeline.">
        <Link to="/dashboard/post" className="btn btn-primary"><PlusCircle className="size-4" /> Post a job</Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat icon={Briefcase} label="Active listings" value={employerJobs.length} hint="Live right now" />
        <Stat icon={Users} tone="sky" label="Total applicants" value={applicants.length} hint="Across all roles" />
        <Stat icon={UserCheck} tone="amber" label="Interviewing" value={byStatus.Interview} hint="In the pipeline" />
        <Stat icon={Trophy} tone="green" label="Offers out" value={byStatus.Offer} hint="Awaiting decision" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-bold text-ink">Applicants · last {DAYS} days</h2>
            <span className="text-sm text-ink-3">{series.reduce((n, s) => n + s.count, 0)} total</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-1.5 sm:gap-2" role="img" aria-label="Bar chart of applicants received per day">
            {series.map((s, i) => (
              <div key={i} className="group relative flex h-full flex-1 flex-col justify-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-500 group-hover:from-brand-700 group-hover:to-brand-500"
                  style={{ height: `${Math.max((s.count / max) * 100, s.count ? 6 : 2)}%`, opacity: s.count ? 1 : 0.25 }}
                />
                <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs font-semibold text-bg opacity-0 transition group-hover:opacity-100">
                  {s.label}: {s.count}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-ink-3">
            <span>{series[0].label}</span>
            <span>Today</span>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-bold text-ink">Pipeline</h2>
          <ul className="mt-5 space-y-4">
            {APPLICATION_STATUSES.map((s) => (
              <li key={s}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-ink-2">{s}</span>
                  <span className="font-bold text-ink">{byStatus[s]}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", s === "Rejected" ? "bg-red-400" : s === "Offer" ? "bg-emerald-500" : "bg-brand-500")}
                    style={{ width: `${(byStatus[s] / Math.max(applicants.length, 1)) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-bold text-ink">Latest applicants</h2>
          <Link to="/dashboard/applicants" className="text-sm font-semibold text-brand-text hover:underline">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-ink-2">No applicants yet — post a job to start receiving applications.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((a) => (
              <li key={a.id} className="flex items-center gap-4 px-6 py-4">
                <Avatar name={a.applicant.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{a.applicant.name}</p>
                  <p className="truncate text-sm text-ink-3">{a.job.title} · {timeAgo(a.appliedAt).toLowerCase()}</p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default EmployerOverview;
