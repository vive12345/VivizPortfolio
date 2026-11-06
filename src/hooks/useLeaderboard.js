import { useCallback, useEffect, useState } from 'react';

// Shared leaderboard served by the Cloudflare Pages Function in functions/api/scores.js.
// When that API isn't available (e.g. during `npm run dev`), scores stay in this browser instead.
const API = '/api/scores';
const LIMIT = 3;

const readLocal = () => JSON.parse(localStorage.getItem('scores') || '[]');
const saveLocal = (entry) => {
  const top = [...readLocal(), entry].sort((a, b) => b.score - a.score).slice(0, LIMIT);
  localStorage.setItem('scores', JSON.stringify(top));
};

const request = async (init) => {
  const res = await fetch(API, init);
  if (!res.ok) throw new Error(`Leaderboard request failed: ${res.status}`);
  return res.json();
};

const fetchTop = () => request().catch(readLocal);
const saveScore = (entry) =>
  request({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) }).catch(() => saveLocal(entry));

export default function useLeaderboard() {
  const [scores, setScores] = useState([]);

  const refresh = useCallback(() => fetchTop().then(setScores), []);
  const submit = useCallback((name, score) => saveScore({ name, score }).then(refresh), [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { scores, submit };
}
