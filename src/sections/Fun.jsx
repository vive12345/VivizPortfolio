import { useEffect, useRef, useState } from 'react';
import { Bug, Crown, Dices, Play } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import useLeaderboard from '../hooks/useLeaderboard';
import data from '../data/fun.json';

const CELLS = 16;
const DURATION = 30;
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const randomName = () => `${pick(data.adjectives)} ${pick(data.animals)}`;

// "Bug Smash": bugs pop up on a 4×4 board; tap them before they vanish.
export default function Fun() {
  const { scores, submit } = useLeaderboard();
  const [name, setName] = useState(() => localStorage.getItem('player') || randomName());
  const [phase, setPhase] = useState('idle'); // idle → playing → over
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [bugs, setBugs] = useState([]);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (phase !== 'playing') return;
    const start = performance.now();
    const tick = setInterval(() => {
      const now = performance.now();
      const elapsed = (now - start) / 1000;
      if (elapsed >= DURATION) {
        clearInterval(tick);
        setTimeLeft(0);
        setBugs([]);
        setPhase('over');
        if (scoreRef.current) submit(name, scoreRef.current);
        return;
      }
      setTimeLeft(Math.ceil(DURATION - elapsed));
      setBugs((alive) => {
        const next = alive.filter((bug) => bug.until > now);
        const free = [...Array(CELLS).keys()].filter((cell) => !next.some((bug) => bug.cell === cell));
        // Bugs appear more often and vanish faster as the clock runs down.
        if (free.length && Math.random() < 0.3 + elapsed / 60) {
          const golden = Math.random() < 0.1;
          next.push({ id: now, cell: pick(free), golden, until: now + (golden ? 700 : 1200) - elapsed * 15 });
        }
        return next;
      });
    }, 150);
    return () => clearInterval(tick);
  }, [phase, name, submit]);

  const start = (e) => {
    e.preventDefault();
    const player = name.trim().slice(0, 20) || randomName();
    setName(player);
    localStorage.setItem('player', player);
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(DURATION);
    setPhase('playing');
  };

  const smash = (bug) => {
    if (bug.hit) return;
    bug.hit = true;
    setBugs((alive) => alive.filter((b) => b.id !== bug.id));
    scoreRef.current += bug.golden ? 3 : 1;
    setScore(scoreRef.current);
  };

  return (
    <section id="fun" className="scroll-mt-8 px-6 pb-28 pt-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading number={data.number}>{data.heading}</SectionHeading>

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_20rem] md:gap-20">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{data.title}</h3>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-neutral-600">{data.text}</p>

            <div className="mt-6 max-w-md">
              <div className="mb-3 flex justify-between text-sm tabular-nums text-neutral-500">
                <span>
                  {data.score} <b className="text-neutral-900">{score}</b>
                </span>
                <span>
                  {data.time} <b className="text-neutral-900">{timeLeft}s</b>
                </span>
              </div>

              <div className="relative grid touch-manipulation select-none grid-cols-4 gap-2 rounded-2xl border border-neutral-900/10 bg-white p-2">
                {[...Array(CELLS).keys()].map((cell) => {
                  const bug = bugs.find((b) => b.cell === cell);
                  return (
                    <div key={cell} className="grid aspect-square place-items-center rounded-xl bg-neutral-100/70">
                      {bug && (
                        <button
                          key={bug.id}
                          onPointerDown={() => smash(bug)}
                          aria-label="Smash bug"
                          className={`grid size-3/4 animate-pop cursor-pointer place-items-center rounded-full ${bug.golden ? 'bg-amber-100 text-amber-500' : 'bg-emerald-100 text-emerald-700'}`}
                        >
                          <Bug className="size-1/2" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {phase !== 'playing' && (
                  <form onSubmit={start} className="absolute inset-0 grid place-content-center justify-items-center gap-4 rounded-2xl bg-white/85 p-6 text-center backdrop-blur-sm">
                    {phase === 'over' && (
                      <p>
                        <span className="block text-sm text-neutral-500">{data.yourScore}</span>
                        <span className="text-5xl font-bold tabular-nums">{score}</span>
                      </p>
                    )}
                    <label htmlFor="player" className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                      {data.namePrompt}
                    </label>
                    <div className="flex items-center gap-1 rounded-lg border border-neutral-900/15 bg-white p-1 pl-3">
                      <input id="player" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="w-40 bg-transparent text-sm outline-none" />
                      <button type="button" onClick={() => setName(randomName())} aria-label={data.randomName} title={data.randomName} className="grid size-8 cursor-pointer place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900">
                        <Dices size={18} />
                      </button>
                    </div>
                    <button className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]">
                      <Play size={14} fill="currentColor" />
                      {phase === 'over' ? data.again : data.start}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          <aside>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{data.leaderboard}</p>
            {scores[0] && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-amber-50 p-4">
                <Crown size={22} className="shrink-0 text-amber-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-amber-700">{data.champion}</p>
                  <p className="truncate font-semibold">{scores[0].name}</p>
                </div>
                <span className="text-2xl font-bold tabular-nums">{scores[0].score}</span>
              </div>
            )}
            <ol className="mt-4 border-t border-neutral-900/10">
              {scores.map((entry, i) => (
                <li key={i} className="flex items-center gap-4 border-b border-neutral-900/10 py-3 text-sm">
                  <span className="w-5 tabular-nums text-neutral-400">{i + 1}</span>
                  <span className="flex-1 truncate font-medium">{entry.name}</span>
                  <span className="tabular-nums">{entry.score}</span>
                </li>
              ))}
            </ol>
            {!scores.length && <p className="py-3 text-sm text-neutral-500">{data.empty}</p>}
          </aside>
        </div>
      </div>
    </section>
  );
}
