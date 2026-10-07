import { Bookmark } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../hooks/useStore";
import { cn } from "../../utils/helpers";

// Bookmark toggle. Hidden for employer accounts; prompts guests to log in.
const SaveButton = ({ jobId, className, withLabel = false }) => {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (user?.role === "employer") return null;
  const saved = isSaved(jobId);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast("Log in to save jobs for later", { icon: "🔖" });
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }
    toggleSave(jobId);
  };

  return (
    <button
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved jobs" : "Save job"}
      className={cn(
        withLabel
          ? "btn btn-secondary"
          : "inline-flex size-9 items-center justify-center rounded-xl border border-line bg-surface text-ink-3 transition hover:border-brand-300 hover:text-brand-text",
        saved && "!border-brand-300 !bg-brand-soft !text-brand-text",
        className,
      )}
    >
      <Bookmark className={cn("size-[18px]", saved && "fill-current")} />
      {withLabel && (saved ? "Saved" : "Save")}
    </button>
  );
};

export default SaveButton;
