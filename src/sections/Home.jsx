import { BriefcaseBusiness, ChevronRight, Cpu, FileText, Gift, GraduationCap, Layers, PartyPopper, Smile, UserSearch } from 'lucide-react';
import Avatar from '../components/Avatar';
import FluidCursor from '../components/FluidCursor';
import data from '../data/home.json';

const icons = { Smile, GraduationCap, BriefcaseBusiness, Layers, Cpu, PartyPopper, Gift, UserSearch };

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center-safe px-4 pb-24 pt-6">
      <FluidCursor />
      {/* Half of the name sits here; the other half spills into the About section below. */}
      <span className="pointer-events-none absolute bottom-0 -z-20 translate-y-1/2 select-none text-[22vw] font-black leading-none text-neutral-100">
        {data.watermark}
      </span>

      <a href={data.resume.href} target="_blank" rel="noreferrer" className="group mb-6 flex items-center sm:absolute sm:left-6 sm:top-6 sm:mb-0 gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow-md">
        <FileText size={16} className="text-neutral-500" />
        {data.resume.label}
        <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </a>

      <div className="mb-3 grid size-14 place-items-center rounded-2xl bg-white text-2xl font-black shadow-md">{data.logo}</div>
      <h2 className="text-xl font-semibold sm:text-2xl">{data.greeting}</h2>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">{data.title}</h1>

      <Avatar src={data.avatar} label={data.greeting} className="my-6 size-56 sm:size-72" />

      <nav className="flex flex-wrap justify-center gap-3">
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
