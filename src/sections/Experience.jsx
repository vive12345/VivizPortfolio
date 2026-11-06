import BulletList from '../components/BulletList';
import SectionHeading from '../components/SectionHeading';
import data from '../data/experience.json';

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-8 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading number={data.number}>{data.heading}</SectionHeading>

        {/* One row per job, separated by hairlines: dates and company on the left, the work on the right. */}
        <ol className="mt-12 border-t border-neutral-900/10">
          {data.jobs.map(({ role, company, period, summary, points }) => (
            <li key={company} className="grid gap-x-12 gap-y-4 border-b border-neutral-900/10 py-10 md:grid-cols-[13rem_1fr]">
              <div>
                <p className="text-sm tabular-nums text-neutral-500">{period}</p>
                <p className="mt-1 font-medium">{company}</p>
              </div>
              <article>
                <h3 className="text-xl font-semibold tracking-tight">{role}</h3>
                <p className="mt-1 italic text-neutral-500">{summary}</p>
                <BulletList items={points} />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
