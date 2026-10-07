import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Briefcase, ExternalLink, PlusCircle, Trash2, Users } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import Modal from "../../components/ui/Modal";
import CompanyLogo from "../../components/ui/CompanyLogo";
import { EmptyState, PageHeader } from "../../components/ui/Common";
import { formatDate, formatSalary } from "../../utils/helpers";

const MyJobs = () => {
  const { employerJobs, getApplicants, closeJob } = useStore();
  const [toClose, setToClose] = useState(null);

  const confirmClose = () => {
    closeJob(toClose.id);
    toast.success(`“${toClose.title}” has been closed`);
    setToClose(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Listings" title="Your job listings" description="Manage the roles you're currently hiring for.">
        <Link to="/dashboard/post" className="btn btn-primary"><PlusCircle className="size-4" /> Post a job</Link>
      </PageHeader>

      {employerJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No active listings"
          description="Post your first job and start receiving applications within minutes."
          action={<Link to="/dashboard/post" className="btn btn-primary">Post a job</Link>}
        />
      ) : (
        <div className="space-y-4">
          {employerJobs.map((job) => {
            const count = getApplicants(job.id).length;
            return (
              <article key={job.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <CompanyLogo company={job.company} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-bold text-ink">{job.title}</h2>
                    <span className="badge badge-green">Active</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-3">
                    {job.location} · {job.type} · {formatSalary(job.salary)} · Posted {formatDate(job.postedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/dashboard/applicants?job=${job.id}`} className="btn btn-secondary btn-sm">
                    <Users className="size-4" /> {count} applicants
                  </Link>
                  <Link to={`/jobs/${job.id}`} className="icon-btn !size-9" aria-label={`View ${job.title}`}>
                    <ExternalLink className="size-4" />
                  </Link>
                  <button onClick={() => setToClose(job)} className="icon-btn !size-9 hover:!border-red-300 hover:!text-red-600" aria-label={`Close ${job.title}`}>
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal open={Boolean(toClose)} onClose={() => setToClose(null)} title="Close this listing?" description={toClose?.title}>
        <p className="text-ink-2">
          The job will be removed from search results and candidates will no longer be able to apply. This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn btn-secondary" onClick={() => setToClose(null)}>Keep it open</button>
          <button className="btn btn-primary !bg-red-600 hover:!bg-red-700" onClick={confirmClose}>Close listing</button>
        </div>
      </Modal>
    </div>
  );
};

export default MyJobs;
