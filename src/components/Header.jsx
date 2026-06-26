import ThemeToggle from "./ThemeToggle";

export default function Header({ onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#home" className="logo">
          Jun Heng
        </a>
        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
        <ThemeToggle onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
