import { ArrowRight, BriefcaseBusiness, ChevronRight, Layers, PartyPopper, Smile, UserSearch } from 'lucide-react';
import FluidCursor from '../components/FluidCursor';
import data from '../data/home.json';

const icons = { Smile, BriefcaseBusiness, Layers, PartyPopper, UserSearch };

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-24">
      <FluidCursor />

      <span className="pointer-events-none absolute bottom-0 -z-20 translate-y-1/4 select-none text-[22vw] font-black leading-none text-neutral-100">
        {data.watermark}
      </span>

      <a href={data.badge.href} className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50">
        {data.badge.label} <ChevronRight size={16} />
      </a>

      <div className="mb-3 grid size-14 place-items-center rounded-2xl bg-white text-2xl font-black shadow-md">{data.logo}</div>
      <h2 className="text-xl font-semibold sm:text-2xl">{data.greeting}</h2>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">{data.title}</h1>

      <img src={data.avatar} alt={data.title} className="my-6 h-56 w-auto object-contain sm:h-72" />

      <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-xl items-center rounded-full border border-neutral-200 bg-white py-2 pl-6 pr-2 shadow-sm">
        <input placeholder={data.placeholder} className="flex-1 bg-transparent outline-none placeholder:text-neutral-500" />
        <button aria-label="Send" className="grid size-10 place-items-center rounded-full bg-blue-500 text-white hover:bg-blue-600">
          <ArrowRight size={18} />
        </button>
      </form>

      <nav className="mt-4 flex flex-wrap justify-center gap-3">
        {data.quickLinks.map(({ label, icon, color, href }) => {
          const Icon = icons[icon];
          return (
            <a key={label} href={href} className="flex w-28 flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white py-4 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <Icon size={20} className={color} />
              {label}
            </a>
          );
        })}
      </nav>
    </main>
  );
}
