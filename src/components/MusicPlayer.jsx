import { useRef, useState } from 'react';
import { Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import usePlayer from '../hooks/usePlayer';
import music from '../data/music.json';

const round = 'grid size-7 cursor-pointer place-items-center rounded-full';

// Floating mini record player with controls underneath, visible on every page.
// Starts top-right; drag the disc to move it anywhere within the window.
export default function MusicPlayer() {
  const { track, playing, volume, setVolume, toggle, next, prev } = usePlayer(music.tracks);
  const box = useRef(null);
  const [heard, setHeard] = useState(false);
  if (playing && !heard) setHeard(true);

  // Speaker icon mutes, and unmutes back to the volume used before muting.
  const lastVolume = useRef(volume);
  const toggleMute = () => {
    if (volume > 0) lastVolume.current = volume;
    setVolume(volume > 0 ? 0 : lastVolume.current || 0.25);
  };

  const startDrag = (e) => {
    const el = box.current;
    const { left, top } = el.getBoundingClientRect();
    const offset = { x: e.clientX - left, y: e.clientY - top };
    const clamp = (value, max) => Math.min(Math.max(value, 0), max);

    const move = (ev) => {
      const x = clamp(ev.clientX - offset.x, innerWidth - el.offsetWidth);
      const y = clamp(ev.clientY - offset.y, innerHeight - el.offsetHeight);
      Object.assign(el.style, { left: `${x}px`, top: `${y}px`, right: 'auto' });
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', () => removeEventListener('pointermove', move), { once: true });
  };

  return (
    <div ref={box} className="fixed right-6 top-6 z-40 flex w-52 animate-float flex-col items-center gap-2">
      <div
        onPointerDown={startDrag}
        title="Drag to move"
        className={`grid size-24 cursor-grab touch-none select-none place-items-center rounded-full active:cursor-grabbing bg-[repeating-radial-gradient(circle,#171717_0_1.5px,#2a2a2a_1.5px_3px)] shadow-xl animate-[spin_3s_linear_infinite] ${playing ? '' : '[animation-play-state:paused]'}`}
      >
        <span className="grid size-9 place-items-center rounded-full transition-colors duration-500" style={{ background: track.color }}>
          <span className="size-2 rounded-full bg-neutral-900" />
        </span>
      </div>

      <div className="w-full rounded-2xl border border-neutral-200 bg-white p-1 shadow-sm">
        <p title={track.credit} className="truncate px-2 pt-1 text-center text-xs font-medium">
          {track.title}
        </p>
        <div className="flex items-center justify-center gap-1">
          <button onClick={prev} aria-label="Previous track" className={`${round} hover:bg-neutral-100`}>
            <SkipBack size={14} />
          </button>
          <button onClick={toggle} aria-label={playing ? 'Pause music' : 'Play music'} className={`${round} bg-neutral-900 text-white hover:bg-neutral-700`}>
            {playing ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-px" />}
          </button>
          <button onClick={next} aria-label="Next track" className={`${round} hover:bg-neutral-100`}>
            <SkipForward size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2 px-2 pb-1 text-neutral-500">
          <button onClick={toggleMute} aria-label={volume > 0 ? 'Mute' : 'Unmute'} title={volume > 0 ? 'Mute' : 'Unmute'} className="-m-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-neutral-100 hover:text-neutral-900">
            {volume > 0 ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="h-1 w-full cursor-pointer accent-neutral-900"
          />
        </div>
      </div>

      {/* Browsers block sound until the first click or tap, so nudge visitors until the music has started once. */}
      {!heard && (
        <p className="flex animate-pop items-center gap-1.5 whitespace-nowrap rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          <Music2 size={12} className="animate-pulse" />
          <span className="pointer-coarse:hidden">{music.hint.mouse}</span>
          <span className="hidden pointer-coarse:inline">{music.hint.touch}</span>
        </p>
      )}
    </div>
  );
}
