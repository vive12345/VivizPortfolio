import { useEffect, useRef, useState } from 'react';
import { PartyPopper } from 'lucide-react';
import Confetti from '../components/Confetti';
import data from '../data/forYou.json';

// Closing note: fires confetti the first time a visitor scrolls to the end of the page.
export default function ForYou() {
  const sectionRef = useRef(null);
  const [bursts, setBursts] = useState(0);
  const [clicked, setClicked] = useState(false);
  const celebrate = () => {
    setClicked(true);
    setBursts((b) => b + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setBursts((b) => b + 1);
        observer.disconnect();
      },
      { threshold: 0.6 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="for-you" className="relative px-6 pb-10 pt-16">
      {/* Light green background that fades in from the game above. */}
      <div className="absolute inset-0 -z-30 bg-emerald-50 [mask-image:linear-gradient(transparent,black_10rem)]" />
      <Confetti bursts={bursts} />

      <div className="mx-auto max-w-6xl">
        <div className="border-t border-neutral-900/10 py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{data.label}</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">{data.title}</h2>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-neutral-600">{data.text}</p>
          {/* Until the visitor has clicked once, a nudge and a gentle wiggle invite them to. */}
          <p className={`mt-10 text-xs font-medium uppercase tracking-widest text-neutral-400 transition-opacity duration-500 ${clicked ? 'opacity-0' : ''}`}>{data.prompt}</p>
          {/* Same look as the Coffee chat button. */}
          <button
            onClick={celebrate}
            className={`group mt-4 inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-lg bg-neutral-900 px-5 text-sm font-medium tracking-wide text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.2),0_8px_20px_-8px_rgb(0_0_0/0.4)] transition hover:bg-neutral-800 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.2),0_12px_24px_-8px_rgb(0_0_0/0.5)] active:scale-[0.98] ${clicked ? '' : 'animate-wiggle'}`}
          >
            <PartyPopper size={16} className="text-white/70 transition duration-300 group-hover:-rotate-12 group-hover:text-white" />
            {data.again}
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
