import Section from "./Section";
import { hero } from "../content";

export default function Hero() {
  return (
    <Section id="home" className="hero" variant="up">
      <p className="hero-eyebrow">{hero.eyebrow}</p>
      <h1 className="hero-title">
        Hi, I'm <span className="accent">{hero.name}</span>
      </h1>
      <p className="hero-tagline">{hero.tagline}</p>
      <div className="hero-actions">
        <a href={hero.cta_href} className="cta-button">
          {hero.cta_label}
        </a>
        <a
          href={hero.github}
          className="icon-button"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <img src="/images/github-mark.svg" alt="" />
        </a>
        <a
          href={hero.linkedin}
          className="icon-button"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <img src="/images/InBug-Black.png" alt="" />
        </a>
      </div>
      <a href="#about" className="scroll-cue" aria-label="Scroll to about">
        <span></span>
      </a>
    </Section>
  );
}
