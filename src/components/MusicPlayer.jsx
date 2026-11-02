import { Pause, Play, SkipForward } from 'lucide-react';
import usePlayer from '../hooks/usePlayer';
import music from '../data/music.json';

// Floating top-right mini record player with controls underneath, visible on every page.
export default function MusicPlayer() {
  const { track, playing, toggle, next } = usePlayer(music.tracks);

  return (
    <div className="fixed right-6 top-6 z-40 flex w-52 animate-float flex-col items-center gap-2">
      <div
        className={`grid size-24 place-items-center rounded-full bg-[repeating-radial-gradient(circle,#171717_0_1.5px,#2a2a2a_1.5px_3px)] shadow-xl animate-[spin_3s_linear_infinite] ${playing ? '' : '[animation-play-state:paused]'}`}
      >
        <span className="grid size-9 place-items-center rounded-full transition-colors duration-500" style={{ background: track.color }}>
          <span className="size-2 rounded-full bg-neutral-900" />
        </span>
      </div>

      <div className="flex w-full items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
        <button onClick={toggle} aria-label={playing ? 'Pause music' : 'Play music'} className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full bg-neutral-900 text-white hover:bg-neutral-700">
          {playing ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-px" />}
        </button>
        <p title={track.credit} className="min-w-0 flex-1 truncate text-center text-xs font-medium">
          {track.title}
        </p>
        <button onClick={next} aria-label="Next track" className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-neutral-100">
          <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
}
