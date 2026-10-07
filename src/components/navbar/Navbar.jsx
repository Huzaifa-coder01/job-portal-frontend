import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bookmark, ChevronDown, LayoutDashboard, LogOut, Menu, Moon, Sun, X, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import Logo from "../ui/Logo";
import { Avatar } from "../ui/Common";
import { cn } from "../../utils/helpers";

const linkClass = ({ isActive }) =>
  cn(
    "rounded-lg px-3 py-2 text-sm font-semibold transition",
    isActive ? "bg-brand-soft text-brand-text" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
  );

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close menus whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const ThemeButton = (
    <button onClick={toggle} className="icon-btn" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition duration-200",
        scrolled || mobileOpen
          ? "border-line bg-surface/85 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="container-x flex h-[68px] items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            <NavLink to="/jobs" className={linkClass}>Find jobs</NavLink>
            <NavLink to="/companies" className={linkClass}>Companies</NavLink>
            {(!user || user.role === "employer") && (
              <NavLink to={user ? "/dashboard/post" : "/signup?role=employer"} className={linkClass}>
                For employers
              </NavLink>
            )}
          </nav>
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          {ThemeButton}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-line bg-surface py-1.5 pl-1.5 pr-3 transition hover:border-brand-300"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <Avatar name={user.name} size="sm" />
                <span className="max-w-[110px] truncate text-sm font-semibold text-ink">{user.name.split(" ")[0]}</span>
                <ChevronDown className={cn("size-4 text-ink-3 transition", menuOpen && "rotate-180")} />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 animate-pop overflow-hidden rounded-2xl border border-line bg-surface p-1.5"
                  style={{ boxShadow: "var(--shadow-pop)" }}
                >
                  <div className="px-3 py-2.5">
                    <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                    <p className="truncate text-xs text-ink-3">{user.email}</p>
                    <span className="badge badge-brand mt-2 capitalize">{user.role}</span>
                  </div>
                  <div className="my-1 h-px bg-line" />
                  <MenuLink to="/dashboard" icon={LayoutDashboard}>Dashboard</MenuLink>
                  {user.role === "candidate" && <MenuLink to="/dashboard/saved" icon={Bookmark}>Saved jobs</MenuLink>}
                  <MenuLink to="/dashboard/profile" icon={User}>Profile & settings</MenuLink>
                  <div className="my-1 h-px bg-line" />
                  <button
                    onClick={handleLogout}
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <LogOut className="size-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/signup" className="btn btn-primary">Sign up free</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {ThemeButton}
          <button
            className="icon-btn"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-fade-in border-t border-line bg-surface md:hidden">
          <nav className="container-x flex flex-col gap-1 py-4" aria-label="Mobile">
            <NavLink to="/jobs" className={linkClass}>Find jobs</NavLink>
            <NavLink to="/companies" className={linkClass}>Companies</NavLink>
            {(!user || user.role === "employer") && (
              <NavLink to={user ? "/dashboard/post" : "/signup?role=employer"} className={linkClass}>For employers</NavLink>
            )}
            <div className="my-2 h-px bg-line" />
            {user ? (
              <>
                <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                <NavLink to="/dashboard/profile" className={linkClass}>Profile & settings</NavLink>
                <button onClick={handleLogout} className="btn btn-danger mt-2">
                  <LogOut className="size-4" /> Log out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link to="/login" className="btn btn-secondary">Log in</Link>
                <Link to="/signup" className="btn btn-primary">Sign up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

const MenuLink = ({ to, icon: Icon, children }) => (
  <Link
    to={to}
    role="menuitem"
    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2 transition hover:bg-surface-2 hover:text-ink"
  >
    <Icon className="size-4" /> {children}
  </Link>
);

export default Navbar;
