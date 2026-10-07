import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight, BarChart3, Briefcase, Building2, CalendarDays, Check, CheckCircle2, Clock, Gift, Globe2,
  MapPin, SearchX, Share2, Star, Users, Wallet,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";
import CompanyLogo from "../components/ui/CompanyLogo";
import ApplyModal from "../components/jobs/ApplyModal";
import SaveButton from "../components/jobs/SaveButton";
import JobCard from "../components/jobs/JobCard";
import { Breadcrumbs, EmptyState } from "../components/ui/Common";
import { LEVEL_LABELS, categoriesById } from "../data/categories";
import { companiesById } from "../data/companies";
import { formatDate, formatSalary, timeAgo } from "../utils/helpers";

const Section = ({ title, children }) => (
  <section className="mt-8 first:mt-0">
    <h2 className="mb-4 text-xl font-bold text-ink">{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-ink-2">
        <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-brand-500" />
        <span className="leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

const Fact = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-2">
      <Icon className="size-4" />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-ink-3">{label}</p>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
  </div>
);

const JobDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getJob, jobs, hasApplied } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [applyOpen, setApplyOpen] = useState(false);

  const job = getJob(id);

  if (!job) {
    return (
      <div className="container-x py-24">
        <EmptyState
          icon={SearchX}
          title="This job is no longer available"
          description="The listing may have been filled or removed by the employer."
          action={<Link to="/jobs" className="btn btn-primary">Browse open jobs</Link>}
        />
      </div>
    );
  }

  const applied = hasApplied(job.id);
  const isOwner = user?.role === "employer" && user.companyId === job.companyId;
  const isEmployer = user?.role === "employer";
  const knownCompany = Boolean(companiesById[job.companyId]);
  const similar = jobs
    .filter((j) => j.id !== job.id && (j.category === job.category || j.companyId === job.companyId))
    .slice(0, 3);

  const onApply = () => {
    if (!user) {
      toast("Log in to apply for this role", { icon: "👋" });
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setApplyOpen(true);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const renderApply = (block = false) => {
    const cls = block ? "btn btn-primary btn-lg w-full" : "btn btn-primary btn-lg";
    if (isOwner) return <Link to="/dashboard/jobs" className={cls}>Manage listing</Link>;
    if (isEmployer) return <span className="badge badge-neutral">Employer accounts can&apos;t apply</span>;
    if (applied) {
      return (
        <Link to="/dashboard/applications" className="btn btn-secondary btn-lg w-full sm:w-auto">
          <Check className="size-4 text-emerald-500" /> Applied · View status
        </Link>
      );
    }
    return (
      <button onClick={onApply} className={cls}>
        Apply now <ArrowRight className="size-4" />
      </button>
    );
  };

  return (
    <div className="container-x pb-28 pt-8 lg:pb-12">
      <Breadcrumbs items={[{ label: "Jobs", to: "/jobs" }, { label: categoriesById[job.category]?.label, to: `/jobs?category=${job.category}` }, { label: job.title }]} />

      <header className="card relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-5">
            <CompanyLogo company={job.company} size="lg" className="hidden sm:inline-flex" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {job.featured && <span className="badge badge-amber">Featured</span>}
                <span className="badge badge-brand">{job.type}</span>
                <span className="badge badge-neutral">{job.mode}</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold leading-tight text-ink sm:text-4xl">{job.title}</h1>
              <p className="mt-2 text-lg text-ink-2">
                {knownCompany ? (
                  <Link to={`/companies/${job.companyId}`} className="font-semibold text-ink hover:text-brand-text">{job.company.name}</Link>
                ) : (
                  <span className="font-semibold text-ink">{job.company.name}</span>
                )}
                <span className="mx-2 text-ink-3">·</span>{job.location}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2">
                <span className="inline-flex items-center gap-1.5 font-semibold text-ink"><Wallet className="size-4 text-brand-500" />{formatSalary(job.salary)} / year</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="size-4 text-ink-3" />Posted {timeAgo(job.postedAt)}</span>
                <span className="inline-flex items-center gap-1.5"><Users className="size-4 text-ink-3" />{job.applicants} applicants</span>
              </div>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-2.5 md:flex">
            <button onClick={share} className="icon-btn" aria-label="Copy link to share"><Share2 className="size-[18px]" /></button>
            <SaveButton jobId={job.id} className="!size-10" />
            {renderApply()}
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <article className="card p-6 sm:p-8">
          <Section title="About the role">
            <p className="text-[17px] leading-relaxed text-ink-2">{job.summary}</p>
            <p className="mt-4 leading-relaxed text-ink-2">{job.about}</p>
          </Section>
          <Section title="What you'll do"><BulletList items={job.responsibilities} /></Section>
          <Section title="What we're looking for"><BulletList items={job.requirements} /></Section>
          {job.niceToHave && <Section title="Nice to have"><BulletList items={job.niceToHave} /></Section>}
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <Link key={s} to={`/jobs?q=${encodeURIComponent(s)}`} className="rounded-xl bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand-text transition hover:opacity-80">{s}</Link>
              ))}
            </div>
          </Section>
          {job.company.perks?.length > 0 && (
            <Section title="Perks & benefits">
              <div className="grid gap-3 sm:grid-cols-2">
                {job.company.perks.map((p) => (
                  <div key={p} className="flex items-center gap-3 rounded-xl border border-line p-3.5 text-sm font-medium text-ink">
                    <Gift className="size-4 shrink-0 text-brand-500" /> {p}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </article>

        <aside className="space-y-6">
          <div className="card space-y-5 p-6">
            <h2 className="font-bold text-ink">Job overview</h2>
            <Fact icon={CalendarDays} label="Date posted" value={formatDate(job.postedAt)} />
            <Fact icon={MapPin} label="Location" value={job.location} />
            <Fact icon={Globe2} label="Work mode" value={job.mode} />
            <Fact icon={Briefcase} label="Employment type" value={job.type} />
            <Fact icon={BarChart3} label="Experience" value={LEVEL_LABELS[job.level]} />
            <Fact icon={Wallet} label="Salary" value={`${formatSalary(job.salary)} / year`} />
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <CompanyLogo company={job.company} />
              <div className="min-w-0">
                <h2 className="truncate font-bold text-ink">{job.company.name}</h2>
                <p className="flex items-center gap-1 text-sm text-ink-2">
                  <Star className="size-3.5 fill-accent-500 text-accent-500" /> {job.company.rating}
                  {job.company.reviews > 0 && <span className="text-ink-3">· {job.company.reviews} reviews</span>}
                </p>
              </div>
            </div>
            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-ink-3">Industry</dt><dd className="font-medium text-ink">{job.company.industry}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-3">Company size</dt><dd className="font-medium text-ink">{job.company.size}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-3">Headquarters</dt><dd className="text-right font-medium text-ink">{job.company.hq}</dd></div>
            </dl>
            {knownCompany && (
              <Link to={`/companies/${job.companyId}`} className="btn btn-secondary mt-5 w-full">
                <Building2 className="size-4" /> View company
              </Link>
            )}
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-extrabold text-ink">Similar jobs</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {similar.map((j) => <JobCard key={j.id} job={j} className="[&_.chip]:hidden [&_.badge-amber]:!hidden" />)}
          </div>
        </section>
      )}

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-line bg-surface/90 p-3 backdrop-blur-xl md:hidden">
        <SaveButton jobId={job.id} className="!size-12 !rounded-2xl" />
        <div className="flex-1">{renderApply(true)}</div>
      </div>

      {user?.role === "candidate" && <ApplyModal job={job} open={applyOpen} onClose={() => setApplyOpen(false)} />}
    </div>
  );
};

export default JobDetailPage;
