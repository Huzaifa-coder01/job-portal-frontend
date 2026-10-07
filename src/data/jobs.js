import { companiesById } from "./companies";
import { slugify } from "../utils/helpers";

// Role-family copy used to flesh out each mock listing.
const FAMILY = {
  engineering: {
    blurb: "design, build and ship reliable software that thousands of people depend on",
    responsibilities: [
      "Design, build and maintain high-quality, well-tested features end to end",
      "Collaborate with product and design to turn ambiguous problems into elegant solutions",
      "Review code, mentor teammates and raise the engineering bar across the team",
      "Own the performance, reliability and observability of the systems you build",
      "Contribute to technical roadmaps and architecture decisions",
    ],
    requirements: [
      "Strong fundamentals in computer science and software design",
      "A track record of shipping production systems used by real customers",
      "Comfort working in a fast-moving environment with high autonomy",
      "Clear written and verbal communication",
    ],
  },
  "data-ai": {
    blurb: "turn complex data into decisions, models and products that move the business",
    responsibilities: [
      "Frame business questions as measurable problems and choose the right methods",
      "Build, evaluate and deploy models and data pipelines at scale",
      "Partner with engineers, product managers and executives to act on insights",
      "Define experiments and metrics that the whole company can trust",
      "Document findings and share knowledge across teams",
    ],
    requirements: [
      "Deep experience with statistical analysis or machine-learning techniques",
      "Proficiency writing clean, reproducible code",
      "Ability to communicate technical results to non-technical audiences",
      "Curiosity, rigour and a bias for impact over novelty",
    ],
  },
  design: {
    blurb: "craft delightful, accessible experiences and visuals that make people care",
    responsibilities: [
      "Lead projects from discovery through polished, shipped design",
      "Create flows, prototypes and visual systems that scale with the product",
      "Run critiques and collaborate closely with engineers and stakeholders",
      "Use research and data to validate and refine design decisions",
      "Champion accessibility and craft in everything we make",
    ],
    requirements: [
      "A portfolio demonstrating strong visual, interaction and storytelling skills",
      "Experience working in cross-functional product or creative teams",
      "Fluency in modern design tools and handoff workflows",
      "Thoughtful approach to feedback and iteration",
    ],
  },
  product: {
    blurb: "define strategy and guide cross-functional teams to build products customers love",
    responsibilities: [
      "Own the roadmap and success metrics for your product area",
      "Discover customer needs through research, data and conversations",
      "Write crisp specs and align engineering, design and go-to-market partners",
      "Prioritise ruthlessly and communicate trade-offs clearly",
      "Launch, measure and iterate based on real-world outcomes",
    ],
    requirements: [
      "Proven experience shipping products in a collaborative environment",
      "Analytical mindset with comfort in data and experimentation",
      "Excellent stakeholder management and storytelling",
      "Strong sense of product taste and customer empathy",
    ],
  },
  marketing: {
    blurb: "grow our audience and brand through creative, data-informed campaigns",
    responsibilities: [
      "Plan and execute multi-channel campaigns from concept to measurement",
      "Create compelling content and messaging for our core audiences",
      "Analyse performance and optimise for acquisition, engagement and retention",
      "Collaborate with product, sales and design on go-to-market launches",
      "Manage budgets, vendors and agency partners",
    ],
    requirements: [
      "Demonstrated results growing a brand or channel",
      "Excellent writing, creative thinking and attention to detail",
      "Comfort with analytics tools and experimentation",
      "Ability to juggle priorities and deliver on deadlines",
    ],
  },
  sales: {
    blurb: "build relationships, open new markets and drive revenue growth",
    responsibilities: [
      "Prospect, qualify and close new business with ambitious customers",
      "Run consultative discovery calls and tailored product demonstrations",
      "Partner with marketing and customer success to shape the customer journey",
      "Maintain an accurate pipeline and forecast in our CRM",
      "Share market feedback to improve our product and positioning",
    ],
    requirements: [
      "Track record of meeting or exceeding quota",
      "Outstanding communication, negotiation and listening skills",
      "Self-starter who thrives on ownership and competition",
      "Experience with modern sales tooling and processes",
    ],
  },
  finance: {
    blurb: "protect and grow the business through sharp financial and risk management",
    responsibilities: [
      "Prepare accurate analyses, forecasts and reporting for leadership",
      "Partner with business teams to guide budgeting and investment decisions",
      "Strengthen controls, compliance and audit-readiness",
      "Identify trends, risks and opportunities hiding in the numbers",
      "Streamline financial processes using modern tooling",
    ],
    requirements: [
      "Relevant degree or professional certification in finance or accounting",
      "Advanced Excel / modelling skills and strong attention to detail",
      "Ability to translate numbers into clear recommendations",
      "High integrity and a collaborative working style",
    ],
  },
  "customer-success": {
    blurb: "help customers succeed, stay delighted and grow with us",
    responsibilities: [
      "Be the trusted advisor for a portfolio of customers",
      "Onboard new accounts and drive adoption of key features",
      "Resolve issues quickly and escalate with clear context",
      "Spot expansion and renewal opportunities early",
      "Turn customer feedback into insights for product and engineering",
    ],
    requirements: [
      "Experience in customer-facing roles at a technology company",
      "Excellent empathy, communication and problem-solving skills",
      "Comfort learning complex products and explaining them simply",
      "Organised, proactive and calm under pressure",
    ],
  },
  operations: {
    blurb: "keep the business running smoothly by building scalable, efficient processes",
    responsibilities: [
      "Own day-to-day execution and continuously improve key processes",
      "Analyse operational data to find bottlenecks and savings",
      "Coordinate across teams, vendors and stakeholders to deliver on time",
      "Introduce tools, playbooks and metrics that help teams scale",
      "Lead projects from planning through rollout",
    ],
    requirements: [
      "Experience in operations, project or programme management",
      "Strong analytical and organisational skills",
      "Ability to influence without authority",
      "Calm, pragmatic approach to solving problems",
    ],
  },
  healthcare: {
    blurb: "advance patient outcomes through rigorous science, care and data",
    responsibilities: [
      "Contribute to studies, programmes and care pathways that improve patient lives",
      "Maintain exacting standards for quality, safety and regulatory compliance",
      "Collaborate with clinicians, scientists and analysts across disciplines",
      "Document and present findings to internal and external stakeholders",
      "Continuously learn and apply best practices in your field",
    ],
    requirements: [
      "Relevant degree, licensure or professional experience",
      "Meticulous attention to detail and respect for protocols",
      "Strong teamwork and communication skills",
      "Commitment to patient-centred, evidence-based work",
    ],
  },
};

