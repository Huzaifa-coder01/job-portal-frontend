import { Link } from "react-router-dom";
import { Clock, MapPin, Sparkles, Wallet } from "lucide-react";
import CompanyLogo from "../ui/CompanyLogo";
import SaveButton from "./SaveButton";
import { cn, formatSalary, timeAgo } from "../../utils/helpers";

const modeTone = {
  Remote: "badge badge-green",
  Hybrid: "badge badge-sky",
  "On-site": "badge badge-neutral",
};

const JobCard = ({ job, className, delay = 0 }) => (
  <article
    className={cn("card card-hover group relative animate-fade-up p-5", className)}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start gap-4">
      <CompanyLogo company={job.company} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-bold text-ink transition group-hover:text-brand-text">
              <Link to={`/jobs/${job.id}`} className="before:absolute before:inset-0 before:rounded-2xl before:content-['']">
                {job.title}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-sm text-ink-2">{job.company.name}</p>
          </div>
          <div className="relative z-10 flex shrink-0 items-center gap-2">
            {job.featured && (
              <span className="badge badge-amber hidden sm:inline-flex">
                <Sparkles className="size-3" /> Featured
              </span>
            )}
            <SaveButton jobId={job.id} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-ink-2">
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-ink-3" />{job.location}</span>
          <span className="inline-flex items-center gap-1.5"><Wallet className="size-3.5 text-ink-3" />{formatSalary(job.salary)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5 text-ink-3" />{timeAgo(job.postedAt)}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={modeTone[job.mode]}>{job.mode}</span>
          <span className="badge badge-neutral">{job.type}</span>
          {job.skills.slice(0, 3).map((s) => (
            <span key={s} className="chip hidden sm:inline-flex">{s}</span>
          ))}
        </div>
      </div>
    </div>
  </article>
);

export default JobCard;
