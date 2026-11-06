import { useEffect, useRef, useState } from 'react';
import { Crown, Dices, Play, X } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import useLeaderboard from '../hooks/useLeaderboard';
import { HEIGHT, draw, jump, newGame, scoreOf, setupCanvas, update } from '../game/deployDash';
import data from '../data/fun.json';

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const randomName = () => `${pick(data.adjectives)} ${pick(data.animals)}`;

export default function Fun() {
  const { scores, submit } = useLeaderboard();
  // A fresh random name is suggested every time the start screen appears.
  const [name, setName] = useState(randomName);
  const [phase, setPhase] = useState('idle'); // idle → playing → over
  const [score, setScore] = useState(0);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  const reset = () => {
    setName(randomName());
    setPhase('idle');
    setScore(0);
  };

  // Show the bot standing still on the start screen.
  useEffect(() => {
    if (phase !== 'idle') return;
    const { ctx, width } = setupCanvas(canvasRef.current);
    draw(ctx, width, newGame());
  }, [phase]);

  // Leaving the game (scrolling away or switching tabs) ends it and clears the score.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => !entry.isIntersecting && reset());
    observer.observe(sectionRef.current);
    const onHide = () => document.hidden && reset();
    document.addEventListener('visibilitychange', onHide);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onHide);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    const { ctx, width } = setupCanvas(canvas);
    const game = newGame();
    const onKey = (e) => {
      if (e.code !== 'Space' && e.code !== 'ArrowUp') return;
      e.preventDefault(); // keep Space from scrolling the page while playing
      jump(game);
    };
    const onTap = () => jump(game);
    addEventListener('keydown', onKey);
    canvas.addEventListener('pointerdown', onTap);

    let last = performance.now();
    let frame;
    const loop = (now) => {
      const crashed = update(game, Math.min((now - last) / 1000, 0.05), width);
      last = now;
      draw(ctx, width, game);
      const current = scoreOf(game);
      setScore(current);
      if (crashed) {
        setPhase('over');
        if (current) submit(name, current);
        setName(randomName());
        return;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('keydown', onKey);
      canvas.removeEventListener('pointerdown', onTap);
    };
  }, [phase, name, submit]);

  const start = (e) => {
    e.preventDefault();
    setName(name.trim().slice(0, 20) || randomName());
    setScore(0);
    setPhase('playing');
  };

  return (
    <section ref={sectionRef} id="fun" className="scroll-mt-8 px-6 pb-28 pt-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading number={data.number}>{data.heading}</SectionHeading>

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_20rem] md:gap-20">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold tracking-tight">{data.title}</h3>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-neutral-600">{data.text}</p>

            <div className="mt-6">
              <div className="mb-3 flex justify-between gap-4 text-sm text-neutral-500">
                <span className="pointer-coarse:hidden">{data.controls.keyboard}</span>
                <span className="hidden pointer-coarse:inline">{data.controls.touch}</span>
                <span className="tabular-nums">
                  {data.score} <b className="text-neutral-900">{score}</b>
                </span>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-neutral-900/10 bg-white">
                <canvas ref={canvasRef} className="block w-full touch-manipulation" style={{ height: HEIGHT }} />

                {phase !== 'playing' && (
                  <form onSubmit={start} className="absolute inset-0 grid place-content-center justify-items-center gap-3 bg-white/80 p-4 text-center backdrop-blur-sm">
                    {phase === 'over' && (
                      <p className="grid">
                        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{data.yourScore}</span>
                        <span className="text-4xl font-bold tabular-nums text-emerald-600">{score}</span>
                      </p>
                    )}
                    <label htmlFor="player" className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                      {data.namePrompt}
                    </label>
                    {/* Name field and play button on one line. */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-lg border border-neutral-900/15 bg-white p-1 pl-3">
                        <input id="player" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="w-32 bg-transparent text-sm outline-none sm:w-40" />
                        <button type="button" onClick={() => setName(randomName())} aria-label={data.randomName} title={data.randomName} className="grid size-8 cursor-pointer place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900">
                          <Dices size={18} />
                        </button>
                      </div>
                      <button className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]">
                        <Play size={14} fill="currentColor" />
                        {phase === 'over' ? data.again : data.start}
                      </button>
                    </div>
                  </form>
                )}

                {/* Quit at any time, mid-game or after a crash, back to the start screen. */}
                {phase !== 'idle' && (
                  <button type="button" onClick={reset} aria-label={data.close} title={data.close} className="absolute right-3 top-3 grid size-8 cursor-pointer place-items-center rounded-full bg-white/80 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
                    <X size={18} />
                  </button>
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
