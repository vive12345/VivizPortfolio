import SectionHeading from '../components/SectionHeading';
import data from '../data/education.json';

export default function Education() {
  return (
    <section id="education" className="scroll-mt-8 px-6 pt-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading number={data.number}>{data.heading}</SectionHeading>

        {/* Same row layout as Experience: dates on the left, school and degree on the right. */}
        <ol className="mt-12 border-t border-neutral-900/10">
          {data.schools.map(({ school, degree, period }) => (
            <li key={school} className="grid gap-x-12 gap-y-2 border-b border-neutral-900/10 py-8 md:grid-cols-[13rem_1fr]">
              <p className="text-sm tabular-nums text-neutral-500 md:pt-1">{period}</p>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{school}</h3>
                <p className="mt-1 text-neutral-600">{degree}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
