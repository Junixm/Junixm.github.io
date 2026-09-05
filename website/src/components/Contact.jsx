import Section from "./Section";
import { contact } from "../content";

export default function Contact() {
  return (
    <Section id="contact" className="contact" variant="scale">
      <h2 className="section-title">{contact.title}</h2>
      <p className="contact-lead">{contact.lead}</p>
      <div className="social-links">
        <a href={contact.email} className="social-link">
          Email Me
        </a>
        <a
          href={contact.github}
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href={contact.linkedin}
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
