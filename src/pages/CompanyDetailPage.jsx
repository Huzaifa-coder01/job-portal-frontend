import { Link, useParams } from "react-router-dom";
import { Building2, CalendarDays, Gift, MapPin, SearchX, Star, Users } from "lucide-react";
import { useStore } from "../hooks/useStore";
import CompanyLogo from "../components/ui/CompanyLogo";
import JobCard from "../components/jobs/JobCard";
import { Breadcrumbs, EmptyState } from "../components/ui/Common";
import { companiesById } from "../data/companies";

const CompanyDetailPage = () => {
  const { id } = useParams();
  const { jobs } = useStore();
  const company = companiesById[id];

  if (!company) {
    return (
      <div className="container-x py-24">
        <EmptyState
          icon={SearchX}
          title="Company not found"
          description="We couldn't find the company you were looking for."
          action={<Link to="/companies" className="btn btn-primary">Browse companies</Link>}
        />
      </div>
    );
  }

  const openJobs = jobs.filter((j) => j.companyId === company.id);

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ label: "Companies", to: "/companies" }, { label: company.name }]} />

      <header className="card overflow-hidden">
        <div
          className="h-36 sm:h-48"
          style={{ backgroundImage: `linear-gradient(120deg, ${company.colors[0]}, ${company.colors[1]})` }}
        >
          <div className="size-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
        </div>
        <div className="px-6 pb-7 sm:px-8">
          <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <CompanyLogo company={company} size="xl" className="!ring-4 !ring-surface" />
              <div>
                <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{company.name}</h1>
                <p className="mt-1 text-ink-2">{company.tagline}</p>
              </div>
            </div>
            <a href="#open-roles" className="btn btn-primary">
              View {openJobs.length} open {openJobs.length === 1 ? "role" : "roles"}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-ink-2">
            <span className="inline-flex items-center gap-2"><Building2 className="size-4 text-ink-3" />{company.industry}</span>
            <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-ink-3" />{company.hq}</span>
            <span className="inline-flex items-center gap-2"><Users className="size-4 text-ink-3" />{company.size} employees</span>
            <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-ink-3" />Founded {company.founded}</span>
            <span className="inline-flex items-center gap-2 font-semibold text-ink">
              <Star className="size-4 fill-accent-500 text-accent-500" />{company.rating} <span className="font-normal text-ink-3">({company.reviews} reviews)</span>
            </span>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <section className="card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink">About {company.name}</h2>
            <p className="mt-3 leading-relaxed text-ink-2">{company.about}</p>
          </section>

          <section id="open-roles" className="scroll-mt-24">
            <h2 className="mb-5 text-xl font-bold text-ink">Open roles ({openJobs.length})</h2>
            {openJobs.length ? (
              <div className="space-y-4">
                {openJobs.map((j) => <JobCard key={j.id} job={j} />)}
              </div>
            ) : (
              <EmptyState icon={SearchX} title="No open roles right now" description="Check back soon — this team is always growing." />
            )}
          </section>
        </div>

        <aside>
          <div className="card sticky top-24 p-6">
            <h2 className="flex items-center gap-2 font-bold text-ink"><Gift className="size-[18px] text-brand-500" /> Perks & benefits</h2>
            <ul className="mt-4 space-y-3">
              {company.perks.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-ink-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />{p}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
