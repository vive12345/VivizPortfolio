import { useState } from 'react';
import { Code2, Palette, Server } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import data from '../data/about.json';

const icons = { Code2, Palette, Server };
const { photos } = data;

export default function About() {
  const [front, setFront] = useState(0);

  return (
    <section id="me" className="relative scroll-mt-8 px-6 pb-28 pt-[14vw]">
      {/* Light green background that fades in from the middle of the section and out at its end. */}
      <div className="absolute inset-x-0 bottom-0 top-1/2 -z-30 bg-emerald-50 [mask-image:linear-gradient(transparent,black_12rem,black_calc(100%-8rem),transparent)]" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.25fr_1fr]">
        <div>
          <SectionHeading number={data.number}>{data.heading}</SectionHeading>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">{data.intro}</p>

          <p className="mt-8 font-semibold">{data.expertiseTitle}</p>

          <ul className="mt-4 grid gap-3">
            {data.expertise.map(({ icon, title, text }) => {
              const Icon = icons[icon];
              return (
                <li key={title} className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="text-sm text-neutral-500">{text}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-8 max-w-xl leading-relaxed text-neutral-600">{data.more}</p>
        </div>

        {/* Stack of photos; clicking sends the front one to the back. */}
        <button onClick={() => setFront((f) => (f + 1) % photos.length)} title="Click to swap" className="relative mx-auto aspect-4/5 w-4/5 max-w-sm -translate-x-6 cursor-pointer sm:w-full sm:translate-x-0">
          {photos.map(({ src, alt }, i) => {
            const depth = (i - front + photos.length) % photos.length;
            return (
              <img
                key={src}
                src={src}
                alt={alt}
                className="absolute inset-0 size-full rounded-3xl border-4 border-white bg-emerald-100 object-cover shadow-xl transition-transform duration-500"
                style={{ zIndex: photos.length - depth, transform: `translate(${depth * 56}px, ${depth * -24}px) rotate(${depth * 9}deg) scale(${1 - depth * 0.05})` }}
              />
            );
          })}
        </button>
      </div>
    </section>
  );
}
