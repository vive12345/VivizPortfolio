import { useState } from 'react';
import Note from '../components/Note';
import SectionHeading from '../components/SectionHeading';
import data from '../data/about.json';

const { photos } = data;

export default function About() {
  const [front, setFront] = useState(0);

  return (
    <section id="me" className="relative scroll-mt-8 px-6 pb-28 pt-[14vw]">
      {/* Light green background that fades in from the middle of the section and out at its end. */}
      <div className="absolute inset-x-0 bottom-0 top-1/2 -z-30 bg-emerald-50 [mask-image:linear-gradient(transparent,black_12rem,black_calc(100%-8rem),transparent)]" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.5fr_1fr]">
        <div>
          <SectionHeading number={data.number}>{data.heading}</SectionHeading>
          {/* Job-search status at a glance: what, where, when, and how to reach out. */}
          <Note
            className="mt-8"
            lines={data.openToWork}
            end={
              <>
                {' '}
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${data.email}`} target="_blank" rel="noreferrer" className="whitespace-nowrap underline decoration-neutral-400/60 underline-offset-4 transition-colors hover:text-emerald-700 hover:decoration-emerald-700">
                  {data.email}
                </a>
                .
              </>
            }
          />

          <p className="mt-12 text-xs font-semibold uppercase tracking-widest text-neutral-500">{data.expertiseTitle}</p>

          {/* Rows separated by hairlines, matching Experience and Contact. */}
          <ul className="mt-4 border-t border-neutral-900/10">
            {data.expertise.map(({ title, text }) => (
              <li key={title} className="grid gap-y-1 border-b border-neutral-900/10 py-4 sm:grid-cols-[11rem_1fr] sm:gap-x-6">
                <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight">{title}</span>
                <span className="text-[15px] leading-relaxed text-neutral-500">{text}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[15px] italic leading-relaxed text-neutral-500">{data.more}</p>
        </div>

        {/* Stack of photos; clicking sends the front one to the back. */}
        <button onClick={() => setFront((f) => (f + 1) % photos.length)} title="Click to swap" className="relative mx-auto aspect-4/5 w-3/4 max-w-sm cursor-pointer sm:w-full">
          {photos.map(({ src, alt }, i) => {
            const depth = (i - front + photos.length) % photos.length;
            // Back photos fan out alternately to the right and left so the stack stays centred.
            const side = depth % 2 ? 1 : -1;
            const step = Math.ceil(depth / 2);
            return (
              <img
                key={src}
                src={src}
                alt={alt}
                className="absolute inset-0 size-full rounded-2xl border-4 border-white bg-emerald-100 object-cover shadow-[0_24px_48px_-24px_rgb(0_0_0/0.45)] ring-1 ring-neutral-900/5 transition-transform duration-500"
                style={{ zIndex: photos.length - depth, transform: `translate(${side * step * 48}px, ${step * -20}px) rotate(${side * step * 8}deg) scale(${1 - depth * 0.04})` }}
              />
            );
          })}
        </button>
      </div>
    </section>
  );
}
