import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { seedJobs, describeJob } from "../data/jobs";
import { companiesById } from "../data/companies";
import { applicantPool } from "../data/people";
import { slugify } from "../utils/helpers";
import { StoreContext } from "./store-context";

// ---------------------------------------------------------------------------
// App-wide mock "backend": jobs, saved jobs, applications and employer postings.
// Everything is persisted in localStorage so the demo feels real across reloads.
// ---------------------------------------------------------------------------

const DB_KEY = "hirova:db:v1";
const daysAgoISO = (d) => new Date(Date.now() - d * 86_400_000).toISOString();

const DEMO_APPLICANT = {
  name: "Alex Morgan",
  headline: "Frontend Engineer",
  location: "San Francisco, CA",
  years: 6,
  skills: ["React", "TypeScript", "Next.js", "GraphQL"],
};

const demoApp = (jobId, status, days, extra = {}) => ({
  id: `app_${jobId}`,
  userId: "demo-candidate",
  applicant: DEMO_APPLICANT,
  jobId,
  status,
  appliedAt: daysAgoISO(days),
  resumeName: "Alex_Morgan_Resume.pdf",
  coverLetter: "",
  ...extra,
});

const createSeedDb = () => ({
  posted: [],
  closed: [],
  saved: {
    "demo-candidate": [
      "senior-product-designer-pixelcraft",
      "machine-learning-engineer-lumen",
      "platform-engineer-atlas",
    ],
  },
  applicantStatus: {},
  applications: [
    demoApp("full-stack-engineer-stackwise", "Interview", 6, {
      interview: { date: new Date(Date.now() + 2 * 86_400_000).toISOString(), kind: "Technical interview · Video call" },
    }),
    demoApp("senior-frontend-engineer-lumen", "In Review", 3),
    demoApp("analytics-engineer-kindred", "Applied", 1),
    demoApp("technical-support-engineer-atlas", "Offer", 14),
    demoApp("application-security-engineer-meridian", "Rejected", 20),
  ],
});

const loadDb = () => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return { ...createSeedDb(), ...JSON.parse(raw) };
  } catch {
    /* fall through to seed data */
  }
  return createSeedDb();
};

const hashCode = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// Deterministic, plausible-looking mock applicants for any job.
const mockApplicantsFor = (jobId) => {
  const h = hashCode(jobId);
  const count = 5 + (h % 5);
  const defaults = ["Applied", "Applied", "In Review", "Applied", "Interview", "In Review", "Rejected", "Offer", "Applied"];
  return Array.from({ length: count }, (_, i) => {
    const person = applicantPool[(h + i * 5) % applicantPool.length];
    return {
      id: `${jobId}:${person.id}`,
      userId: null,
      applicant: person,
      jobId,
      status: defaults[(h + i) % defaults.length],
      appliedAt: daysAgoISO(1 + ((h >> (i % 5)) % 9) + i),
      resumeName: `${person.name.replace(/\s+/g, "_")}_Resume.pdf`,
      match: Math.max(62, person.match - i * 2),
    };
  });
};

