import Section from "./Section";

export default function Contact() {
  return (
    <Section id="contact" className="contact" variant="scale">
      <h2 className="section-title">Let's Connect</h2>
      <p className="contact-lead">
        I'm always interested in discussing cybersecurity topics, collaborating
        on security projects, or exploring internship opportunities.
      </p>
      <div className="social-links">
        <a href="mailto:leejunheng2001@gmail.com" className="social-link">
          Email Me
        </a>
        <a
          href="https://github.com/junixm"
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/lee-jun-heng-250750169"
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </Section>
  );
}
