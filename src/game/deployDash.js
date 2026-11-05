// Drawing and physics for "Deploy Dash", an endless runner: a build bot jumps over
// bugs and error blocks while the world speeds up. All sizes are in CSS pixels.
export const HEIGHT = 220;
const GROUND = HEIGHT - 36;
const BOT = { x: 48, w: 34, h: 34 };
const GRAVITY = 2600;
const JUMP_SPEED = -820;
const TOKENS = ['</>', '{ }', '=>', '( )', '[ ]', '&&', '//', '++'];

// Sizes the canvas for the screen's pixel density and returns its 2D context.
export const setupCanvas = (canvas) => {
  const dpr = Math.min(devicePixelRatio, 2);
  const width = canvas.clientWidth;
  canvas.width = width * dpr;
  canvas.height = HEIGHT * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width };
};

export const newGame = () => ({ y: GROUND - BOT.h, vy: 0, distance: 0, speed: 260, obstacles: [], nextAt: 600 });

export const jump = (game) => {
  if (game.y >= GROUND - BOT.h) game.vy = JUMP_SPEED;
};

const bug = (x) => ({ type: 'bug', x, w: 28, h: 22 });

const spawn = (game, width) => {
  const roll = Math.random();
  const x = width + 20;
  if (roll < 0.6) game.obstacles.push(bug(x));
  else if (roll < 0.85) game.obstacles.push({ type: 'error', x, w: 24, h: 46 });
  else game.obstacles.push(bug(x), bug(x + 30));
  // Gaps are measured in time, so they stay jumpable as the speed rises.
  game.nextAt = game.distance + game.speed * (0.7 + Math.random() * 0.8);
};

// Hit boxes are a little smaller than the drawings so near misses feel fair.
const hits = (o, game) =>
  BOT.x + 5 < o.x + o.w - 3 && BOT.x + BOT.w - 5 > o.x + 3 && game.y + BOT.h - 2 > GROUND - o.h + 3;

// Advances the game by dt seconds. Returns true when the bot hits something.
export const update = (game, dt, width) => {
  // Starts gentle, then ramps up steadily to a top speed.
  game.speed = Math.min(game.speed + 14 * dt, 950);
  const dx = game.speed * dt;
  game.distance += dx;
  game.vy += GRAVITY * dt;
  game.y += game.vy * dt;
  if (game.y >= GROUND - BOT.h) Object.assign(game, { y: GROUND - BOT.h, vy: 0 });
  game.obstacles.forEach((o) => (o.x -= dx));
  game.obstacles = game.obstacles.filter((o) => o.x + o.w > -10);
  if (game.distance >= game.nextAt) spawn(game, width);
  return game.obstacles.some((o) => hits(o, game));
};

export const scoreOf = (game) => Math.floor(game.distance / 40);

const drawBot = (ctx, game) => {
  const { x, w } = BOT;
  const y = game.y;
  const onGround = game.y >= GROUND - BOT.h;
  const step = onGround && game.distance > 0 ? Math.floor(game.distance / 14) % 2 : 0;
  ctx.fillStyle = '#065f46';
  ctx.fillRect(x + 7, y + 28, 6, step ? 4 : 6);
  ctx.fillRect(x + 21, y + 28, 6, step ? 6 : 4);
  ctx.strokeStyle = '#065f46';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, y - 6);
  ctx.stroke();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(x + w / 2, y - 7, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x, y, w, 30, 8);
  ctx.fill();
  ctx.fillStyle = '#ecfdf5';
  ctx.beginPath();
  ctx.roundRect(x + 5, y + 6, w - 10, 14, 4);
  ctx.fill();
  ctx.fillStyle = '#171717';
  ctx.fillRect(x + 11, y + 10, 3, 6);
  ctx.fillRect(x + 20, y + 10, 3, 6);
};

const drawBug = (ctx, { x }) => {
  const cy = GROUND - 10;
  ctx.strokeStyle = '#881337';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (const lx of [x + 9, x + 15, x + 21]) {
    ctx.moveTo(lx, cy);
    ctx.lineTo(lx - 3, GROUND);
  }
  ctx.moveTo(x + 4, cy - 8);
  ctx.lineTo(x, cy - 14);
  ctx.moveTo(x + 8, cy - 9);
  ctx.lineTo(x + 7, cy - 15);
  ctx.stroke();
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.ellipse(x + 16, cy, 11, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#be123c';
  ctx.beginPath();
  ctx.arc(x + 5, cy - 3, 5, 0, Math.PI * 2);
  ctx.fill();
};

const drawError = (ctx, { x, w, h }) => {
  ctx.fillStyle = '#171717';
  ctx.beginPath();
  ctx.roundRect(x, GROUND - h, w, h, 5);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '700 18px ui-sans-serif, system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('!', x + w / 2, GROUND - h / 2 + 6);
  ctx.textAlign = 'start';
};

// Draws one frame: drifting code symbols, the ground, obstacles and the bot.
export const draw = (ctx, width, game) => {
  ctx.clearRect(0, 0, width, HEIGHT);
  ctx.font = '600 14px ui-monospace, monospace';
  ctx.fillStyle = '#e5e5e5';
  const span = width + 80;
  TOKENS.forEach((token, i) => {
    const x = ((((i * 173 - game.distance * 0.25) % span) + span) % span) - 40;
    ctx.fillText(token, x, 40 + (i % 3) * 32);
  });
  ctx.fillStyle = '#d4d4d4';
  ctx.fillRect(0, GROUND, width, 1);
  for (let x = -(game.distance % 40); x < width; x += 40) ctx.fillRect(x, GROUND + 10, 14, 1);
  game.obstacles.forEach((o) => (o.type === 'bug' ? drawBug(ctx, o) : drawError(ctx, o)));
  drawBot(ctx, game);
};
