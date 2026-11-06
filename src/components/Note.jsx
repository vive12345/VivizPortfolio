import { ArrowRight } from 'lucide-react';

// A side note beside a green line: one sentence per line, each led by a small arrow.
// `end` is appended to the last sentence (used for the email link in About).
export default function Note({ lines, end, className = '' }) {
  return (
    <ul className={`grid gap-2 border-l-2 border-emerald-500 pl-5 text-[15px] italic leading-relaxed text-neutral-500 ${className}`}>
      {lines.map((line, i) => (
        <li key={line} className="flex gap-2.5">
          <ArrowRight size={15} className="mt-[0.3rem] shrink-0 text-emerald-600" />
          <span>
            {line}
            {i === lines.length - 1 && end}
          </span>
        </li>
      ))}
    </ul>
  );
}
