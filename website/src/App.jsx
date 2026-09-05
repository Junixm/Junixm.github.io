import { useTheme } from "./hooks/useTheme";
import Header from "./components/Header";
import Starfield from "./components/Starfield";
import Particles from "./components/Particles";
import LightBackground from "./components/LightBackground";
import FullPage from "./components/FullPage";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  const { toggleTheme } = useTheme();

  return (
    <>
      {/* Light mode background canvas */}
      <LightBackground />

      {/* Background layers (dark mode only) — fixed, so they persist as
          the page scrolls through sections. */}
      <Starfield />
      <Particles />
      <div className="glow-spot"></div>

      <Header onToggleTheme={toggleTheme} />

      <FullPage>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </FullPage>

      <Footer />
    </>
  );
}

export default App;
