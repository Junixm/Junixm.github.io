import Section from "./Section";

export default function Hero() {
  return (
    <Section id="home" className="hero" variant="up">
      <p className="hero-eyebrow">Information Security Student @ NUS</p>
      <h1 className="hero-title">
        Hi, I'm <span className="accent">Jun Heng</span>
      </h1>
      <p className="hero-tagline">
        Securing digital systems — ethical hacking, cloud security and secure
        design.
      </p>
      <div className="hero-actions">
        <a href="#projects" className="cta-button">
          View My Work
        </a>
        <a
          href="https://github.com/junixm"
          className="icon-button"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <img src="/images/github-mark.svg" alt="" />
        </a>
        <a
          href="https://www.linkedin.com/in/lee-jun-heng-250750169"
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
