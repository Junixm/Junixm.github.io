import { useCallback, useEffect, useRef, useState } from "react";
import Section from "./Section";
import { projects } from "../content";

const GAP = 28;

export default function Projects() {
  const trackRef = useRef(null);
  const sliderRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState({ width: 100, left: 0 });

  const getStep = () => {
    const card = trackRef.current?.children[0];
    return card ? card.getBoundingClientRect().width + GAP : 0;
  };

  // Re-derive everything from actual layout: whether there's room left to
  // scroll either way, and how much of the row is currently in view (drives
  // the slider thumb's size/position) — kept in sync with drag/touch
  // scrolling too, not just the arrow buttons.
  const recompute = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < maxScroll - 4);

    const widthPct = Math.min(100, (track.clientWidth / track.scrollWidth) * 100);
    const leftPct = maxScroll > 0 ? (track.scrollLeft / maxScroll) * (100 - widthPct) : 0;
    setProgress({ width: widthPct, left: leftPct });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    recompute();
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        recompute();
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => recompute());
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [recompute]);

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * getStep(), behavior: "smooth" });
  };

  // Click anywhere on the slider track to jump straight to that position.
  const seek = (e) => {
    const track = trackRef.current;
    const slider = sliderRef.current;
    if (!track || !slider) return;
    const rect = slider.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const maxScroll = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: ratio * maxScroll, behavior: "smooth" });
  };

  const hasOverflow = canPrev || canNext;

  return (
    <Section id="projects" className="projects" variant="up">
      <h2 className="section-title">Past Projects</h2>
      <div className="projects-carousel">
        <button
          type="button"
          className="carousel-arrow carousel-arrow-prev"
          onClick={() => scrollBy(-1)}
          disabled={!canPrev}
          aria-label="Previous project"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="projects-grid" ref={trackRef}>
          {projects.map((p) => (
            <article key={p.title} className="project-card">
              <div className="project-image">
                {p.image ? <img src={p.image} alt={p.title} /> : <span>{p.label}</span>}
              </div>
              <div className="project-content">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="project-links">
                  {p.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="project-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="carousel-arrow carousel-arrow-next"
          onClick={() => scrollBy(1)}
          disabled={!canNext}
          aria-label="Next project"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {hasOverflow && (
        <div
          className="carousel-slider"
          ref={sliderRef}
          onClick={seek}
          role="slider"
          aria-label="Project carousel position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress.left)}
        >
          <div
            className="carousel-slider-thumb"
            style={{ width: `${progress.width}%`, left: `${progress.left}%` }}
          />
        </div>
      )}

      <a href="#contact" className="scroll-cue" aria-label="Scroll to contact">
        <span></span>
      </a>
    </Section>
  );
}
