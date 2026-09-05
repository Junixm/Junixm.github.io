import { useEffect, useMemo, useRef } from "react";

// Fewer stars on small screens — they get cramped and hurt performance.
function getStarCount() {
  if (typeof window !== "undefined" && window.innerWidth < 600) return 60;
  return 150;
}

// Generate the star field once. Each star gets a random position, size,
// twinkle duration and a parallax speed bucket (slow / medium / fast).
function createStars() {
  const count = getStarCount();
  return Array.from({ length: count }, (_, i) => {
    const size = Math.random() * 3 + 1;
    const speed = i % 3 === 0 ? 0.5 : i % 3 === 1 ? 1.2 : 1.8;
    return {
      left: Math.random() * 100,
      top: Math.random() * 100,
      size,
      // Slow, gentle twinkle (6–12s per cycle).
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 4,
      speed,
    };
  });
}

export default function Starfield() {
  const stars = useMemo(createStars, []);
  const containerRef = useRef(null);

  // Parallax: shift each star opposite the cursor, scaled by its speed.
  // Skip entirely on touch devices (no mouse, so it would never fire — and
  // we avoid attaching a useless listener).
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function handleMouseMove(e) {
      const children = containerRef.current?.children;
      if (!children) return;
      const offsetX = e.clientX / window.innerWidth - 0.5;
      const offsetY = e.clientY / window.innerHeight - 0.5;
      for (const el of children) {
        const speed = parseFloat(el.dataset.speed) || 1;
        el.style.setProperty("--px", offsetX * speed * 40 + "px");
        el.style.setProperty("--py", offsetY * speed * 40 + "px");
      }
    }
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="stars" ref={containerRef}>
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          data-speed={star.speed}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            "--duration": `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
