import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import data from '../data/about.json';

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

          <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-neutral-500">{data.expertiseTitle}</p>

          {/* Plain rows separated by hairlines, matching Experience and Contact. */}
          <ul className="mt-4 border-t border-neutral-900/10">
            {data.expertise.map(({ title, text }) => (
              <li key={title} className="grid gap-1 border-b border-neutral-900/10 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <span className="font-medium">{title}</span>
                <span className="text-[15px] leading-relaxed text-neutral-600">{text}</span>
              </li>
            ))}
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
                className="absolute inset-0 size-full rounded-2xl border-4 border-white bg-emerald-100 object-cover shadow-[0_24px_48px_-24px_rgb(0_0_0/0.45)] ring-1 ring-neutral-900/5 transition-transform duration-500"
                style={{ zIndex: photos.length - depth, transform: `translate(${depth * 56}px, ${depth * -24}px) rotate(${depth * 9}deg) scale(${1 - depth * 0.05})` }}
              />
            );
          })}
        </button>
      </div>
    </section>
  );
}
