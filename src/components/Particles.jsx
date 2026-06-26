import { useMemo } from "react";

const PARTICLE_COUNT = 8;

// Large, soft, slowly drifting blobs (dark mode only).
function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const size = Math.random() * 60 + 30;
    return {
      left: Math.random() * 100,
      top: Math.random() * 100,
      size,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    };
  });
}

export default function Particles() {
  const particles = useMemo(createParticles, []);

  return (
    <div className="particles">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            "--duration": `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
