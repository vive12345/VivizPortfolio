import { Pause, Play } from 'lucide-react';
import usePlayer from '../hooks/usePlayer';
import music from '../data/music.json';

// Floating top-right mini record player, visible on every page.
export default function MusicPlayer() {
  const { track, playing, toggle } = usePlayer(music.tracks);

  return (
    <button
      onClick={toggle}
      title={`${track.title} — ${track.credit}`}
      aria-label={playing ? 'Stop music' : 'Play music'}
      className="fixed right-6 top-6 z-40 grid size-24 animate-float cursor-pointer place-items-center rounded-full shadow-xl transition hover:scale-105"
    >
      <span
        className={`absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,#171717_0_1.5px,#2a2a2a_1.5px_3px)] animate-[spin_3s_linear_infinite] ${playing ? '' : '[animation-play-state:paused]'}`}
      />
      <span className="relative grid size-9 place-items-center rounded-full text-white transition-colors duration-500" style={{ background: track.color }}>
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
      </span>
    </button>
  );
}