const LEVEL_EXPERIENCE = {
  Entry: "0–2 years of relevant experience (internships and projects count)",
  Mid: "3–5 years of relevant experience",
  Senior: "6+ years of relevant experience, including leading complex projects",
  Lead: "9+ years of experience with a record of technical or organisational leadership",
};

// Compact seed definitions: [title, companyId, category, location, mode, type, level, [minK, maxK], daysAgo, skills, featured?]
const SEED = [
  ["Senior Frontend Engineer", "lumen", "engineering", "San Francisco, CA", "Hybrid", "Full-time", "Senior", [165, 205], 1, ["React", "TypeScript", "GraphQL", "Design Systems"], true],
  ["Staff Backend Engineer", "atlas", "engineering", "Denver, CO", "Remote", "Full-time", "Lead", [195, 240], 2, ["Go", "Kubernetes", "PostgreSQL", "gRPC"], true],
  ["Full-Stack Engineer", "stackwise", "engineering", "Remote (Global)", "Remote", "Full-time", "Mid", [130, 165], 3, ["Node.js", "React", "PostgreSQL", "AWS"]],
  ["Platform Engineer", "atlas", "engineering", "Denver, CO", "Hybrid", "Full-time", "Mid", [140, 175], 5, ["Terraform", "AWS", "CI/CD", "Linux"]],
  ["iOS Engineer", "orbit", "engineering", "Chicago, IL", "Hybrid", "Full-time", "Senior", [150, 185], 6, ["Swift", "SwiftUI", "Combine", "XCTest"]],
  ["Junior Software Engineer", "meridian", "engineering", "New York, NY", "On-site", "Full-time", "Entry", [95, 115], 4, ["Java", "SQL", "REST APIs", "Git"]],
  ["Software Engineering Intern", "stackwise", "engineering", "Remote (US)", "Remote", "Internship", "Entry", [40, 50], 8, ["JavaScript", "Python", "Git"]],
  ["Application Security Engineer", "meridian", "engineering", "New York, NY", "Hybrid", "Full-time", "Senior", [170, 210], 9, ["AppSec", "Threat Modeling", "Python", "AWS"]],
  ["Embedded Software Engineer", "verdant", "engineering", "Austin, TX", "On-site", "Full-time", "Mid", [120, 150], 11, ["C++", "RTOS", "CAN bus", "Python"]],

  ["Machine Learning Engineer", "lumen", "data-ai", "San Francisco, CA", "Hybrid", "Full-time", "Senior", [185, 235], 2, ["PyTorch", "Python", "LLMs", "MLOps"], true],
  ["Research Scientist, NLP", "lumen", "data-ai", "Remote (US)", "Remote", "Full-time", "Lead", [220, 290], 1, ["Deep Learning", "NLP", "Python", "Research"], true],
  ["Data Scientist", "helix", "data-ai", "San Diego, CA", "Hybrid", "Full-time", "Mid", [135, 170], 3, ["Python", "Statistics", "SQL", "R"]],
  ["Analytics Engineer", "kindred", "data-ai", "Seattle, WA", "Remote", "Full-time", "Mid", [125, 155], 4, ["dbt", "SQL", "Snowflake", "Looker"]],
  ["Data Analyst", "brightside", "data-ai", "Toronto, Canada", "Hybrid", "Full-time", "Entry", [70, 90], 7, ["SQL", "Tableau", "Excel", "Python"]],

  ["Senior Product Designer", "pixelcraft", "design", "Los Angeles, CA", "Hybrid", "Full-time", "Senior", [140, 175], 2, ["Figma", "Prototyping", "Design Systems", "User Research"], true],
  ["UX Researcher", "kindred", "design", "Remote (US)", "Remote", "Full-time", "Mid", [110, 140], 6, ["Interviews", "Usability Testing", "Surveys", "Synthesis"]],
  ["Brand Designer", "sparrow", "design", "London, UK", "Hybrid", "Full-time", "Mid", [85, 110], 5, ["Branding", "Typography", "Illustration", "Adobe CC"]],
  ["Motion Designer", "pixelcraft", "design", "Remote (Global)", "Remote", "Contract", "Mid", [90, 120], 10, ["After Effects", "Cinema 4D", "Storyboarding"]],
  ["UI Design Intern", "pixelcraft", "design", "Los Angeles, CA", "On-site", "Internship", "Entry", [35, 45], 12, ["Figma", "Visual Design", "Prototyping"]],

  ["Senior Product Manager", "northwind", "product", "Boston, MA", "Hybrid", "Full-time", "Senior", [160, 195], 1, ["Roadmapping", "Discovery", "SQL", "Stakeholder Management"], true],
  ["Associate Product Manager", "kindred", "product", "Seattle, WA", "Hybrid", "Full-time", "Entry", [100, 120], 5, ["User Stories", "Analytics", "Prioritisation"]],
  ["Technical Program Manager", "atlas", "product", "Denver, CO", "Hybrid", "Full-time", "Senior", [155, 190], 8, ["Programme Management", "Cloud", "Risk Management"]],
  ["Product Operations Lead", "stackwise", "product", "Remote (Global)", "Remote", "Full-time", "Lead", [140, 170], 9, ["Process Design", "Analytics", "Cross-functional Leadership"]],

  ["Growth Marketing Manager", "brightside", "marketing", "Toronto, Canada", "Hybrid", "Full-time", "Mid", [95, 120], 2, ["Paid Social", "Lifecycle", "A/B Testing", "GA4"]],
  ["Content Strategist", "sparrow", "marketing", "London, UK", "Remote", "Full-time", "Mid", [75, 95], 4, ["Editorial", "SEO", "Storytelling"]],
  ["SEO Specialist", "brightside", "marketing", "Remote (Canada)", "Remote", "Part-time", "Mid", [45, 60], 7, ["Technical SEO", "Keyword Research", "Ahrefs"]],
  ["Head of Brand Marketing", "verdant", "marketing", "Austin, TX", "Hybrid", "Full-time", "Lead", [150, 185], 6, ["Brand Strategy", "Team Leadership", "Communications"]],

  ["Enterprise Account Executive", "lumen", "sales", "New York, NY", "Hybrid", "Full-time", "Senior", [140, 180], 3, ["Enterprise Sales", "MEDDIC", "Salesforce"]],
  ["Sales Development Representative", "stackwise", "sales", "Remote (US)", "Remote", "Full-time", "Entry", [60, 75], 1, ["Outbound", "Cold Calling", "HubSpot"]],
  ["Partnerships Manager", "meridian", "sales", "New York, NY", "Hybrid", "Full-time", "Mid", [110, 140], 10, ["Business Development", "Negotiation", "FinTech"]],

  ["Financial Analyst", "meridian", "finance", "New York, NY", "On-site", "Full-time", "Mid", [90, 115], 5, ["Financial Modeling", "Excel", "Forecasting"]],
  ["Risk & Compliance Manager", "meridian", "finance", "New York, NY", "Hybrid", "Full-time", "Senior", [145, 180], 7, ["Regulatory Compliance", "Audit", "Risk Assessment"]],
  ["Staff Accountant", "verdant", "finance", "Austin, TX", "Hybrid", "Part-time", "Mid", [40, 55], 12, ["GAAP", "QuickBooks", "Reconciliation"]],

  ["Customer Success Manager", "stackwise", "customer-success", "Remote (Global)", "Remote", "Full-time", "Mid", [90, 115], 3, ["Onboarding", "Renewals", "SaaS"]],
  ["Technical Support Engineer", "atlas", "customer-success", "Denver, CO", "Remote", "Full-time", "Entry", [75, 95], 2, ["Linux", "Networking", "Troubleshooting"]],

  ["Supply Chain Analyst", "orbit", "operations", "Chicago, IL", "On-site", "Full-time", "Mid", [80, 100], 4, ["Forecasting", "SQL", "Logistics"]],
  ["Operations Manager", "orbit", "operations", "Chicago, IL", "On-site", "Full-time", "Senior", [105, 135], 9, ["Lean Six Sigma", "People Management", "KPIs"]],
  ["Energy Project Manager", "verdant", "operations", "Austin, TX", "Hybrid", "Full-time", "Senior", [125, 155], 6, ["Project Management", "Solar", "Permitting"]],
  ["People Operations Partner", "kindred", "operations", "Remote (US)", "Remote", "Full-time", "Mid", [90, 115], 8, ["HRIS", "Employee Relations", "Onboarding"]],

  ["Clinical Data Manager", "helix", "healthcare", "San Diego, CA", "Hybrid", "Full-time", "Senior", [120, 150], 3, ["EDC", "CDISC", "GCP"]],
  ["Registered Nurse, Care Navigation", "northwind", "healthcare", "Boston, MA", "On-site", "Full-time", "Mid", [85, 105], 2, ["Patient Care", "Case Management", "EHR"]],
  ["Healthcare Product Analyst", "northwind", "healthcare", "Remote (US)", "Remote", "Contract", "Mid", [100, 130], 5, ["SQL", "Healthcare Data", "Tableau"]],
  ["Senior Biostatistician", "helix", "healthcare", "Remote (US)", "Remote", "Full-time", "Senior", [135, 165], 11, ["SAS", "R", "Clinical Trials"]],
  ["Lab Research Associate", "helix", "healthcare", "San Diego, CA", "On-site", "Full-time", "Entry", [62, 78], 4, ["PCR", "Cell Culture", "Lab Safety"]],
];

