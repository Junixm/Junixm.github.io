import { useTheme } from "./hooks/useTheme";
import Header from "./components/Header";
import Starfield from "./components/Starfield";
import Particles from "./components/Particles";
import LightBackground from "./components/LightBackground";

function App() {
  const { toggleTheme } = useTheme();

  return (
    <>
      {/* Light mode background canvas */}
      <LightBackground />

      {/* Background layers (dark mode only) */}
      <Starfield />
      <Particles />
      <div className="glow-spot"></div>

      <Header onToggleTheme={toggleTheme} />

      <main className="container">
        <h1>Coming Soon</h1>
        <p>We're crafting something extraordinary.</p>
        <p className="sub">Stay tuned for the reveal.</p>
      </main>
    </>
  );
}

export default App;
