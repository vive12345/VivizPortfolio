import Note from '../components/Note';
import SectionHeading from '../components/SectionHeading';
import data from '../data/techStack.json';

export default function TechStack() {
  return (
    <section id="tech-stack" className="scroll-mt-8 px-6 pb-28 pt-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading number={data.number}>{data.heading}</SectionHeading>
        <Note className="mt-8 max-w-2xl" lines={data.note} />

        {/* Same row layout as Experience: the domain on the left, the tools used in it on the right. */}
        <ul className="mt-12 border-t border-neutral-900/10">
          {data.groups.map(({ domain, tools }) => (
            <li key={domain} className="grid gap-x-12 gap-y-1 border-b border-neutral-900/10 py-5 md:grid-cols-[13rem_1fr]">
              <h3 className="font-semibold tracking-tight">{domain}</h3>
              <p className="leading-relaxed text-neutral-600">{tools.join('  ·  ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
