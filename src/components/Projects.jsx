import Section from "./Section";

const projects = [
  {
    title: "Secure Digital Wallet Web Application",
    image:
      "https://raw.githubusercontent.com/Junixm/Wallet_Web_App/refs/heads/master/user_page.png",
    description:
      "A simplified personal project based on the IFS4205 capstone project. Features simpler user roles and functionalities. Includes JWT authentication, RBAC, and secure password hashing.",
    link: "https://github.com/Junixm/Wallet_Web_App",
    linkLabel: "GitHub Repo",
  },
  {
    title: "IFS4205 Capstone Project: NUSBank Application",
    label: "NUSBank Application",
    description:
      "A security-focused digital bank web app. Responsible for containerization, AWS cloud architecture design and implementation, and CI/CD pipelines for security scanning and deployment.",
    link: "https://github.com/Junixm/IFS4205",
    linkLabel: "GitHub Repo",
  },
  {
    title: "CS4238 CTF Assignment Writeup",
    label: "CTF Assignment",
    description:
      "Final group CTF assignment write-up based on course concepts. Successfully identified flags across multiple stages, including network enumeration (Nmap), privilege escalation, and SQL injection.",
    link: "https://github.com/Junixm/CS4238",
    linkLabel: "Writeup",
  },
];

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
                  {p.linkLabel}
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
