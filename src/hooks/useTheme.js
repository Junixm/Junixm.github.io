import { useCallback, useEffect, useState } from "react";

// Resolve the initial theme: saved preference, else time-of-day
// (day 7am–7pm → light, night → dark). Reads the attribute the inline
// script in index.html already set, so state matches the painted DOM.
function getInitialTheme() {
  if (typeof document !== "undefined") {
    const current = document.documentElement.getAttribute("data-theme");
    if (current) return current;
  }
  const saved =
    typeof localStorage !== "undefined" && localStorage.getItem("theme");
  if (saved) return saved;
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  // Keep the <html data-theme> attribute and saved preference in sync.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
