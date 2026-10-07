import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { slugify } from "../utils/helpers";
import { companies } from "../data/companies";
import { AuthContext, DEMO_CREDENTIALS } from "./auth-context";

// ---------------------------------------------------------------------------
// Mock authentication.
// Accounts live in localStorage so the demo works fully offline. The exposed
// API (user / signup / login / logout) mirrors the original Firebase context,
// so a real backend can be swapped back in without touching any page.
// ---------------------------------------------------------------------------

const USERS_KEY = "hirova:users";
const SESSION_KEY = "hirova:session";

const DEMO_USERS = [
  {
    id: "demo-candidate",
    role: "candidate",
    name: "Alex Morgan",
    email: DEMO_CREDENTIALS.candidate.email,
    headline: "Frontend Engineer",
    location: "San Francisco, CA",
    phone: "+1 (415) 555-0137",
    bio: "Frontend engineer with 6 years of experience building fast, accessible interfaces for SaaS products. I love design systems, performance work and mentoring junior developers.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Testing"],
    experience: [
      { title: "Senior Frontend Engineer", company: "Cloudline", period: "2022 – Present", description: "Led the rebuild of the customer dashboard, cutting load time by 48%." },
      { title: "Frontend Engineer", company: "Brightpath", period: "2019 – 2022", description: "Shipped the design system used by 8 product teams." },
    ],
    openToWork: true,
    resumeName: "Alex_Morgan_Resume.pdf",
  },
  {
    id: "demo-employer",
    role: "employer",
    name: "Priya Shah",
    email: DEMO_CREDENTIALS.employer.email,
    headline: "Head of Talent",
    location: "Boston, MA",
    companyId: "northwind",
    companyName: "Northwind Health",
  },
];

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the session just won't persist */
  }
};

const loadUsers = () => {
  const stored = read(USERS_KEY, {});
  const users = { ...stored };
  DEMO_USERS.forEach((u) => {
    users[u.email] = { ...u, ...stored[u.email] };
  });
  return users;
};

const delay = (ms = 650) => new Promise((r) => setTimeout(r, ms));

const fail = (message) => {
  toast.error(message);
  throw new Error(message);
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(loadUsers);
  const [userId, setUserId] = useState(() => read(SESSION_KEY, null));

  const user = useMemo(
    () => Object.values(users).find((u) => u.id === userId) ?? null,
    [users, userId],
  );

  const persistUsers = useCallback((next) => {
    setUsers(next);
    write(USERS_KEY, next);
  }, []);

  const signup = useCallback(
    async ({ name, email, password, role = "candidate", companyName }) => {
      await delay();
      const key = email.trim().toLowerCase();
      if (users[key]) fail("An account with this email already exists.");
      if (password.length < 6) fail("Password must be at least 6 characters.");

      const known = companies.find(
        (c) => c.name.toLowerCase() === companyName?.trim().toLowerCase(),
      );
      const newUser = {
        id: `u_${Date.now().toString(36)}`,
        role,
        name: name.trim(),
        email: key,
        headline: role === "employer" ? "Hiring Manager" : "",
        location: "",
        skills: [],
        experience: [],
        openToWork: role === "candidate",
        ...(role === "employer" && {
          companyId: known?.id ?? `c_${slugify(companyName || "company")}`,
          companyName: known?.name ?? (companyName?.trim() || "Your Company"),
        }),
      };
      persistUsers({ ...users, [key]: newUser });
      setUserId(newUser.id);
      write(SESSION_KEY, newUser.id);
      toast.success("Account created — welcome aboard!");
      return newUser;
    },
    [users, persistUsers],
  );

  const login = useCallback(
    async (email, password) => {
      await delay(550);
      const found = users[email.trim().toLowerCase()];
      if (!found) fail("We couldn't find an account with that email.");
      // Mock check only — this demo never stores real passwords.
      if (password.length < 6) fail("Incorrect password. Please try again.");
      setUserId(found.id);
      write(SESSION_KEY, found.id);
      toast.success(`Welcome back, ${found.name.split(" ")[0]}!`);
      return found;
    },
    [users],
  );

  const logout = useCallback(async () => {
    setUserId(null);
    write(SESSION_KEY, null);
    toast.success("You've been logged out");
  }, []);

  const updateProfile = useCallback(
    (patch) => {
      if (!user) return;
      persistUsers({ ...users, [user.email]: { ...user, ...patch } });
    },
    [user, users, persistUsers],
  );

  const value = useMemo(
    () => ({ user, loading: false, signup, login, logout, updateProfile }),
    [user, signup, login, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
