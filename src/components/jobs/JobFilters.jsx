import { JOB_TYPES, LEVELS, LEVEL_LABELS, WORK_MODES, categories } from "../../data/categories";
import { POSTED_OPTIONS } from "../../utils/filterJobs";

const Group = ({ title, children }) => (
  <fieldset className="border-b border-line py-5 first:pt-0 last:border-0 last:pb-0">
    <legend className="mb-3 text-sm font-bold text-ink">{title}</legend>
    <div className="space-y-2.5">{children}</div>
  </fieldset>
);

const Check = ({ label, checked, onChange, count, type = "checkbox", name }) => (
  <label className="group flex cursor-pointer items-center gap-2.5 text-sm text-ink-2 transition hover:text-ink">
    <input
      type={type}
      name={name}
      checked={checked}
      onChange={onChange}
      className="size-4 shrink-0 cursor-pointer accent-brand-600"
    />
    <span className="flex-1">{label}</span>
    {count !== undefined && <span className="text-xs text-ink-3">{count}</span>}
  </label>
);

// Pure, controlled panel. `filters` comes from readFilters; `update(patch)` writes to the URL.
const JobFilters = ({ filters, update, jobs, onClear, activeCount }) => {
  const toggle = (key, value) => {
    const current = filters[key];
    update({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });
  };
  const count = (pred) => jobs.filter(pred).length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between lg:mb-5">
        <h2 className="text-base font-bold text-ink">Filters</h2>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-sm font-semibold text-brand-text hover:underline">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <Group title="Category">
        <Check type="radio" name="category" label="All categories" checked={!filters.category} onChange={() => update({ category: "" })} />
        {categories.map((c) => (
          <Check
            key={c.id}
            type="radio"
            name="category"
            label={c.label}
            count={count((j) => j.category === c.id)}
            checked={filters.category === c.id}
            onChange={() => update({ category: c.id })}
          />
        ))}
      </Group>

      <Group title="Job type">
        {JOB_TYPES.map((t) => (
          <Check key={t} label={t} count={count((j) => j.type === t)} checked={filters.types.includes(t)} onChange={() => toggle("types", t)} />
        ))}
      </Group>

      <Group title="Work mode">
        {WORK_MODES.map((m) => (
          <Check key={m} label={m} count={count((j) => j.mode === m)} checked={filters.modes.includes(m)} onChange={() => toggle("modes", m)} />
        ))}
      </Group>

      <Group title="Experience level">
        {LEVELS.map((l) => (
          <Check key={l} label={LEVEL_LABELS[l]} count={count((j) => j.level === l)} checked={filters.levels.includes(l)} onChange={() => toggle("levels", l)} />
        ))}
      </Group>

      <Group title="Minimum salary">
        <input
          type="range"
          min={0}
          max={250}
          step={10}
          value={filters.minSalary}
          onChange={(e) => update({ minSalary: Number(e.target.value) })}
          className="w-full accent-brand-600"
          aria-label="Minimum salary in thousands"
        />
        <div className="flex justify-between text-xs font-medium text-ink-3">
          <span>Any</span>
          <span className="font-bold text-brand-text">{filters.minSalary ? `$${filters.minSalary}k+` : "No minimum"}</span>
          <span>$250k</span>
        </div>
      </Group>

      <Group title="Date posted">
        <select
          value={filters.posted}
          onChange={(e) => update({ posted: e.target.value })}
          className="field"
          aria-label="Date posted"
        >
          {POSTED_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </Group>
    </div>
  );
};

export default JobFilters;
