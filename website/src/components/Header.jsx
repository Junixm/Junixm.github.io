import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header({ onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // Dismiss the dropdown when clicking anywhere outside it (the hamburger
  // toggles itself, and links/toggle inside the menu are left alone).
  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e) {
      if (e.target.closest(".mobile-menu") || e.target.closest(".hamburger")) {
        return;
      }
      setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#home" className="logo" onClick={closeMenu}>
          Jun Heng
        </a>

        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Theme toggle in the header on desktop */}
        <ThemeToggle onToggle={onToggleTheme} />

        {/* Hamburger replaces the toggle on mobile */}
        <button
          className={`hamburger ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile dropdown: nav links + theme toggle */}
      <nav className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        <a href="#about" onClick={closeMenu}>
          About
        </a>
        <a href="#projects" onClick={closeMenu}>
          Projects
        </a>
        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>
        <div className="mobile-menu-toggle">
          <span>Theme</span>
          <ThemeToggle onToggle={onToggleTheme} />
        </div>
      </nav>
    </header>
  );
}
