import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import CompaniesPage from "./pages/CompaniesPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Applications from "./pages/dashboard/Applications";
import SavedJobs from "./pages/dashboard/SavedJobs";
import Profile from "./pages/dashboard/Profile";
import MyJobs from "./pages/dashboard/MyJobs";
import Applicants from "./pages/dashboard/Applicants";
import PostJob from "./pages/dashboard/PostJob";

const App = () => (
  <AuthProvider>
    <StoreProvider>
      <Routes>
        {/* Auth screens use their own full-bleed layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="profile" element={<Profile />} />

              <Route element={<ProtectedRoute role="candidate" />}>
                <Route path="applications" element={<Applications />} />
                <Route path="saved" element={<SavedJobs />} />
              </Route>

              <Route element={<ProtectedRoute role="employer" />}>
                <Route path="jobs" element={<MyJobs />} />
                <Route path="applicants" element={<Applicants />} />
                <Route path="post" element={<PostJob />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--surface)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: 600,
            boxShadow: "var(--shadow-pop)",
          },
        }}
      />
    </StoreProvider>
  </AuthProvider>
);

export default App;
