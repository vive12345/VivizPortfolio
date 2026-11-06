// Cloudflare Pages Function serving the shared game leaderboard at /api/scores.
// Scores live in a Cloudflare D1 database bound to this project as `DB` (table: schema.sql).
const LIMIT = 3;
const MAX_SCORE = 100000;
const NAME = /^[\p{L}\p{N} ._-]{1,20}$/u;
const BLOCKED = ['fuck', 'shit', 'bitch', 'cunt', 'nigg', 'fagg', 'dick', 'cock', 'pussy', 'porn', 'nazi', 'rape', 'slut', 'whore'];

const top = async (db) => (await db.prepare('SELECT name, score FROM scores ORDER BY score DESC, created_at ASC LIMIT ?').bind(LIMIT).all()).results;

export const onRequestGet = async ({ env }) => Response.json(await top(env.DB));

export const onRequestPost = async ({ request, env }) => {
  const { name, score } = await request.json().catch(() => ({}));
  const clean = String(name ?? '').trim();
  const lower = clean.toLowerCase().replace(/[^a-z]/g, '');
  if (!NAME.test(clean) || BLOCKED.some((word) => lower.includes(word))) return Response.json({ error: 'Please pick a different name.' }, { status: 400 });
  if (!Number.isInteger(score) || score < 1 || score > MAX_SCORE) return Response.json({ error: 'Invalid score.' }, { status: 400 });

  await env.DB.prepare('INSERT INTO scores (name, score) VALUES (?, ?)').bind(clean, score).run();
  return Response.json(await top(env.DB), { status: 201 });
};
