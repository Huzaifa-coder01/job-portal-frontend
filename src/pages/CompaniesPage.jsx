import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Building2, MapPin, Search, SearchX, Star, Users } from "lucide-react";
import { useStore } from "../hooks/useStore";
import CompanyLogo from "../components/ui/CompanyLogo";
import { EmptyState, PageHeader } from "../components/ui/Common";
import { companies } from "../data/companies";
import { cn } from "../utils/helpers";

const industries = ["All", ...new Set(companies.map((c) => c.industry))];

const CompaniesPage = () => {
  const { jobs } = useStore();
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");

  const list = useMemo(
    () =>
      companies.filter(
        (c) =>
          (industry === "All" || c.industry === industry) &&
          `${c.name} ${c.industry} ${c.hq}`.toLowerCase().includes(query.toLowerCase().trim()),
      ),
    [query, industry],
  );

  return (
    <div className="container-x py-10">
      <PageHeader
        eyebrow="Companies"
        title="Discover great places to work"
        description="Learn about culture, perks and open roles at the teams hiring on Hirova."
      />

      <div className="mt-8 flex flex-col gap-4">
        <label className="relative block max-w-md">
          <span className="sr-only">Search companies</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-ink-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, industries or cities"
            className="field !pl-10"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {industries.map((i) => (
            <button
              key={i}
              onClick={() => setIndustry(i)}
              aria-pressed={industry === i}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
                industry === i
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-line bg-surface text-ink-2 hover:border-brand-300 hover:text-ink",
              )}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {list.length === 0 ? (
          <EmptyState icon={SearchX} title="No companies found" description="Try a different search or clear the industry filter." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c, i) => {
              const open = jobs.filter((j) => j.companyId === c.id).length;
              return (
                <Link
                  key={c.id}
                  to={`/companies/${c.id}`}
                  className="card card-hover group flex animate-fade-up flex-col p-6"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <CompanyLogo company={c} size="lg" />
                    <ArrowUpRight className="size-5 text-ink-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-text" />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-ink">{c.name}</h2>
                  <p className="mt-1 line-clamp-2 flex-1 text-sm text-ink-2">{c.tagline}</p>
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-ink-2">
                    <span className="inline-flex items-center gap-1.5"><Building2 className="size-3.5 text-ink-3" />{c.industry}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-ink-3" />{c.hq}</span>
                    <span className="inline-flex items-center gap-1.5"><Users className="size-3.5 text-ink-3" />{c.size}</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <span className="flex items-center gap-1 text-sm font-bold text-ink">
                      <Star className="size-4 fill-accent-500 text-accent-500" /> {c.rating}
                    </span>
                    <span className={cn("badge", open ? "badge-brand" : "badge-neutral")}>
                      {open} open {open === 1 ? "role" : "roles"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
