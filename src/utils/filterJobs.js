import { categoriesById } from "../data/categories";
import { daysSince } from "./helpers";

export const PAGE_SIZE = 8;

export const SORTS = [
  { id: "recent", label: "Most recent" },
  { id: "salary", label: "Highest salary" },
  { id: "relevance", label: "Most relevant" },
];

export const POSTED_OPTIONS = [
  { id: "", label: "Any time" },
  { id: "1", label: "Last 24 hours" },
  { id: "3", label: "Last 3 days" },
  { id: "7", label: "Last 7 days" },
  { id: "30", label: "Last 30 days" },
];

const list = (params, key) => (params.get(key) ?? "").split(",").filter(Boolean);

// Reads the filter state out of the URL so searches are shareable and
// the browser back button works.
export const readFilters = (params) => ({
  q: params.get("q") ?? "",
  location: params.get("location") ?? "",
  category: params.get("category") ?? "",
  types: list(params, "type"),
  modes: list(params, "mode"),
  levels: list(params, "level"),
  minSalary: Number(params.get("salary") ?? 0),
  posted: params.get("posted") ?? "",
  sort: params.get("sort") ?? "",
  page: Math.max(1, Number(params.get("page") ?? 1)),
});

const score = (job, terms) => {
  let s = 0;
  const title = job.title.toLowerCase();
  const company = job.company.name.toLowerCase();
  const skills = job.skills.map((x) => x.toLowerCase());
  for (const t of terms) {
    if (title.includes(t)) s += 10;
    if (skills.some((k) => k.includes(t))) s += 6;
    if (company.includes(t)) s += 4;
    if (categoriesById[job.category]?.label.toLowerCase().includes(t)) s += 2;
  }
  return s + (job.featured ? 1 : 0);
};

const matchesText = (job, terms) => {
  const hay = [
    job.title,
    job.company.name,
    job.skills.join(" "),
    categoriesById[job.category]?.label,
    job.type,
    job.level,
  ].join(" ").toLowerCase();
  return terms.every((t) => hay.includes(t));
};

export function filterJobs(jobs, f) {
  const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const loc = f.location.toLowerCase().trim();

  const result = jobs.filter((job) => {
    if (terms.length && !matchesText(job, terms)) return false;
    if (loc) {
      const inLocation = job.location.toLowerCase().includes(loc);
      const remoteQuery = loc.includes("remote") && job.mode === "Remote";
      if (!inLocation && !remoteQuery) return false;
    }
    if (f.category && job.category !== f.category) return false;
    if (f.types.length && !f.types.includes(job.type)) return false;
    if (f.modes.length && !f.modes.includes(job.mode)) return false;
    if (f.levels.length && !f.levels.includes(job.level)) return false;
    if (f.minSalary && job.salary.max < f.minSalary) return false;
    if (f.posted && daysSince(job.postedAt) > Number(f.posted)) return false;
    return true;
  });

  const sort = f.sort || (terms.length ? "relevance" : "recent");
  return result.sort((a, b) => {
    if (sort === "salary") return b.salary.max - a.salary.max;
    if (sort === "relevance") return score(b, terms) - score(a, terms) || new Date(b.postedAt) - new Date(a.postedAt);
    return new Date(b.postedAt) - new Date(a.postedAt);
  });
}

export const activeFilterCount = (f) =>
  [f.category, f.posted, f.minSalary].filter(Boolean).length + f.types.length + f.modes.length + f.levels.length;
