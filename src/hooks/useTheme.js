import { useCallback, useState } from "react";

const KEY = "hirova:theme";

export const useTheme = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem(KEY, next ? "dark" : "light");
      } catch {
        /* theme just won't persist */
      }
      return next;
    });
  }, []);

  return { dark, toggle };
};
