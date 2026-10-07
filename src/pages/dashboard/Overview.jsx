import { useAuth } from "../../hooks/useAuth";
import CandidateOverview from "./CandidateOverview";
import EmployerOverview from "./EmployerOverview";

const Overview = () => {
  const { user } = useAuth();
  return user.role === "employer" ? <EmployerOverview /> : <CandidateOverview />;
};

export default Overview;
