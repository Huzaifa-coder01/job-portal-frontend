import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX, SlidersHorizontal, X } from "lucide-react";
import { useStore } from "../hooks/useStore";
import JobCard from "../components/jobs/JobCard";
import JobFilters from "../components/jobs/JobFilters";
import SearchBar from "../components/jobs/SearchBar";
import Modal from "../components/ui/Modal";
import { EmptyState, Pagination } from "../components/ui/Common";
import { categoriesById } from "../data/categories";
import { PAGE_SIZE, SORTS, activeFilterCount, filterJobs, readFilters } from "../utils/filterJobs";
import { pluralize } from "../utils/helpers";

const KEYS = { types: "type", modes: "mode", levels: "level", minSalary: "salary" };

const JobsPage = () => {
  const { jobs } = useStore();
  const [params, setParams] = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const filters = readFilters(params);

  // Merge a patch into the URL (arrays are comma-separated; empty values are dropped).
  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      const param = KEYS[key] ?? key;
      const empty = Array.isArray(value) ? value.length === 0 : !value;
      if (empty) next.delete(param);
      else next.set(param, Array.isArray(value) ? value.join(",") : String(value));
    });
    if (!("page" in patch)) next.delete("page");
    setParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (filters.q) next.set("q", filters.q);
    if (filters.location) next.set("location", filters.location);
    setParams(next, { replace: true });
  };

  const results = filterJobs(jobs, filters);
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount = activeFilterCount(filters);

  const chips = [
    filters.category && { label: categoriesById[filters.category]?.label, clear: () => update({ category: "" }) },
    ...filters.types.map((t) => ({ label: t, clear: () => update({ types: filters.types.filter((x) => x !== t) }) })),
    ...filters.modes.map((m) => ({ label: m, clear: () => update({ modes: filters.modes.filter((x) => x !== m) }) })),
    ...filters.levels.map((l) => ({ label: l, clear: () => update({ levels: filters.levels.filter((x) => x !== l) }) })),
    filters.minSalary > 0 && { label: `$${filters.minSalary}k+`, clear: () => update({ minSalary: 0 }) },
    filters.posted && { label: `Last ${filters.posted === "1" ? "24h" : filters.posted + " days"}`, clear: () => update({ posted: "" }) },
  ].filter(Boolean);

  const changePage = (p) => {
    update({ page: p === 1 ? "" : p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterPanel = (
    <JobFilters filters={filters} update={update} jobs={jobs} onClear={clearFilters} activeCount={activeCount} />
  );

  return (
    <div>
      <section className="border-b border-line bg-surface/60">
        <div className="container-x py-10">
          <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Find your next job</h1>
          <p className="mt-2 text-ink-2">Browse {jobs.length} open roles with transparent salaries.</p>
          <SearchBar
            key={`${filters.q}|${filters.location}`}
            size="md"
            className="mt-6 max-w-4xl"
            initialQuery={filters.q}
            initialLocation={filters.location}
            onSearch={({ q, location }) => update({ q, location })}
          />
        </div>
      </section>

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-5">{filterPanel}</div>
        </aside>

        <section aria-live="polite">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-2">
              <span className="font-bold text-ink">{pluralize(results.length, "job")}</span> found
              {filters.q && <> for &ldquo;<span className="font-semibold text-ink">{filters.q}</span>&rdquo;</>}
            </p>
            <div className="flex items-center gap-2">
              <button className="btn btn-secondary btn-sm lg:hidden" onClick={() => setSheetOpen(true)}>
                <SlidersHorizontal className="size-4" /> Filters{activeCount > 0 && ` (${activeCount})`}
              </button>
              <label className="flex items-center gap-2 text-sm text-ink-2">
                <span className="hidden sm:inline">Sort by</span>
                <select
                  value={filters.sort || (filters.q ? "relevance" : "recent")}
                  onChange={(e) => update({ sort: e.target.value })}
                  className="field !w-auto !py-1.5"
                >
                  {SORTS.filter((s) => s.id !== "relevance" || filters.q).map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button key={c.label} onClick={c.clear} className="badge badge-brand transition hover:opacity-80" aria-label={`Remove filter ${c.label}`}>
                  {c.label} <X className="size-3" />
                </button>
              ))}
            </div>
          )}

          {visible.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No jobs match your search"
              description="Try removing a filter, checking your spelling, or searching for something broader."
              action={<button onClick={() => setParams({}, { replace: true })} className="btn btn-primary">Reset search</button>}
            />
          ) : (
            <div className="space-y-4">
              {visible.map((job, i) => (
                <JobCard key={job.id} job={job} delay={i * 40} />
              ))}
            </div>
          )}

          <Pagination page={page} pages={pages} onChange={changePage} />
        </section>
      </div>

      <Modal open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter jobs">
        {filterPanel}
        <button className="btn btn-primary mt-6 w-full" onClick={() => setSheetOpen(false)}>
          Show {pluralize(results.length, "job")}
        </button>
      </Modal>
    </div>
  );
};

export default JobsPage;
