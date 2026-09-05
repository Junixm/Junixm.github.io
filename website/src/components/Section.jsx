import { useReveal } from "../hooks/useReveal";

// A full-height scroll section that fades + slides its content into view as
// it enters the viewport. `variant` picks the transition flavour so adjacent
// sections feel distinct instead of one uniform scroll.
export default function Section({ id, className = "", variant = "up", children }) {
  const { ref, visible } = useReveal();

  return (
    <section
      id={id}
      ref={ref}
      className={`section reveal reveal-${variant} ${visible ? "is-visible" : ""} ${className}`}
    >
      <div className="section-inner">{children}</div>
    </section>
  );
}
