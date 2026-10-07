import { Link } from "react-router-dom";
import Logo, { BRAND } from "../ui/Logo";
import { categories } from "../../data/categories";

const Column = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-bold text-ink">{title}</h3>
    <ul className="mt-4 space-y-3 text-sm text-ink-2">{children}</ul>
  </div>
);
const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="transition hover:text-brand-text">{children}</Link>
  </li>
);

const Footer = () => (
  <footer className="mt-24 border-t border-line bg-surface">
    <div className="container-x py-14">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
            {BRAND} connects ambitious people with companies doing meaningful work —
            with transparent salaries and zero spam.
          </p>
        </div>
        <Column title="For candidates">
          <FooterLink to="/jobs">Browse all jobs</FooterLink>
          <FooterLink to="/jobs?mode=Remote">Remote jobs</FooterLink>
          <FooterLink to="/jobs?type=Internship">Internships</FooterLink>
          <FooterLink to="/companies">Explore companies</FooterLink>
        </Column>
        <Column title="For employers">
          <FooterLink to="/signup?role=employer">Create employer account</FooterLink>
          <FooterLink to="/dashboard/post">Post a job</FooterLink>
          <FooterLink to="/dashboard/jobs">Manage listings</FooterLink>
        </Column>
        <Column title="Popular categories">
          {categories.slice(0, 4).map((c) => (
            <FooterLink key={c.id} to={`/jobs?category=${c.id}`}>{c.label} jobs</FooterLink>
          ))}
        </Column>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-sm text-ink-3 sm:flex-row">
        <p>© {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
        <p>Demo project · All companies and listings are fictional.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