const daysAgoISO = (d) => new Date(Date.now() - d * 86_400_000).toISOString();

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export function describeJob(job) {
  const company = job.company;
  const family = FAMILY[job.category];
  const a = /^[aeiou]/i.test(job.title) ? "an" : "a";
  return {
    summary: `${company.name} is looking for ${a} ${job.title} to ${family.blurb}.`,
    about: `${company.tagline} ${company.about}`,
    responsibilities: family.responsibilities,
    requirements: [
      LEVEL_EXPERIENCE[job.level],
      `Hands-on experience with ${job.skills.slice(0, 3).join(", ")}`,
      ...family.requirements,
    ],
    niceToHave: [
      `Familiarity with ${job.skills[job.skills.length - 1]} in production`,
      "Experience at a high-growth company",
      "Passion for our mission",
    ],
  };
}

export const seedJobs = SEED.map(([title, companyId, category, location, mode, type, level, salary, days, skills, featured], i) => {
  const company = companiesById[companyId];
  const h = hash(title + companyId);
  const job = {
    id: `${slugify(title)}-${companyId}`,
    title,
    companyId,
    company,
    category,
    location,
    mode,
    type,
    level,
    salary: { min: salary[0], max: salary[1], currency: "USD" },
    postedAt: daysAgoISO(days),
    skills,
    featured: Boolean(featured),
    applicants: 12 + (h % 140) + (i % 7),
    openings: 1 + (h % 3 === 0 ? 1 : 0),
    source: "seed",
  };
  return { ...job, ...describeJob(job) };
});

export const seedJobsById = Object.fromEntries(seedJobs.map((j) => [j.id, j]));
