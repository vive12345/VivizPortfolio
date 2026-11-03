import { useCallback, useEffect, useState } from 'react';

// Shared leaderboard stored in Supabase (see .env.example). Without those keys,
// scores fall back to this browser's localStorage so the game still works locally.
const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key } = import.meta.env;
const api = url && `${url}/rest/v1/scores`;
const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
const LIMIT = 3;

const readLocal = () => JSON.parse(localStorage.getItem('scores') || '[]');

const fetchTop = async () => {
  if (!api) return readLocal();
  const res = await fetch(`${api}?select=name,score&order=score.desc,created_at.asc&limit=${LIMIT}`, { headers });
  return res.ok ? res.json() : [];
};

const saveScore = async (entry) => {
  if (api) return fetch(api, { method: 'POST', headers, body: JSON.stringify(entry) });
  const top = [...readLocal(), entry].sort((a, b) => b.score - a.score).slice(0, LIMIT);
  localStorage.setItem('scores', JSON.stringify(top));
};

export default function useLeaderboard() {
  const [scores, setScores] = useState([]);

  const refresh = useCallback(() => fetchTop().then(setScores).catch(() => {}), []);
  const submit = useCallback((name, score) => saveScore({ name, score }).catch(() => {}).then(refresh), [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { scores, submit };
}
