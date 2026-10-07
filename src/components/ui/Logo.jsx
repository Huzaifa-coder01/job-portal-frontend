import { Link } from "react-router-dom";
import { cn } from "../../utils/helpers";

export const BRAND = "Hirova";

export const LogoMark = ({ className = "size-9" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="hv-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7b6cff" />
        <stop offset="1" stopColor="#3a2bd1" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="9" fill="url(#hv-grad)" />
    <path d="M10 8v16M22 8v16M10 16h12" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    <circle cx="22" cy="8" r="2.6" fill="#ffc857" />
  </svg>
);

const Logo = ({ className, light = false }) => (
  <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label={`${BRAND} home`}>
    <LogoMark />
    <span className={cn("text-xl font-extrabold tracking-tight", light ? "text-white" : "text-ink")}>
      {BRAND}
    </span>
  </Link>
);

export default Logo;
