import { useEffect, useRef, useState } from 'react';

// Random index other than the current one (when there is a choice).
const shuffle = (current, length) => (current + 1 + Math.floor(Math.random() * (length - 1 || 1))) % length;

// Plays a playlist in random order forever, starting as soon as the browser allows sound.
export default function usePlayer(tracks, startVolume = 0.2) {
  const [audio] = useState(() => new Audio());
  const [index, setIndex] = useState(() => Math.floor(Math.random() * tracks.length));
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(startVolume);
  const history = useRef([]);

  useEffect(() => {
    audio.volume = volume;
  }, [audio, volume]);

  useEffect(() => {
    if (history.current.at(-1) !== index) history.current.push(index);
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
      ended: () => setIndex((i) => shuffle(i, tracks.length)),
    };
    Object.entries(handlers).forEach(([event, fn]) => audio.addEventListener(event, fn));
    return () => {
      audio.pause();
      Object.entries(handlers).forEach(([event, fn]) => audio.removeEventListener(event, fn));
    };
  }, [audio, tracks.length]);

  const toggle = () => (audio.paused ? audio.play().catch(() => {}) : audio.pause());
  const next = () => setIndex((i) => shuffle(i, tracks.length));
  const prev = () => {
    if (history.current.length < 2) {
      audio.currentTime = 0;
      return;
    }
    history.current.pop();
    setIndex(history.current.at(-1));
  };

  return { track: tracks[index], playing, volume, setVolume, toggle, next, prev };
}
