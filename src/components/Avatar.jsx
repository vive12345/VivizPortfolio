// Brings the flat avatar illustration to life: the hand is cut out into its own layer and sways
// from the wrist, while the body breathes. Points are in the image's 1254px pixel space.
const SIZE = 1254;
const HAND = [[20, 390], [355, 390], [365, 600], [365, 655], [300, 700], [265, 765], [222, 835]];
const CUFF = [[215, 868], [110, 856], [40, 843], [20, 850]];

// Hand layer extends under the sleeve so the wrist never shows a gap.
const HAND_LAYER = [...HAND, [215, 930], [20, 930]];
// Body is the whole image minus the hand, traced around it (stopping at the sleeve cuff).
const BODY = [[0, 0], [SIZE, 0], [SIZE, SIZE], [0, SIZE], [0, 850], ...CUFF.slice(0, -1).reverse(), ...[...HAND].reverse(), [0, 390]];

const polygon = (points) => `polygon(${points.map(([x, y]) => `${(x / SIZE) * 100}% ${(y / SIZE) * 100}%`).join(', ')})`;

export default function Avatar({ src, label, className }) {
  return (
    <div role="img" aria-label={label} className={`relative animate-breathe ${className}`}>
      <img src={src} alt="" className="absolute inset-0 size-full animate-wave will-change-transform" style={{ clipPath: polygon(HAND_LAYER), transformOrigin: '10.4% 68.6%' }} />
      <img src={src} alt="" className="relative size-full" style={{ clipPath: polygon(BODY) }} />
    </div>
  );
}
