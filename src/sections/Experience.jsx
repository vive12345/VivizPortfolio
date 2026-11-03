import SectionHeading from '../components/SectionHeading';
import data from '../data/experience.json';

// Renders "**text**" in the JSON as bold, to make the numbers stand out.
const highlight = (text) => text.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 ? <strong key={i} className="font-semibold text-neutral-900">{part}</strong> : part));

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-8 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading number={data.number}>{data.heading}</SectionHeading>

        {/* Timeline: a line down the left with a dot per job. */}
        <ol className="ml-2 mt-10 grid gap-10 border-l-2 border-neutral-200">
          {data.jobs.map(({ role, company, period, points }) => (
            <li key={company} className="relative pl-6 md:pl-10">
              <span className="absolute -left-[8px] top-1 size-3.5 rounded-full border-[3px] border-white bg-emerald-500 ring-4 ring-emerald-100" />
              <article>
                <header className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold">{role}</h3>
                    <p className="text-sm font-medium text-emerald-700">{company}</p>
                  </div>
                  <span className="text-xs font-medium text-neutral-500">{period}</span>
                </header>
                <ul className="mt-3 grid gap-1.5 text-sm leading-relaxed text-neutral-600">
                  {points.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-emerald-500" />
                      <span>{highlight(point)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
