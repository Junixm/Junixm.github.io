export default function ThemeToggle({ onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle light/dark mode"
    >
      <span className="toggle-track">
        <span className="toggle-thumb"></span>
        <span className="toggle-icon sun">☀︎</span>
        <span className="toggle-icon moon">☽</span>
      </span>
    </button>
  );
}
