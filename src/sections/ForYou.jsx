import { useEffect, useRef, useState } from 'react';
import { PartyPopper } from 'lucide-react';
import Confetti from '../components/Confetti';
import data from '../data/forYou.json';

// Closing note: fires confetti the first time a visitor scrolls to the end of the page.
export default function ForYou() {
  const sectionRef = useRef(null);
  const [bursts, setBursts] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setBursts(1);
        observer.disconnect();
      },
      { threshold: 0.6 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="for-you" className="bg-emerald-50 px-6 pb-10 pt-16">
      <Confetti bursts={bursts} />

      <div className="mx-auto max-w-6xl">
        <div className="border-t border-neutral-900/10 py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{data.label}</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">{data.title}</h2>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-neutral-600">{data.text}</p>
          <button onClick={() => setBursts((b) => b + 1)} className="group relative mt-8 inline-flex cursor-pointer items-center gap-2.5 py-1 font-medium">
            <PartyPopper size={18} className="text-fuchsia-600 transition-transform duration-300 group-hover:-rotate-12" />
            {data.again}
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-neutral-900 transition-transform duration-300 group-hover:scale-x-100" />
          </button>
        </div>

        <footer className="flex flex-wrap justify-between gap-2 border-t border-neutral-900/10 pt-6 text-xs text-neutral-500">
          <span>
            {data.footer} · {data.updated} {__UPDATED__}
          </span>
          <a href="#" className="transition-colors hover:text-neutral-900">{data.backToTop}</a>
        </footer>
      </div>
    </section>
  );
}
