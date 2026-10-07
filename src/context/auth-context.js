import { createContext } from "react";

export const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = {
  candidate: { email: "candidate@example.com", password: "password123" },
  employer: { email: "employer@example.com", password: "password123" },
};
