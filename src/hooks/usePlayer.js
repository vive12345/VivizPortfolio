import { useEffect, useState } from 'react';

// Plays the playlist in order on a loop, starting from a random song,
// as soon as the browser allows sound.
export default function usePlayer(tracks, startVolume = 0.25) {
  const [audio] = useState(() => new Audio());
  const [index, setIndex] = useState(() => Math.floor(Math.random() * tracks.length));
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(startVolume);
  const step = (by) => setIndex((i) => (i + by + tracks.length) % tracks.length);

  useEffect(() => {
    audio.volume = volume;
  }, [audio, volume]);

  useEffect(() => {
    const unlock = new AbortController();
    audio.src = tracks[index].src;
    audio.play().catch((error) => {
      // Browsers block sound until the visitor interacts, so start on their first click or key press.
      if (error.name !== 'NotAllowedError') return;
      const retry = () => {
        unlock.abort();
        if (audio.paused) audio.play().catch(() => {});
      };
      ['click', 'keydown'].forEach((type) => addEventListener(type, retry, { signal: unlock.signal }));
    });
    return () => unlock.abort();
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

  const toggle = () => (audio.paused ? audio.play().catch(() => {}) : audio.pause());

  return { track: tracks[index], playing, volume, setVolume, toggle, next: () => step(1), prev: () => step(-1) };
}
