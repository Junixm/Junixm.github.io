import { Children, useCallback, useEffect, useRef, useState } from "react";

// Full-page section deck: one wheel notch / swipe / arrow key transitions to
// the next section. Sections taller than the viewport scroll internally (and
// only then show a scrollbar) before the gesture advances to the next one.
const ANIM_MS = 700;
// A "fresh push" — a pause longer than this (ms) OR a re-acceleration (below)
// — re-evaluates whether the current scroll may cross to the next section. The
// decision is: cross only if the section is already at its edge. So a scroll
// begun mid-section stays within it (stopping at the edge), while a fresh
// scroll from the edge — including each stroke of spam-scrolling — crosses.
const GESTURE_GAP = 120;
// A pause this long ends a gesture entirely and lifts the post-cross cooldown.
const IDLE_GAP = 260;
// Inertia decays monotonically, so a delta that grows past the previous one by
// this much signals the user actively pushing again rather than coasting.
const REACCEL = 6;

export default function FullPage({ children }) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const lockRef = useRef(false);
  // Timestamp of the previous wheel event (to detect gesture boundaries) and
  // whether the current gesture is allowed to cross to the next section.
  const lastWheelRef = useRef(0);
  const prevAbsRef = useRef(0);
  const canCrossRef = useRef(false);
  // After a cross, the decaying tail of the same swipe must not trigger
  // another. Cooling blocks the gap rule until a real pause; only an active
  // re-push (re-acceleration) can cross again.
  const coolingRef = useRef(false);
  const slideEls = useRef([]);

  const goTo = useCallback(
    (target) => {
      const clamped = Math.max(0, Math.min(count - 1, target));
      const prev = indexRef.current;
      if (clamped === prev || lockRef.current) return;
      const goingUp = clamped < prev;
      indexRef.current = clamped;
      setIndex(clamped);

      // Down → start the incoming section at its top. Up → start it at the
      // bottom, so a section you scroll back into resumes where you left it.
      const el = slideEls.current[clamped];
      if (el) el.scrollTop = goingUp ? el.scrollHeight : 0;

      lockRef.current = true;
      window.setTimeout(() => {
        lockRef.current = false;
      }, ANIM_MS);
    },
    [count],
  );

  // True when the slide can't scroll further in `dir`, so the gesture should
  // advance to the next section instead of scrolling inside this one.
  const atEdge = (el, dir) => {
    if (!el) return true;
    const scrollable = el.scrollHeight > el.clientHeight + 1;
    if (!scrollable) return true;
    if (dir > 0) return el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    return el.scrollTop <= 0;
  };

  // Wheel
  useEffect(() => {
    function onWheel(e) {
      const dir = e.deltaY > 0 ? 1 : -1;
      const el = slideEls.current[indexRef.current];
      const absDelta = Math.abs(e.deltaY);
      const gap = e.timeStamp - lastWheelRef.current;
      lastWheelRef.current = e.timeStamp;

      const reaccel = absDelta > prevAbsRef.current + REACCEL;
      prevAbsRef.current = absDelta;

      // A real pause ends the previous gesture and lifts the cooldown.
      if (gap > IDLE_GAP) coolingRef.current = false;

      // While a transition animates, swallow input and never let an armed
      // crossing state survive the lock — otherwise the tail of the same swipe
      // crosses again the instant the lock lifts.
      if (lockRef.current) {
        canCrossRef.current = false;
        if (atEdge(el, dir)) e.preventDefault();
        return;
      }

      // A fresh push re-evaluates crossing (allowed only at the edge). The
      // gap rule is suppressed while cooling, so a single swipe's lengthening
      // momentum tail can't cross again; an active re-push always can.
      const freshPush = reaccel || (gap > GESTURE_GAP && !coolingRef.current);
      if (freshPush) canCrossRef.current = atEdge(el, dir);

      // Inside a tall section: scroll natively, and forbid crossing once this
      // gesture later reaches the edge.
      if (!atEdge(el, dir)) {
        canCrossRef.current = false;
        return;
      }

      // At the section edge.
      e.preventDefault();
      if (!canCrossRef.current || absDelta < 4) return;
      canCrossRef.current = false;
      coolingRef.current = true;
      goTo(indexRef.current + dir);
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goTo]);

  // Touch — a swipe only advances if it *started* at the section's edge.
  useEffect(() => {
    let startY = null;
    let startEl = null;
    let edgeDown = false;
    let edgeUp = false;
    function onStart(e) {
      startY = e.touches[0].clientY;
      startEl = slideEls.current[indexRef.current];
      edgeDown = atEdge(startEl, 1);
      edgeUp = atEdge(startEl, -1);
    }
    function onMove(e) {
      if (startY === null) return;
      const dir = startY - e.touches[0].clientY > 0 ? 1 : -1;
      if (atEdge(startEl, dir)) e.preventDefault();
    }
    function onEnd(e) {
      if (startY === null) return;
      const dy = startY - e.changedTouches[0].clientY;
      const dir = dy > 0 ? 1 : -1;
      if (Math.abs(dy) > 50 && ((dir > 0 && edgeDown) || (dir < 0 && edgeUp))) {
        goTo(indexRef.current + dir);
      }
      startY = null;
    }
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [goTo]);

  // Keyboard
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(indexRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(indexRef.current - 1);
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
        goTo(count - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, count]);

  // In-page anchor links (#about, #projects, …) jump to the matching slide.
  useEffect(() => {
    function onClick(e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const i = slideEls.current.findIndex(
        (el) => el && el.querySelector(`#${CSS.escape(id)}`),
      );
      if (i >= 0) {
        e.preventDefault();
        goTo(i);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [goTo]);

  return (
    <div className="fullpage">
      <div
        className="slides"
        style={{ transform: `translateY(-${index * 100}vh)` }}
      >
        {slides.map((child, i) => (
          <div
            key={i}
            className="slide"
            ref={(el) => {
              slideEls.current[i] = el;
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
