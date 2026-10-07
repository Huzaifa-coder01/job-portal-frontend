import { useState } from "react";
import toast from "react-hot-toast";
import { Building2, FileText, Mail, Plus, Save, Trash2, Upload } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Field from "../../components/ui/Field";
import TagInput from "../../components/ui/TagInput";
import { PageHeader } from "../../components/ui/Common";

const Card = ({ title, description, children }) => (
  <section className="card p-6 sm:p-7">
    <h2 className="text-lg font-bold text-ink">{title}</h2>
    {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
    <div className="mt-6 space-y-5">{children}</div>
  </section>
);

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const isCandidate = user.role === "candidate";
  const [form, setForm] = useState({
    name: user.name,
    headline: user.headline ?? "",
    location: user.location ?? "",
    phone: user.phone ?? "",
    bio: user.bio ?? "",
    skills: user.skills ?? [],
    experience: user.experience ?? [],
    resumeName: user.resumeName ?? "",
    openToWork: user.openToWork ?? false,
  });
  const [newExp, setNewExp] = useState({ title: "", company: "", period: "" });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const addExperience = () => {
    if (!newExp.title.trim() || !newExp.company.trim()) {
      toast.error("Add a job title and company first.");
      return;
    }
    setForm({ ...form, experience: [{ ...newExp, description: "" }, ...form.experience] });
    setNewExp({ title: "", company: "", period: "" });
  };

  const save = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("Please enter your name.");
      return;
    }
    updateProfile(form);
    toast.success("Profile saved");
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <PageHeader
        eyebrow={isCandidate ? "My profile" : "Account"}
        title={isCandidate ? "Your professional profile" : "Account settings"}
        description={isCandidate ? "Keep this up to date — it's what employers see when you apply." : "Manage your personal details."}
      >
        <button type="submit" className="btn btn-primary"><Save className="size-4" /> Save changes</button>
      </PageHeader>

      <Card title="Basic information">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="name" label="Full name" value={form.name} onChange={set("name")} />
          <Field id="headline" label={isCandidate ? "Professional headline" : "Job title"} placeholder={isCandidate ? "e.g. Senior Product Designer" : "e.g. Head of Talent"} value={form.headline} onChange={set("headline")} />
          <Field id="location" label="Location" placeholder="City, State" value={form.location} onChange={set("location")} />
          {isCandidate && <Field id="phone" label="Phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} />}
        </div>
        <div>
          <span className="label">Email</span>
          <div className="field flex items-center gap-2.5 !bg-surface-2 text-ink-2"><Mail className="size-4" /> {user.email}</div>
        </div>
        {!isCandidate && (
          <div>
            <span className="label">Company</span>
            <div className="field flex items-center gap-2.5 !bg-surface-2 text-ink-2"><Building2 className="size-4" /> {user.companyName}</div>
          </div>
        )}
      </Card>

      {isCandidate && (
        <>
          <Card title="About you" description="A few sentences that tell your story.">
            <div>
              <label htmlFor="bio" className="label">Bio</label>
              <textarea id="bio" rows={5} value={form.bio} onChange={set("bio")} maxLength={600} className="field resize-none" placeholder="What are you great at? What are you looking for next?" />
              <p className="mt-1 text-right text-xs text-ink-3">{form.bio.length}/600</p>
            </div>
            <div>
              <label htmlFor="skills" className="label">Skills</label>
              <TagInput id="skills" value={form.skills} onChange={(skills) => setForm({ ...form, skills })} />
              <p className="mt-1.5 text-xs text-ink-3">Press Enter to add. Skills power your job recommendations.</p>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line p-4">
              <div>
                <p className="font-semibold text-ink">Open to work</p>
                <p className="text-sm text-ink-2">Let recruiters know you&apos;re available for new roles.</p>
              </div>
              <input
                type="checkbox" role="switch" checked={form.openToWork}
                onChange={(e) => setForm({ ...form, openToWork: e.target.checked })}
                className="relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-line transition checked:bg-brand-600 before:absolute before:left-0.5 before:top-0.5 before:size-5 before:rounded-full before:bg-white before:shadow before:transition checked:before:translate-x-5"
              />
            </label>
          </Card>

          <Card title="Work experience">
            <div className="grid gap-3 rounded-xl bg-surface-2 p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
              <Field id="exp-title" label="Title" value={newExp.title} onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} />
              <Field id="exp-company" label="Company" value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} />
              <Field id="exp-period" label="Period" placeholder="2021 – 2024" value={newExp.period} onChange={(e) => setNewExp({ ...newExp, period: e.target.value })} />
              <button type="button" onClick={addExperience} className="btn btn-secondary"><Plus className="size-4" /> Add</button>
            </div>
            {form.experience.length === 0 && <p className="text-sm text-ink-3">No experience added yet.</p>}
            <ul className="space-y-3">
              {form.experience.map((exp, i) => (
                <li key={`${exp.title}-${i}`} className="flex items-start justify-between gap-4 rounded-xl border border-line p-4">
                  <div>
                    <p className="font-semibold text-ink">{exp.title} <span className="font-normal text-ink-2">· {exp.company}</span></p>
                    <p className="text-sm text-ink-3">{exp.period}</p>
                    {exp.description && <p className="mt-1.5 text-sm text-ink-2">{exp.description}</p>}
                  </div>
                  <button
                    type="button" aria-label={`Remove ${exp.title}`}
                    onClick={() => setForm({ ...form, experience: form.experience.filter((_, j) => j !== i) })}
                    className="rounded-lg p-2 text-ink-3 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Resume">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line px-4 py-4 transition hover:border-brand-400 hover:bg-brand-soft/40">
              {form.resumeName ? <FileText className="size-5 text-brand-text" /> : <Upload className="size-5 text-ink-3" />}
              <span className="flex-1 truncate text-sm font-semibold text-ink">{form.resumeName || "Upload your resume (PDF or DOCX)"}</span>
              <span className="text-sm font-semibold text-brand-text">{form.resumeName ? "Replace" : "Browse"}</span>
              <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => e.target.files?.[0] && setForm({ ...form, resumeName: e.target.files[0].name })} />
            </label>
          </Card>
        </>
      )}
    </form>
  );
};

export default Profile;
