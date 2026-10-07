export const testimonials = [
  {
    name: "Maya Chen",
    role: "Product Designer at Pixelcraft",
    quote:
      "I had three interviews within a week of creating my profile. The salary transparency meant no awkward guessing games — I knew exactly what to expect.",
    colors: ["#f43f5e", "#fb923c"],
  },
  {
    name: "Daniel Okafor",
    role: "Staff Engineer at Atlas Cloud",
    quote:
      "Hirova's filters are the best I've used. Remote, senior, Go — and the right roles were right there. I accepted an offer in under three weeks.",
    colors: ["#0891b2", "#1e40af"],
  },
  {
    name: "Sofia Ramirez",
    role: "Head of Talent at Kindred Learning",
    quote:
      "We cut our time-to-hire by 40%. The applicant pipeline is clean, quick to triage, and the quality of candidates is consistently high.",
    colors: ["#8b5cf6", "#ec4899"],
  },
];

export const faqs = [
  {
    q: "Is Hirova free for job seekers?",
    a: "Yes. Creating a profile, searching, saving jobs and applying are always free for candidates.",
  },
  {
    q: "How do I post a job as an employer?",
    a: "Create an employer account, open your dashboard and choose “Post a job”. Your listing goes live immediately.",
  },
  {
    q: "Can I see salaries before I apply?",
    a: "Every listing on Hirova includes a salary range — it's a requirement for all employers on the platform.",
  },
];

// Pool of mock candidates used to populate the employer's applicant lists.
export const applicantPool = [
  { id: "p1", name: "Amelia Foster", headline: "Senior Product Manager", location: "Boston, MA", years: 8, skills: ["Roadmapping", "SQL", "Discovery"], match: 94 },
  { id: "p2", name: "Rohan Mehta", headline: "Data Analyst", location: "Remote (US)", years: 4, skills: ["SQL", "Tableau", "Python"], match: 88 },
  { id: "p3", name: "Chloe Bennett", headline: "Registered Nurse, Case Manager", location: "Cambridge, MA", years: 6, skills: ["Patient Care", "EHR", "Case Management"], match: 91 },
  { id: "p4", name: "Marcus Johnson", headline: "Product Manager, HealthTech", location: "New York, NY", years: 7, skills: ["Stakeholder Management", "Analytics"], match: 86 },
  { id: "p5", name: "Yuki Tanaka", headline: "Business Analyst", location: "Seattle, WA", years: 3, skills: ["SQL", "Healthcare Data", "Excel"], match: 79 },
  { id: "p6", name: "Isabella Rossi", headline: "Clinical Operations Nurse", location: "Boston, MA", years: 9, skills: ["Care Navigation", "EHR", "Patient Care"], match: 96 },
  { id: "p7", name: "Omar Haddad", headline: "Senior Product Manager", location: "Austin, TX", years: 10, skills: ["Discovery", "Roadmapping", "OKRs"], match: 90 },
  { id: "p8", name: "Grace Liu", headline: "Healthcare Data Analyst", location: "Remote (US)", years: 5, skills: ["Tableau", "SQL", "Healthcare Data"], match: 93 },
  { id: "p9", name: "Liam O'Connor", headline: "Associate Product Manager", location: "Chicago, IL", years: 2, skills: ["User Stories", "Analytics"], match: 74 },
  { id: "p10", name: "Priya Nair", headline: "Product Lead", location: "San Francisco, CA", years: 11, skills: ["Strategy", "Roadmapping", "SQL"], match: 89 },
  { id: "p11", name: "Ethan Brooks", headline: "Care Coordinator RN", location: "Worcester, MA", years: 4, skills: ["Patient Care", "Case Management"], match: 81 },
  { id: "p12", name: "Nadia Petrova", headline: "Analytics Consultant", location: "Remote (EU)", years: 6, skills: ["Python", "SQL", "Tableau"], match: 85 },
];

export const APPLICATION_STATUSES = ["Applied", "In Review", "Interview", "Offer", "Rejected"];
