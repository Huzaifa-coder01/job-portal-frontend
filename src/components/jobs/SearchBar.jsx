import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { cn } from "../../utils/helpers";

// Keyword + location search. Calls onSearch({ q, location }).
const SearchBar = ({ initialQuery = "", initialLocation = "", onSearch, className, size = "lg" }) => {
  const [q, setQ] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const submit = (e) => {
    e.preventDefault();
    onSearch({ q: q.trim(), location: location.trim() });
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-line bg-surface p-2 sm:flex-row sm:items-center",
        size === "lg" && "sm:rounded-full sm:p-2.5",
        className,
      )}
      style={{ boxShadow: "var(--shadow-pop)" }}
    >
      <label className="flex flex-1 items-center gap-3 px-3.5 py-2">
        <Search className="size-5 shrink-0 text-ink-3" />
        <span className="sr-only">Job title, skill or company</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Job title, skill or company"
          className="w-full bg-transparent text-[15px] text-ink placeholder:text-ink-3 focus:outline-none"
        />
      </label>
      <div className="hidden h-8 w-px bg-line sm:block" />
      <div className="h-px bg-line sm:hidden" />
      <label className="flex flex-1 items-center gap-3 px-3.5 py-2">
        <MapPin className="size-5 shrink-0 text-ink-3" />
        <span className="sr-only">City, state or "remote"</span>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder='City, state or "remote"'
          className="w-full bg-transparent text-[15px] text-ink placeholder:text-ink-3 focus:outline-none"
        />
      </label>
      <button type="submit" className={cn("btn btn-primary", size === "lg" ? "btn-lg sm:rounded-full" : "")}>
        Search jobs
      </button>
    </form>
  );
};

export default SearchBar;
