import { ArrowRight, ArrowUpRight, CalendarDays, Mail } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import data from '../data/contact.json';

// Brand logos (lucide has none); paths from simpleicons.org.
const brand = (path) => ({ size, className }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden="true">
    <path d={path} />
  </svg>
);
const icons = {
  mail: Mail,
  github: brand('M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3'),
  leetcode: brand('M13.48 0a1.37 1.37 0 0 0-.96.44L7.12 6.23l-3.86 4.12a5.27 5.27 0 0 0-1.33 2.62 5.53 5.53 0 0 0 .06 2.36 5.94 5.94 0 0 0 1.62 2.84l4.28 4.19.04.04c2.25 2.16 5.85 2.13 8.06-.08l2.4-2.39a1.38 1.38 0 1 0-1.95-1.96l-2.4 2.4a3.02 3.02 0 0 1-4.2.03l-.02-.02-4.28-4.19c-.65-.64-.97-1.47-.95-2.26a2.68 2.68 0 0 1 .07-.53 2.55 2.55 0 0 1 .62-1.16l3.86-4.13c1.06-1.13 3.2-1.27 4.43-.28l3.5 2.83a1.38 1.38 0 0 0 1.73-2.15l-3.5-2.83a5.98 5.98 0 0 0-2.77-1.2l2.01-2.16A1.38 1.38 0 0 0 13.48 0zm-2.86 12.82a1.38 1.38 0 1 0 0 2.76h10.17a1.38 1.38 0 1 0 0-2.76z'),
  linkedin: brand('M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z'),
};

export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-8 px-6 pb-10 pt-28">
      {/* Light green background that fades in, matching the About section. */}
      <div className="absolute inset-0 -z-30 bg-emerald-50 [mask-image:linear-gradient(transparent,black_16rem)]" />

      <div className="mx-auto max-w-6xl">
        <SectionHeading number={data.number}>{data.heading}</SectionHeading>

        <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <h3 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{data.title}</h3>
            <p className="mt-5 max-w-md leading-relaxed text-neutral-600">{data.text}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href={data.calendly} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 rounded-full bg-neutral-900 py-3 pl-6 pr-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                {data.coffeeChat}
                <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                  <ArrowRight size={14} />
                </span>
              </a>
              {/* Text link with an underline that draws in on hover. */}
              <a href={data.calendly} target="_blank" rel="noreferrer" className="group relative inline-flex items-center gap-2 py-1 text-sm font-medium">
                <CalendarDays size={16} className="text-neutral-500" />
                {data.bookMeeting}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-neutral-900 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </div>
          </div>

          {/* Plain list of links separated by hairlines. */}
          <ul className="border-t border-neutral-900/10">
            {data.links.map(({ icon, label, href }) => {
              const Icon = icons[icon];
              return (
                <li key={label} className="border-b border-neutral-900/10">
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group flex items-center gap-4 py-5 transition-colors hover:text-emerald-700">
                    <Icon size={18} className="text-neutral-400 transition-colors group-hover:text-emerald-700" />
                    <span className="flex-1 text-lg font-medium transition-transform duration-300 group-hover:translate-x-1">{label}</span>
                    <ArrowUpRight size={18} className="text-neutral-400 transition duration-300 group-hover:rotate-45 group-hover:text-emerald-700" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="mt-28 flex flex-wrap justify-between gap-2 border-t border-neutral-900/10 pt-6 text-xs text-neutral-500">
          <span>{data.footer}</span>
          <a href="#" className="transition-colors hover:text-neutral-900">{data.backToTop}</a>
        </footer>
      </div>
    </section>
  );
}
