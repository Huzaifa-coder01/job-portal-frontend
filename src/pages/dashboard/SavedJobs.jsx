import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useStore } from "../../hooks/useStore";
import JobCard from "../../components/jobs/JobCard";
import { EmptyState, PageHeader } from "../../components/ui/Common";

const SavedJobs = () => {
  const { savedIds, getJob } = useStore();
  const saved = savedIds.map(getJob).filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Saved jobs" title="Your shortlist" description="Roles you've bookmarked to come back to." />
      {saved.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing saved yet"
          description="Tap the bookmark on any job to keep it here for later."
          action={<Link to="/jobs" className="btn btn-primary">Browse jobs</Link>}
        />
      ) : (
        <div className="space-y-4">
          {saved.map((job, i) => <JobCard key={job.id} job={job} delay={i * 40} />)}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
