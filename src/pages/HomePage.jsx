import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, BellRing, Briefcase, Building2, CheckCircle2, ChevronDown, FileText,
  Quote, Search, ShieldCheck, Star, TrendingUp, Users, Zap,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";
import SearchBar from "../components/jobs/SearchBar";
import JobCard from "../components/jobs/JobCard";
import CompanyLogo from "../components/ui/CompanyLogo";
import { Avatar, SectionHeading } from "../components/ui/Common";
import { categories } from "../data/categories";
import { companies } from "../data/companies";
import { faqs, testimonials } from "../data/people";
import { cn } from "../utils/helpers";

const POPULAR = ["React", "Product Designer", "Remote", "Data Scientist", "Internship"];

const Hero = () => {
  const navigate = useNavigate();
  const { jobs } = useStore();

  const onSearch = ({ q, location }) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    navigate(`/jobs?${params}`);
  };

  const mids = jobs.map((j) => (j.salary.min + j.salary.max) / 2).sort((a, b) => a - b);
  const median = mids[Math.floor(mids.length / 2)] ?? 0;
  const stats = [
    [jobs.length, "Open positions"],
    [companies.length, "Companies hiring"],
    [`$${Math.round(median)}k`, "Median salary"],
    [`${Math.round((jobs.filter((j) => j.mode === "Remote").length / Math.max(jobs.length, 1)) * 100)}%`, "Fully remote"],
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-24 -z-10 size-[360px] rounded-full bg-pink-400/20 blur-[110px]" />

      {/* Floating product teasers (large screens only) */}
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto hidden max-w-[1400px] xl:block" aria-hidden="true">
        <div className="absolute left-8 top-10 w-64 -rotate-3 animate-float card p-4">
          <div className="flex items-center gap-3">
            <CompanyLogo company={companies[2]} size="sm" />
            <div>
              <p className="text-sm font-bold text-ink">Full-Stack Engineer</p>
              <p className="text-xs text-ink-3">Stackwise · Remote</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="badge badge-green"><Zap className="size-3" />96% match</span>
            <span className="font-semibold text-ink-2">$130k – $165k</span>
          </div>
        </div>
        <div className="absolute right-10 top-28 w-60 rotate-3 animate-float card p-4 [animation-delay:-3s]">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
              <CheckCircle2 className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Offer received 🎉</p>
              <p className="text-xs text-ink-3">Atlas Cloud · just now</p>
            </div>
          </div>
        </div>
        <div className="absolute left-24 top-[300px] animate-float card flex items-center gap-2.5 px-3.5 py-2.5 [animation-delay:-5s]">
          <BellRing className="size-4 text-brand-text" />
          <span className="text-xs font-semibold text-ink">12 new jobs match your alerts</span>
        </div>
      </div>

      <div className="container-x pb-20 pt-14 text-center sm:pt-20">
        <div className="mx-auto inline-flex animate-fade-up items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-ink-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          {jobs.length} live roles from {companies.length} hiring teams
        </div>

        <h1
          className="mx-auto mt-6 max-w-4xl animate-fade-up text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Find work you&apos;ll <span className="text-gradient whitespace-nowrap">actually love.</span>
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-2 sm:text-xl"
          style={{ animationDelay: "160ms" }}
        >
          Discover remote, hybrid and on-site roles at companies that publish their salaries —
          and apply in minutes, not hours.
        </p>

        <div className="mx-auto mt-10 max-w-3xl animate-fade-up" style={{ animationDelay: "240ms" }}>
          <SearchBar onSearch={onSearch} />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-ink-3">Popular:</span>
            {POPULAR.map((term) => (
              <Link
                key={term}
                to={term === "Remote" ? "/jobs?mode=Remote" : term === "Internship" ? "/jobs?type=Internship" : `/jobs?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-line bg-surface px-3 py-1 font-medium text-ink-2 transition hover:border-brand-300 hover:text-brand-text"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label}>
              <dd className="text-3xl font-extrabold tracking-tight text-ink">{value}</dd>
              <dt className="mt-1 text-sm font-normal text-ink-3">{label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

const TrustedBy = () => (
  <section className="border-y border-line bg-surface/60 py-8">
    <div className="container-x">
      <p className="text-center text-sm font-semibold text-ink-3">Hiring now at fast-growing teams</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {companies.slice(0, 8).map((c) => (
          <Link
            key={c.id}
            to={`/companies/${c.id}`}
            className="flex items-center gap-2.5 text-ink-3 grayscale transition hover:text-ink hover:grayscale-0"
          >
            <CompanyLogo company={c} size="sm" />
            <span className="text-[15px] font-bold">{c.name}</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const Categories = () => {
  const { jobs } = useStore();
  return (
    <section className="container-x py-20">
      <SectionHeading
        eyebrow="Browse by category"
        title="Explore roles that fit your craft"
        description="From engineering to healthcare — find opportunities across every discipline."
        action={
          <Link to="/jobs" className="btn btn-secondary">
            All categories <ArrowRight className="size-4" />
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat, i) => {
          const count = jobs.filter((j) => j.category === cat.id).length;
          return (
            <Link
              key={cat.id}
              to={`/jobs?category=${cat.id}`}
              className="card card-hover group animate-fade-up p-5"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className={cn("flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition group-hover:scale-105", cat.tint)}>
                <cat.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-ink">{cat.label}</h3>
              <p className="mt-0.5 text-sm text-ink-3">{count} open {count === 1 ? "role" : "roles"}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

const FeaturedJobs = () => {
  const { jobs } = useStore();
  const featured = jobs.filter((j) => j.featured).slice(0, 6);
  return (
    <section className="bg-surface-2/60 py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow="Featured opportunities"
          title="Hand-picked roles, updated daily"
          action={
            <Link to="/jobs" className="btn btn-secondary">
              View all jobs <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {featured.map((job, i) => (
            <JobCard key={job.id} job={job} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
};

const STEPS = [
  { icon: FileText, title: "Create your profile", text: "Add your skills and experience once. Reuse it for every application." },
  { icon: Search, title: "Discover & compare", text: "Filter by salary, work mode and level to find roles that truly fit." },
  { icon: BadgeCheck, title: "Apply & get hired", text: "Apply in one click, track every stage and hear back faster." },
];

const HowItWorks = () => (
  <section className="container-x py-20">
    <SectionHeading eyebrow="How it works" title="From profile to offer in three steps" center />
    <div className="relative grid gap-6 md:grid-cols-3">
      {STEPS.map((step, i) => (
        <div key={step.title} className="card relative p-7">
          <span className="absolute right-6 top-5 text-5xl font-extrabold text-surface-2">{i + 1}</span>
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-text">
            <step.icon className="size-6" />
          </span>
          <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
          <p className="mt-2 leading-relaxed text-ink-2">{step.text}</p>
        </div>
      ))}
    </div>
  </section>
);

const EmployerBand = () => {
  const { user } = useAuth();
  return (
    <section className="container-x">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-[#8d3df0] px-6 py-14 text-white sm:px-14">
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">For employers</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Hire exceptional people, faster.</h2>
            <p className="mt-4 max-w-md text-lg text-white/80">
              Post a role in two minutes, review a clean applicant pipeline and move great candidates forward — all in one place.
            </p>
            <ul className="mt-6 space-y-3">
              {["Unlimited job posts for early teams", "Smart applicant pipeline & match scores", "Reach 2M+ active candidates"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 font-medium">
                  <CheckCircle2 className="size-5 text-accent-400" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={user?.role === "employer" ? "/dashboard/post" : "/signup?role=employer"}
                className="btn btn-lg bg-white text-brand-700 hover:bg-brand-50"
              >
                Post a job <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="hidden lg:block" aria-hidden="true">
            <div className="ml-auto max-w-sm rounded-2xl bg-white p-5 text-ink shadow-2xl [transform:rotate(2deg)]">
              <p className="text-sm font-bold">Senior Product Manager · 38 applicants</p>
              <div className="mt-4 space-y-3">
                {[["Amelia Foster", 94, "Interview"], ["Omar Haddad", 90, "In Review"], ["Priya Nair", 89, "Applied"]].map(([n, m, s]) => (
                  <div key={n} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
                    <Avatar name={n} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{n}</p>
                      <p className="text-xs text-slate-500">{s}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">{m}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TopCompanies = () => (
  <section className="container-x py-20">
    <SectionHeading
      eyebrow="Top employers"
      title="Companies people love working at"
      action={
        <Link to="/companies" className="btn btn-secondary">
          All companies <ArrowRight className="size-4" />
        </Link>
      }
    />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...companies].sort((a, b) => b.rating - a.rating).slice(0, 6).map((c) => (
        <Link key={c.id} to={`/companies/${c.id}`} className="card card-hover p-5">
          <div className="flex items-center gap-4">
            <CompanyLogo company={c} size="lg" />
            <div className="min-w-0">
              <h3 className="truncate font-bold text-ink">{c.name}</h3>
              <p className="truncate text-sm text-ink-2">{c.industry}</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-ink">
                <Star className="size-3.5 fill-accent-500 text-accent-500" /> {c.rating}
                <span className="font-normal text-ink-3">({c.reviews} reviews)</span>
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

const Testimonials = () => (
  <section className="bg-surface-2/60 py-20">
    <div className="container-x">
      <SectionHeading eyebrow="Loved by thousands" title="Real people. Real results." center />
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="card flex flex-col p-7">
            <Quote className="size-8 text-brand-300" />
            <blockquote className="mt-4 flex-1 leading-relaxed text-ink-2">{t.quote}</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <Avatar name={t.name} colors={t.colors} />
              <div>
                <p className="font-bold text-ink">{t.name}</p>
                <p className="text-sm text-ink-3">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

const Trust = () => (
  <section className="container-x py-20">
    <div className="grid gap-6 md:grid-cols-3">
      {[
        [ShieldCheck, "Verified employers", "Every company is reviewed so you never waste time on fake listings."],
        [TrendingUp, "Salary transparency", "Every role shows a pay range up front. No more guessing games."],
        [Users, "Human-first hiring", "Direct lines to hiring teams — not black-hole application forms."],
      ].map(([Icon, title, text]) => (
        <div key={title} className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-text">
            <Icon className="size-5" />
          </span>
          <div>
            <h3 className="font-bold text-ink">{title}</h3>
            <p className="mt-1 text-ink-2">{text}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <section className="container-x pb-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" center />
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="card overflow-hidden">
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold text-ink"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                {f.q}
                <ChevronDown className={cn("size-5 shrink-0 text-ink-3 transition", open === i && "rotate-180")} />
              </button>
              {open === i && <p className="animate-fade-in px-6 pb-5 leading-relaxed text-ink-2">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCta = () => {
  const { user } = useAuth();
  return (
    <section className="container-x">
      <div className="card flex flex-col items-center gap-6 px-6 py-14 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-text">
          <Briefcase className="size-7" />
        </span>
        <h2 className="max-w-xl text-3xl font-extrabold text-ink sm:text-4xl">Your next chapter starts here.</h2>
        <p className="max-w-lg text-lg text-ink-2">Join over two million professionals discovering better work on Hirova.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to={user ? "/jobs" : "/signup"} className="btn btn-primary btn-lg">
            {user ? "Browse jobs" : "Create free account"} <ArrowRight className="size-4" />
          </Link>
          <Link to="/companies" className="btn btn-secondary btn-lg"><Building2 className="size-4" /> Explore companies</Link>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => (
  <>
    <Hero />
    <TrustedBy />
    <Categories />
    <FeaturedJobs />
    <HowItWorks />
    <EmployerBand />
    <TopCompanies />
    <Testimonials />
    <Trust />
    <FAQ />
    <FinalCta />
  </>
);

export default HomePage;
