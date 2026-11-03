// Renders "**text**" in the JSON as bold, to make the numbers stand out.
const highlight = (text) => text.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 ? <strong key={i} className="font-semibold text-neutral-900">{part}</strong> : part));

// Bullet points with thin dash markers, used by Experience and Projects.
export default function BulletList({ items }) {
  return (
    <ul className="mt-4 grid gap-2.5 text-[15px] leading-relaxed text-neutral-600">
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span className="mt-[0.7rem] h-px w-3 shrink-0 bg-neutral-400" />
          <span>{highlight(item)}</span>
        </li>
      ))}
    </ul>
  );
}
