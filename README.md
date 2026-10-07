# Hirova — Job Portal Frontend

Hirova is a job portal frontend where candidates can browse and apply to jobs, and employers can post jobs and review applicants. It is a client-only demo: accounts, jobs and applications are stored in the browser's `localStorage`, so it works fully offline with no backend.

## Features

**Everyone**
- Browse and search jobs, with filters (`/jobs`) and job detail pages
- Browse companies and company profiles
- Light / dark theme
- Sign up and log in as a candidate or an employer

**Candidates** (`/dashboard`)
- Apply to jobs through an application modal
- Track applications
- Save jobs for later
- Edit profile (headline, skills, experience, resume)

**Employers** (`/dashboard`)
- Post new jobs
- Manage posted jobs
- View applicants for each job

## Tech stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [React Router 7](https://reactrouter.com)
- [Tailwind CSS 4](https://tailwindcss.com)
- [react-hot-toast](https://react-hot-toast.com) for notifications
- [lucide-react](https://lucide.dev) for icons
- ESLint 9

## Getting started

Requires Node.js 18+ (20+ recommended).

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173.

### Demo accounts

| Role      | Email                  | Password      |
| --------- | ---------------------- | ------------- |
| Candidate | candidate@example.com  | password123   |
| Employer  | employer@example.com   | password123   |

You can also create your own account from `/signup`.

### Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the dev server                |
| `npm run build`   | Create a production build in `dist` |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Run ESLint                          |

## Environment variables

Firebase is configured in `src/services/firebase.js` but is **not currently used** by the app (auth and data are mocked locally). If you want to use it, create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Project structure

```
src/
├── components/
│   ├── jobs/        # JobCard, JobFilters, SearchBar, ApplyModal, SaveButton
│   ├── layout/      # Layout, AuthLayout, Footer, ProtectedRoute
│   ├── navbar/      # Navbar
│   └── ui/          # Shared UI (Modal, Field, TagInput, Logo, ...)
├── context/         # AuthContext (mock auth) and StoreContext (jobs, applications, saved)
├── data/            # Seed data: jobs, companies, categories, people
├── hooks/           # useAuth, useStore, useTheme
├── pages/           # Route pages
│   └── dashboard/   # Candidate and employer dashboard pages
├── services/        # Firebase setup (currently unused)
└── utils/           # Helpers and job filtering
```

## Routes

| Path                                   | Access    | Page                    |
| -------------------------------------- | --------- | ----------------------- |
| `/`                                    | Public    | Home                    |
| `/jobs`, `/jobs/:id`                   | Public    | Job listing and detail  |
| `/companies`, `/companies/:id`         | Public    | Company listing and detail |
| `/login`, `/signup`                    | Public    | Authentication          |
| `/dashboard`, `/dashboard/profile`     | Logged in | Overview and profile    |
| `/dashboard/applications`, `/dashboard/saved` | Candidate | Applications and saved jobs |
| `/dashboard/jobs`, `/dashboard/applicants`, `/dashboard/post` | Employer | Manage jobs, applicants, post a job |

## Data and persistence

Mock data lives in browser `localStorage` under the `hirova:` prefix (`hirova:users`, `hirova:session`, `hirova:theme`, plus the store data). To reset the demo, clear site data in your browser's dev tools.

The auth context exposes `user`, `signup`, `login` and `logout`, so a real backend (for example Firebase) can replace the mock without changing the pages.
