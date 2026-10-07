import { NavLink, Outlet } from "react-router-dom";
import {
  Bookmark, FileText, LayoutDashboard, PlusCircle, Briefcase, Users, UserCog,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Avatar } from "../../components/ui/Common";
import { cn } from "../../utils/helpers";

const NAV = {
  candidate: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/dashboard/applications", label: "Applications", icon: FileText },
    { to: "/dashboard/saved", label: "Saved jobs", icon: Bookmark },
    { to: "/dashboard/profile", label: "My profile", icon: UserCog },
  ],
  employer: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/dashboard/jobs", label: "My listings", icon: Briefcase },
    { to: "/dashboard/applicants", label: "Applicants", icon: Users },
    { to: "/dashboard/post", label: "Post a job", icon: PlusCircle },
    { to: "/dashboard/profile", label: "Account", icon: UserCog },
  ],
};

const DashboardLayout = () => {
  const { user } = useAuth();
  const items = NAV[user.role];

  return (
    <div className="container-x grid gap-8 py-8 lg:grid-cols-[250px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card hidden p-5 lg:block">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} size="lg" />
            <div className="min-w-0">
              <p className="truncate font-bold text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-3">
                {user.role === "employer" ? user.companyName : user.headline || "Candidate"}
              </p>
            </div>
          </div>
        </div>
        <nav
          aria-label="Dashboard"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-4 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                    : "text-ink-2 hover:bg-surface hover:text-ink lg:hover:bg-surface-2",
                )
              }
            >
              <item.icon className="size-[18px]" /> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
