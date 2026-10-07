import {
  Code2,
  Palette,
  Layers,
  BrainCircuit,
  Megaphone,
  Handshake,
  Landmark,
  Headset,
  Workflow,
  HeartPulse,
} from "lucide-react";

export const categories = [
  { id: "engineering", label: "Engineering", icon: Code2, tint: "from-indigo-500 to-violet-500" },
  { id: "data-ai", label: "Data & AI", icon: BrainCircuit, tint: "from-fuchsia-500 to-purple-500" },
  { id: "design", label: "Design", icon: Palette, tint: "from-rose-500 to-orange-400" },
  { id: "product", label: "Product", icon: Layers, tint: "from-sky-500 to-cyan-400" },
  { id: "marketing", label: "Marketing", icon: Megaphone, tint: "from-amber-500 to-yellow-400" },
  { id: "sales", label: "Sales", icon: Handshake, tint: "from-emerald-500 to-teal-400" },
  { id: "finance", label: "Finance", icon: Landmark, tint: "from-blue-600 to-indigo-500" },
  { id: "customer-success", label: "Customer Success", icon: Headset, tint: "from-pink-500 to-rose-400" },
  { id: "operations", label: "Operations", icon: Workflow, tint: "from-slate-600 to-slate-400" },
  { id: "healthcare", label: "Healthcare & Science", icon: HeartPulse, tint: "from-teal-500 to-green-400" },
];

export const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]));

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
export const WORK_MODES = ["Remote", "Hybrid", "On-site"];
export const LEVELS = ["Entry", "Mid", "Senior", "Lead"];

export const LEVEL_LABELS = {
  Entry: "Entry level",
  Mid: "Mid level",
  Senior: "Senior",
  Lead: "Lead / Staff",
};
