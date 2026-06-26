import ThemeToggle from "./ThemeToggle";

export default function Header({ onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <span className="logo">Jun Heng</span>
        <ThemeToggle onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
