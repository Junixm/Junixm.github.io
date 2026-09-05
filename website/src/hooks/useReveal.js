import { useEffect, useRef, useState } from "react";

const THRESHOLD = 0.18;

// Reveal-on-scroll: returns a ref to attach to an element and a boolean that
// flips true once the element scrolls into view (and stays true). Used to
// drive the fade/slide transitions between sections. Respects
// reduced-motion by revealing immediately.
export function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: THRESHOLD },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
