import { ArrowUpRight } from 'lucide-react';
import BulletList from '../components/BulletList';
import SectionHeading from '../components/SectionHeading';
import data from '../data/projects.json';

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-8 px-6 pb-28 pt-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading number={data.number}>{data.heading}</SectionHeading>

        {/* Same row layout as Experience: project number on the left, details and tech stack on the right. */}
        <ol className="mt-12 border-t border-neutral-900/10">
          {data.projects.map(({ title, subtitle, stack, link, points }, i) => (
            <li key={title} className="grid gap-x-12 gap-y-4 border-b border-neutral-900/10 py-10 md:grid-cols-[13rem_1fr]">
              <p className="text-sm tabular-nums text-neutral-500">{String(i + 1).padStart(2, '0')}</p>
              <article>
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-1 italic text-neutral-500">{subtitle}</p>
                <BulletList items={points} />
                <p className="mt-4 text-sm italic leading-relaxed text-neutral-500">
                  {data.stackLabel} {stack.join(' · ')}
                </p>
                {link && (
                  <a href={link} target="_blank" rel="noreferrer" className="group relative mt-6 inline-flex items-center gap-1.5 py-1 text-sm font-medium">
                    {data.linkLabel}
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-neutral-900 transition-transform duration-300 group-hover:scale-x-100" />
                  </a>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
