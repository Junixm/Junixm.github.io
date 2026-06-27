import Section from "./Section";
import { about } from "../content";

const { tags: skills, cards: infoCards } = about;

export default function About() {
  return (
    <Section id="about" className="about" variant="up">
      <h2 className="section-title">About Me</h2>

      <div className="about-intro">
        <div className="about-image">
          <span className="about-image-ring"></span>
          <img src={about.profile_pic} alt={about.profile_alt} />
        </div>
        <div className="about-text">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="skills">
            {skills.map((s) => (
              <span key={s} className="skill-tag">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="contributions">
        <h3>GitHub Contributions</h3>
        <img
          src={about.contributions_chart}
          alt="GitHub Contribution Chart"
        />
      </div>

      <div className="info-section">
        {infoCards.map((card) => (
          <div key={card.title} className="info-card">
            <h3>{card.title}</h3>
            <ul>
              {card.items.map((item, i) => {
                const heads = Array.isArray(item.head) ? item.head : [item.head];
                const subs = item.sub
                  ? Array.isArray(item.sub)
                    ? item.sub
                    : [item.sub]
                  : [];
                return (
                  <li key={i}>
                    {heads.map((h, hi) => (
                      <strong key={hi}>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="cert-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {h}
                          </a>
                        ) : (
                          h
                        )}
                      </strong>
                    ))}
                    {subs.map((s, si) => (
                      <span key={si}>{s}</span>
                    ))}
                    {item.meta && (
                      <span className="meta-row">
                        <span>{item.meta.left}</span>
                        <span>{item.meta.right}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <a href="#projects" className="scroll-cue" aria-label="Scroll to projects">
        <span></span>
      </a>
    </Section>
  );
}
