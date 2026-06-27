import Section from "./Section";
import { projects } from "../content";

export default function Projects() {
  return (
    <Section id="projects" className="projects" variant="up">
      <h2 className="section-title">Past Projects</h2>
      <div className="projects-grid">
        {projects.map((p) => (
          <article key={p.title} className="project-card">
            <div className="project-image">
              {p.image ? <img src={p.image} alt={p.title} /> : <span>{p.label}</span>}
            </div>
            <div className="project-content">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="project-links">
                <a
                  href={p.link}
                  className="project-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.link_label}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <a href="#contact" className="scroll-cue" aria-label="Scroll to contact">
        <span></span>
      </a>
    </Section>
  );
}
