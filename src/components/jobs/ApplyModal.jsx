import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import Modal from "../ui/Modal";
import CompanyLogo from "../ui/CompanyLogo";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../hooks/useStore";

const ApplyModal = ({ job, open, onClose }) => {
  const { user } = useAuth();
  const { applyToJob } = useStore();
  const [resumeName, setResumeName] = useState(user?.resumeName ?? "");
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const close = () => {
    onClose();
    // Reset after the dialog is gone so reopening starts fresh.
    setTimeout(() => {
      setDone(false);
      setError("");
      setCoverLetter("");
    }, 200);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!resumeName) {
      setError("Please attach your resume to continue.");
      return;
    }
    setError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    applyToJob(job.id, { coverLetter, resumeName });
    setSubmitting(false);
    setDone(true);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={done ? "Application sent" : `Apply to ${job.company.name}`}
      description={done ? undefined : job.title}
    >
      {done ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="flex size-16 animate-pop items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
            <CheckCircle2 className="size-9" />
          </span>
          <h3 className="mt-5 text-xl font-bold text-ink">You&apos;re all set!</h3>
          <p className="mt-2 max-w-sm text-ink-2">
            Your application for <strong className="text-ink">{job.title}</strong> was sent to {job.company.name}. You can track its progress in your dashboard.
          </p>
          <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
            <Link to="/dashboard/applications" className="btn btn-primary flex-1" onClick={close}>Track application</Link>
            <button className="btn btn-secondary flex-1" onClick={close}>Keep browsing</button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <div className="flex items-center gap-3 rounded-xl bg-surface-2 p-3">
            <CompanyLogo company={job.company} size="sm" />
            <div className="min-w-0 text-sm">
              <p className="truncate font-semibold text-ink">{user.name}</p>
              <p className="truncate text-ink-3">{user.email}</p>
            </div>
          </div>

          <div>
            <span className="label">Resume</span>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3.5 transition hover:border-brand-400 hover:bg-brand-soft/40 ${error ? "border-red-400" : "border-line"}`}
            >
              {resumeName ? <FileText className="size-5 text-brand-text" /> : <Upload className="size-5 text-ink-3" />}
              <span className="flex-1 truncate text-sm">
                {resumeName ? <span className="font-semibold text-ink">{resumeName}</span> : <span className="text-ink-2">Upload a PDF or DOCX (max 5MB)</span>}
              </span>
              <span className="text-sm font-semibold text-brand-text">{resumeName ? "Replace" : "Browse"}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) => {
                  setResumeName(e.target.files?.[0]?.name ?? "");
                  setError("");
                }}
              />
            </label>
            {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
          </div>

          <div>
            <label htmlFor="cover" className="label">
              Cover letter <span className="font-normal text-ink-3">(optional)</span>
            </label>
            <textarea
              id="cover"
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder={`Tell ${job.company.name} why you're a great fit…`}
              className="field resize-none"
              maxLength={1500}
            />
            <p className="mt-1 text-right text-xs text-ink-3">{coverLetter.length}/1500</p>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
            {submitting ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : "Submit application"}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default ApplyModal;
