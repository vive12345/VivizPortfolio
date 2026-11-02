import { useEffect, useRef, useState } from 'react';

// Plays a playlist on loop; nothing plays until the visitor presses play.
export default function usePlayer(tracks) {
  const [audio] = useState(() => new Audio());
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    audio.src = tracks[index].src;
    if (started.current) audio.play().catch(() => {});
  }, [audio, tracks, index]);

  useEffect(() => {
    const handlers = {
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      ended: () => setIndex((i) => (i + 1) % tracks.length),
    };
    Object.entries(handlers).forEach(([event, fn]) => audio.addEventListener(event, fn));
    return () => {
      audio.pause();
      Object.entries(handlers).forEach(([event, fn]) => audio.removeEventListener(event, fn));
    };
  }, [audio, tracks.length]);

  const toggle = () => {
    started.current = true;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const next = () => {
    started.current = true;
    setIndex((i) => (i + 1) % tracks.length);
  };

  return { track: tracks[index], playing, toggle, next };
}
