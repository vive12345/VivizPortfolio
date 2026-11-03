import { useEffect, useRef } from 'react';

const COLORS = ['#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444'];
const PIECES = 180;

// Full-screen confetti fired from both bottom corners each time `bursts` goes up.
export default function Confetti({ bursts }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!bursts || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const pieces = Array.from({ length: PIECES }, (_, i) => {
      const side = i % 2 ? 1 : -1; // alternate left and right corner
      return {
        x: side > 0 ? 0 : innerWidth,
        y: innerHeight,
        vx: side * (4 + Math.random() * 10),
        vy: -(12 + Math.random() * 14),
        size: 6 + Math.random() * 6,
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        color: COLORS[i % COLORS.length],
      };
    });

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.vy += 0.35;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (pieces.some((p) => p.y < canvas.height + 20)) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [bursts]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50 size-full" />;
}
