import { cn, initials } from "../../utils/helpers";

const SIZES = {
  sm: "size-9 rounded-lg text-xs",
  md: "size-12 rounded-xl text-sm",
  lg: "size-16 rounded-2xl text-lg",
  xl: "size-20 rounded-3xl text-2xl",
};

// Gradient monogram — avoids shipping (or hot-linking) real brand imagery.
export const Monogram = ({ name, colors = ["#6b5bff", "#b05bff"], size = "md", className }) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex shrink-0 items-center justify-center font-bold tracking-tight text-white shadow-sm ring-1 ring-black/5",
      SIZES[size],
      className,
    )}
    style={{ backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
  >
    {initials(name)}
  </span>
);

const CompanyLogo = ({ company, size = "md", className }) => (
  <Monogram name={company.name} colors={company.colors} size={size} className={className} />
);

export default CompanyLogo;
