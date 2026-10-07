import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, CalendarClock, CheckCircle2, Circle, FileText, Gift, Video } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../hooks/useStore";
import CompanyLogo from "../../components/ui/CompanyLogo";
import JobCard from "../../components/jobs/JobCard";
import { PageHeader, Stat, StatusBadge } from "../../components/ui/Common";
import { timeAgo } from "../../utils/helpers";
import { profileChecklist } from "../../utils/profile";

const CandidateOverview = () => {
  const { user } = useAuth();
  const { myApplications, savedIds, jobs } = useStore();

  const checklist = profileChecklist(user);
  const pct = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);
  const interviews = myApplications.filter((a) => a.status === "Interview");
  const offers = myApplications.filter((a) => a.status === "Offer");
  const upcoming = interviews.find((a) => a.interview);

  const applied = new Set(myApplications.map((a) => a.jobId));
  const mySkills = (user.skills ?? []).map((s) => s.toLowerCase());
  const recommended = jobs
    .filter((j) => !applied.has(j.id))
    .map((j) => ({ job: j, score: j.skills.filter((s) => mySkills.includes(s.toLowerCase())).length * 3 + (j.featured ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.job);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Dashboard" title={`Good to see you, ${user.name.split(" ")[0]} 👋`} description="Here's what's happening with your job search." />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat icon={FileText} label="Applications" value={myApplications.length} hint="Total submitted" />
        <Stat icon={Video} tone="sky" label="Interviews" value={interviews.length} hint="In progress" />
        <Stat icon={Gift} tone="green" label="Offers" value={offers.length} hint="Awaiting reply" />
        <Stat icon={Bookmark} tone="amber" label="Saved jobs" value={savedIds.length} hint="Ready to apply" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {upcoming && (
            <div className="card flex flex-col gap-4 border-brand-200 bg-brand-soft/50 p-5 sm:flex-row sm:items-center dark:border-brand-500/30">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <CalendarClock className="size-6" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-text">Upcoming interview</p>
                <p className="mt-0.5 font-bold text-ink">{upcoming.job.title} · {upcoming.job.company.name}</p>
                <p className="text-sm text-ink-2">
                  {new Date(upcoming.interview.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} · {upcoming.interview.kind}
                </p>
              </div>
              <Link to="/dashboard/applications" className="btn btn-primary btn-sm">View details</Link>
            </div>
          )}

          <section className="card">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-bold text-ink">Recent applications</h2>
              <Link to="/dashboard/applications" className="text-sm font-semibold text-brand-text hover:underline">View all</Link>
            </div>
            {myApplications.length === 0 ? (
              <p className="px-6 py-10 text-center text-ink-2">
                You haven&apos;t applied to anything yet. <Link to="/jobs" className="font-semibold text-brand-text hover:underline">Find your first job →</Link>
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {myApplications.slice(0, 4).map((a) => (
                  <li key={a.id}>
                    <Link to={`/jobs/${a.job.id}`} className="flex items-center gap-4 px-6 py-4 transition hover:bg-surface-2/60">
                      <CompanyLogo company={a.job.company} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-ink">{a.job.title}</p>
                        <p className="truncate text-sm text-ink-3">{a.job.company.name} · Applied {timeAgo(a.appliedAt).toLowerCase()}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Recommended for you</h2>
              <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline">
                Browse all <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recommended.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          </section>
        </div>

        <aside>
          <div className="card sticky top-24 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-ink">Profile strength</h2>
              <span className="text-2xl font-extrabold text-brand-text">{pct}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-pink-500 transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <ul className="mt-5 space-y-3">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2.5 text-sm">
                  {c.done ? <CheckCircle2 className="size-[18px] text-emerald-500" /> : <Circle className="size-[18px] text-ink-3" />}
                  <span className={c.done ? "text-ink-3 line-through" : "font-medium text-ink"}>{c.label}</span>
                </li>
              ))}
            </ul>
            {pct < 100 && (
              <Link to="/dashboard/profile" className="btn btn-primary mt-6 w-full">Complete profile</Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CandidateOverview;
