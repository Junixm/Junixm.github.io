import { useEffect, useRef } from "react";

// Canvas-rendered backdrop shown in light mode: a soft radial wash, a
// vignetted dot grid and a few large blurry blobs for depth.
function draw(canvas, ctx) {
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  // Soft gradient wash
  const grad = ctx.createRadialGradient(
    width * 0.35,
    height * 0.3,
    0,
    width * 0.5,
    height * 0.5,
    width * 0.85,
  );
  grad.addColorStop(0, "rgba(180, 120, 255, 0.18)");
  grad.addColorStop(0.5, "rgba(138,  43, 226, 0.07)");
  grad.addColorStop(1, "rgba(245, 243, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Dot grid, fading out from the centre
  const spacing = 28;
  const radius = 1.2;
  for (let x = spacing / 2; x < width; x += spacing) {
    for (let y = spacing / 2; y < height; y += spacing) {
      const dx = x / width - 0.5;
      const dy = y / height - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const alpha = Math.max(0, 0.22 - dist * 0.5);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(138, 43, 226, ${alpha})`;
      ctx.fill();
    }
  }

  // A few large soft blobs for depth
  const blobs = [
    { x: 0.15, y: 0.2, r: 0.22, c: "rgba(190, 130, 255, 0.12)" },
    { x: 0.85, y: 0.75, r: 0.28, c: "rgba(138,  43, 226, 0.08)" },
    { x: 0.6, y: 0.15, r: 0.18, c: "rgba(210, 180, 255, 0.14)" },
  ];
  blobs.forEach((b) => {
    const bg = ctx.createRadialGradient(
      b.x * width,
      b.y * height,
      0,
      b.x * width,
      b.y * height,
      b.r * width,
    );
    bg.addColorStop(0, b.c);
    bg.addColorStop(1, "rgba(245,243,255,0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
  });
}

export default function LightBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(canvas, ctx);
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas className="light-bg" ref={canvasRef} />;
}
