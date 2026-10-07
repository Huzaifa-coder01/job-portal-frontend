import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Download, MapPin, Users, Zap } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import { Avatar, EmptyState, PageHeader } from "../../components/ui/Common";
import { APPLICATION_STATUSES } from "../../data/people";
import { cn, timeAgo } from "../../utils/helpers";

const STATUS_COLOR = {
  Applied: "text-sky-700 bg-sky-50 dark:bg-sky-500/15 dark:text-sky-300",
  "In Review": "text-amber-700 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300",
  Interview: "text-brand-text bg-brand-soft",
  Offer: "text-emerald-700 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300",
  Rejected: "text-red-700 bg-red-50 dark:bg-red-500/15 dark:text-red-300",
};

const Applicants = () => {
  const { employerJobs, getApplicants, setApplicantStatus } = useStore();
  const [params, setParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState("All");

  const jobId = employerJobs.some((j) => j.id === params.get("job")) ? params.get("job") : (employerJobs[0]?.id ?? "");
  const job = employerJobs.find((j) => j.id === jobId);

  const applicants = useMemo(() => (jobId ? getApplicants(jobId) : []), [jobId, getApplicants]);
  const shown = statusFilter === "All" ? applicants : applicants.filter((a) => a.status === statusFilter);

  const change = (application, status) => {
    setApplicantStatus(application, status);
    toast.success(`${application.applicant.name} moved to “${status}”`);
  };

  if (employerJobs.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Applicants" title="Applicants" />
        <EmptyState icon={Users} title="No applicants yet" description="Post a job to start receiving applications." action={<Link to="/dashboard/post" className="btn btn-primary">Post a job</Link>} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Applicants" title="Review your applicants" description="Move candidates through your pipeline and keep everyone informed." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-3">
          <span className="shrink-0 text-sm font-semibold text-ink-2">Job</span>
          <select value={jobId} onChange={(e) => { setParams({ job: e.target.value }); setStatusFilter("All"); }} className="field">
            {employerJobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </label>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All", ...APPLICATION_STATUSES].map((s) => {
          const n = s === "All" ? applicants.length : applicants.filter((a) => a.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              aria-pressed={statusFilter === s}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition",
                statusFilter === s ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-surface text-ink-2 hover:border-brand-300",
              )}
            >
              {s} <span className={cn("ml-1 text-xs", statusFilter === s ? "text-white/70" : "text-ink-3")}>{n}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <EmptyState icon={Users} title="No applicants in this stage" description={`Nobody is currently marked “${statusFilter}” for ${job?.title}.`} />
      ) : (
        <div className="space-y-3">
          {shown.map((a) => (
            <article key={a.id} className="card flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <Avatar name={a.applicant.name} size="lg" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-bold text-ink">{a.applicant.name}</h2>
                    <span className="badge badge-green !py-0.5"><Zap className="size-3" />{a.match}% match</span>
                  </div>
                  <p className="truncate text-sm text-ink-2">{a.applicant.headline} · {a.applicant.years} yrs exp.</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-3"><MapPin className="size-3" />{a.applicant.location} · Applied {timeAgo(a.appliedAt).toLowerCase()}</p>
                </div>
              </div>
              <div className="hidden flex-wrap gap-1.5 xl:flex xl:max-w-[220px]">
                {a.applicant.skills.slice(0, 3).map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
              <div className="flex items-center gap-2">
                <button className="icon-btn !size-9" aria-label={`Download resume for ${a.applicant.name}`} onClick={() => toast(`Downloading ${a.resumeName}…`, { icon: "📄" })}>
                  <Download className="size-4" />
                </button>
                <select
                  value={a.status}
                  onChange={(e) => change(a, e.target.value)}
                  aria-label={`Status for ${a.applicant.name}`}
                  className={cn("rounded-xl border-0 px-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/20", STATUS_COLOR[a.status])}
                >
                  {APPLICATION_STATUSES.map((s) => <option key={s} value={s} className="bg-surface text-ink">{s}</option>)}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;