export const StoreProvider = ({ children }) => {
  const { user } = useAuth();
  const [db, setDb] = useState(loadDb);

  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [db]);

  // ----- Jobs -----
  const jobs = useMemo(
    () => [...db.posted, ...seedJobs].filter((j) => !db.closed.includes(j.id)),
    [db.posted, db.closed],
  );
  const jobsById = useMemo(() => Object.fromEntries(jobs.map((j) => [j.id, j])), [jobs]);
  const getJob = useCallback((id) => jobsById[id], [jobsById]);

  const postJob = useCallback(
    (form) => {
      const company = companiesById[user.companyId] ?? {
        id: user.companyId,
        name: user.companyName,
        tagline: `${user.companyName} is hiring.`,
        about: `${user.companyName} is growing its team on Hirova.`,
        industry: "Technology",
        size: "11–50",
        hq: form.location,
        rating: 4.5,
        reviews: 0,
        colors: ["#6b5bff", "#b05bff"],
        perks: [],
      };
      const base = {
        id: `${slugify(form.title)}-${company.id}-${Date.now().toString(36).slice(-4)}`,
        title: form.title,
        companyId: company.id,
        company,
        category: form.category,
        location: form.location,
        mode: form.mode,
        type: form.type,
        level: form.level,
        salary: { min: Number(form.salaryMin), max: Number(form.salaryMax), currency: "USD" },
        postedAt: new Date().toISOString(),
        skills: form.skills,
        featured: false,
        applicants: 0,
        openings: 1,
        source: "posted",
        postedBy: user.id,
      };
      const generated = describeJob(base);
      const job = {
        ...base,
        ...generated,
        ...(form.description.trim() && { summary: form.description.trim() }),
      };
      setDb((d) => ({ ...d, posted: [job, ...d.posted] }));
      return job;
    },
    [user],
  );

  const closeJob = useCallback((id) => {
    setDb((d) => ({
      ...d,
      posted: d.posted.filter((j) => j.id !== id),
      closed: [...d.closed, id],
    }));
  }, []);

  // ----- Saved jobs -----
  const savedIds = useMemo(() => (user ? (db.saved[user.id] ?? []) : []), [db.saved, user]);
  const isSaved = useCallback((id) => savedIds.includes(id), [savedIds]);
  const toggleSave = useCallback(
    (id) => {
      if (!user) return false;
      const was = savedIds.includes(id);
      setDb((d) => {
        const current = d.saved[user.id] ?? [];
        return {
          ...d,
          saved: {
            ...d.saved,
            [user.id]: was ? current.filter((x) => x !== id) : [id, ...current],
          },
        };
      });
      toast.success(was ? "Removed from saved jobs" : "Job saved", { icon: was ? "🗑️" : "🔖" });
      return true;
    },
    [user, savedIds],
  );

  // ----- Applications (candidate) -----
  const myApplications = useMemo(
    () =>
      user
        ? db.applications
            .filter((a) => a.userId === user.id)
            .map((a) => ({ ...a, job: jobsById[a.jobId] ?? seedJobs.find((j) => j.id === a.jobId) }))
            .filter((a) => a.job)
            .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        : [],
    [db.applications, jobsById, user],
  );
  const hasApplied = useCallback(
    (jobId) => myApplications.some((a) => a.jobId === jobId),
    [myApplications],
  );

  const applyToJob = useCallback(
    (jobId, { coverLetter, resumeName }) => {
      const application = {
        id: `app_${jobId}_${Date.now().toString(36)}`,
        userId: user.id,
        applicant: {
          name: user.name,
          headline: user.headline || "Candidate",
          location: user.location || "—",
          years: user.experience?.length ? user.experience.length * 3 : 2,
          skills: user.skills ?? [],
        },
        jobId,
        status: "Applied",
        appliedAt: new Date().toISOString(),
        coverLetter,
        resumeName,
      };
      setDb((d) => ({ ...d, applications: [application, ...d.applications] }));
    },
    [user],
  );

  const withdrawApplication = useCallback((id) => {
    setDb((d) => ({ ...d, applications: d.applications.filter((a) => a.id !== id) }));
    toast.success("Application withdrawn");
  }, []);

  // ----- Applicants (employer) -----
  const getApplicants = useCallback(
    (jobId) => {
      const real = db.applications
        .filter((a) => a.jobId === jobId)
        .map((a) => ({ ...a, match: 82 + (hashCode(a.id) % 15) }));
      const mock = mockApplicantsFor(jobId)
        .map((a) => ({ ...a, status: db.applicantStatus[a.id] ?? a.status }));
      return [...real, ...mock].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    },
    [db.applications, db.applicantStatus],
  );

  const setApplicantStatus = useCallback((application, status) => {
    setDb((d) =>
      application.userId
        ? {
            ...d,
            applications: d.applications.map((a) => (a.id === application.id ? { ...a, status } : a)),
          }
        : { ...d, applicantStatus: { ...d.applicantStatus, [application.id]: status } },
    );
  }, []);

  const employerJobs = useMemo(
    () => (user?.role === "employer" ? jobs.filter((j) => j.companyId === user.companyId) : []),
    [jobs, user],
  );

  const value = useMemo(
    () => ({
      jobs, getJob, postJob, closeJob, employerJobs,
      savedIds, isSaved, toggleSave,
      myApplications, hasApplied, applyToJob, withdrawApplication,
      getApplicants, setApplicantStatus,
    }),
    [jobs, getJob, postJob, closeJob, employerJobs, savedIds, isSaved, toggleSave, myApplications, hasApplied, applyToJob, withdrawApplication, getApplicants, setApplicantStatus],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
