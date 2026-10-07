import { useState } from "react";
import { X } from "lucide-react";

// Type a value and press Enter (or comma) to add it as a tag.
const TagInput = ({ id, value, onChange, placeholder = "Add a skill and press Enter", max = 12 }) => {
  const [draft, setDraft] = useState("");

  const add = () => {
    const tag = draft.trim().replace(/,$/, "");
    if (tag && !value.some((v) => v.toLowerCase() === tag.toLowerCase()) && value.length < max) {
      onChange([...value, tag]);
    }
    setDraft("");
  };

  return (
    <div className="field flex flex-wrap items-center gap-2 !p-2 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15">
      {value.map((tag) => (
        <span key={tag} className="badge badge-brand !rounded-lg !py-1.5">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((v) => v !== tag))} aria-label={`Remove ${tag}`} className="rounded p-0.5 hover:bg-brand-500/20">
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
        placeholder={value.length ? "" : placeholder}
        className="min-w-[140px] flex-1 bg-transparent px-1.5 py-1 text-sm text-ink placeholder:text-ink-3 focus:outline-none"
      />
    </div>
  );
};

export default TagInput;
