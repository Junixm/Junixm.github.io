import Section from "./Section";

const skills = [
  "Computer Security",
  "Cloud Security",
  "Web Security",
  "Penetration Testing",
  "Risk Assessment",
  "Metasploit",
];

const infoCards = [
  {
    title: "Education",
    items: [
      {
        head: "Bachelor of Computing in Information Security",
        meta: { school: "National University of Singapore", year: "May 2027" },
      },
      {
        head: "Diploma in Electronic and Computer Engineering",
        meta: { school: "Ngee Ann Polytechnic", year: "2021" },
      },
      {
        head: "Diploma Plus in Advanced Engineering Mathematics",
        meta: { school: "Ngee Ann Polytechnic", year: "2021" },
      },
    ],
  },
  {
    title: "Key Modules",
    items: [
      { head: "IFS4103 — Penetration Testing Practice" },
      { head: "IS4231 — Information Security Management" },
      { head: "IFS4205 — Information Security Capstone Project" },
      { head: "CS4238 — Computer Security Practice" },
      { head: "CS3235 — Computer Security" },
    ],
  },
  {
    title: "CTF Participation",
    items: [
      { head: "DSTA BrainHack 2025 — CDDC", sub: "Participated" },
      { head: "NUS Greyhats WelcomeCTF 2025", sub: "Participated" },
      { head: "CSIT TISC 2025", sub: "Participated" },
    ],
  },
  {
    title: "Certifications | Badges",
    items: [
      {
        head: "Cloud Foundations",
        sub: "AWS Academy Graduate — Training Badge",
        href: "https://www.credly.com/badges/dbca4fcb-94b1-411b-94af-74367c71ec96",
      },
      {
        head: "Cloud Security Foundations",
        sub: "AWS Academy Graduate — Training Badge",
        href: "https://www.credly.com/badges/bcc1b9d1-ee46-4fcb-a380-ce720c269e52",
      },
    ],
  },
];

export default function About() {
  return (
    <Section id="about" className="about" variant="up">
      <h2 className="section-title">About Me</h2>

      <div className="about-intro">
        <div className="about-image">
          <span className="about-image-ring"></span>
          <img src="/images/me.png" alt="Jun Heng" />
        </div>
        <div className="about-text">
          <p>
            I'm an information security student passionate about protecting
            digital systems and understanding cybersecurity threats. I'm
            developing expertise in ethical hacking, network security, and
            secure system design.
          </p>
          <p>
            Beyond academics, I have a keen interest in perfumes, tea, cafe
            hopping, K-pop, and photography.
          </p>
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
          src="https://ghchart.rshah.org/8a2be2/junixm"
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
                      <span className="school-row">
                        <span>{item.meta.school}</span>
                        <span>{item.meta.year}</span>
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
