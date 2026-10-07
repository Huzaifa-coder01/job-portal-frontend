import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, Rocket } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import Field from "../../components/ui/Field";
import TagInput from "../../components/ui/TagInput";
import { PageHeader } from "../../components/ui/Common";
import { JOB_TYPES, LEVELS, LEVEL_LABELS, WORK_MODES, categories } from "../../data/categories";

const initial = {
  title: "",
  category: "engineering",
  type: "Full-time",
  mode: "Hybrid",
  level: "Mid",
  location: "",
  salaryMin: "",
  salaryMax: "",
  skills: [],
  description: "",
};

const Select = ({ id, label, value, onChange, options }) => (
  <div>
    <label htmlFor={id} className="label">{label}</label>
    <select id={id} value={value} onChange={onChange} className="field">
      {options.map((o) => {
        const [val, text] = Array.isArray(o) ? o : [o, o];
        return <option key={val} value={val}>{text}</option>;
      })}
    </select>
  </div>
);

const PostJob = () => {
  const { postJob } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (form.title.trim().length < 3) found.title = "Enter a clear job title.";
    if (!form.location.trim()) found.location = "Where is this role based?";
    const min = Number(form.salaryMin);
    const max = Number(form.salaryMax);
    if (!min || min < 1) found.salaryMin = "Required";
    if (!max || max < 1) found.salaryMax = "Required";
    else if (min && max < min) found.salaryMax = "Must be at least the minimum.";
    if (form.skills.length === 0) found.skills = "Add at least one skill.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const job = postJob({ ...form, title: form.title.trim(), location: form.location.trim() });
    toast.success("Your job is live! 🚀");
    navigate(`/jobs/${job.id}`);
  };

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <PageHeader eyebrow="New listing" title="Post a job" description="Fill in the details below — your listing goes live instantly." />

      <section className="card space-y-5 p-6 sm:p-7">
        <Field id="title" label="Job title" placeholder="e.g. Senior Product Designer" value={form.title} onChange={set("title")} error={errors.title} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select id="category" label="Category" value={form.category} onChange={set("category")} options={categories.map((c) => [c.id, c.label])} />
          <Select id="level" label="Experience level" value={form.level} onChange={set("level")} options={LEVELS.map((l) => [l, LEVEL_LABELS[l]])} />
          <Select id="type" label="Employment type" value={form.type} onChange={set("type")} options={JOB_TYPES} />
          <Select id="mode" label="Work mode" value={form.mode} onChange={set("mode")} options={WORK_MODES} />
        </div>
        <Field id="location" label="Location" placeholder={form.mode === "Remote" ? "e.g. Remote (US)" : "e.g. Boston, MA"} value={form.location} onChange={set("location")} error={errors.location} />
      </section>

      <section className="card space-y-5 p-6 sm:p-7">
        <div>
          <h2 className="font-bold text-ink">Compensation</h2>
          <p className="mt-1 text-sm text-ink-2">Annual salary in thousands (USD). Listings with pay ranges get 2× more applications.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="salaryMin" label="Minimum ($k)" type="number" min="1" placeholder="90" value={form.salaryMin} onChange={set("salaryMin")} error={errors.salaryMin} />
          <Field id="salaryMax" label="Maximum ($k)" type="number" min="1" placeholder="120" value={form.salaryMax} onChange={set("salaryMax")} error={errors.salaryMax} />
        </div>
      </section>

      <section className="card space-y-5 p-6 sm:p-7">
        <div>
          <label htmlFor="skills" className="label">Required skills</label>
          <TagInput id="skills" value={form.skills} onChange={(skills) => setForm({ ...form, skills })} placeholder="Type a skill and press Enter" />
          {errors.skills && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{errors.skills}</p>}
        </div>
        <div>
          <label htmlFor="description" className="label">Role summary <span className="font-normal text-ink-3">(optional)</span></label>
          <textarea
            id="description" rows={5} maxLength={800} value={form.description} onChange={set("description")}
            placeholder="Describe the role and what success looks like. We'll fill in standard responsibilities and requirements for you."
            className="field resize-none"
          />
          <p className="mt-1 text-right text-xs text-ink-3">{form.description.length}/800</p>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard/jobs")}>Cancel</button>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
          {submitting ? <><Loader2 className="size-4 animate-spin" /> Publishing…</> : <><Rocket className="size-4" /> Publish job</>}
        </button>
      </div>
    </form>
  );
};

export default PostJob;
