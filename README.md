# Viviz Portfolio

My personal portfolio website, built to share my background, skills, experience, and projects as a software engineer.

It's a single-page website with these sections:

- **Home:** A waving animated avatar, a colorful cursor effect, and quick links.
- **About Me:** A short introduction, my skills, and photos you can click to switch.
- **Education, Experience & Projects:** My education, work experience, and projects in simple timelines.
- **Contact:** A Calendly link for coffee chats, plus Email, LinkedIn, GitHub, and LeetCode.
- **Fun:** *Deploy Dash*, an endless runner where a little build bot jumps over bugs, with a top-3 leaderboard.
- **For You:** A closing message with confetti.
- **Music Player:** A floating player you can drag around, that loops through the playlist, with volume, mute, and previous/next controls.

**Built with:** React 19, Vite, and Tailwind CSS v4.

It's hosted on Cloudflare Pages, with a small Cloudflare D1 database for the shared game leaderboard.

## Run It Locally

Install the packages and start the website:

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

Other useful commands:

```bash
npm run build    # Create the production files in dist/
npm run preview  # Preview the production build
```

> **Tip:** If you add a new component while the development server is running and its styles don't appear, restart the server.

## Edit the Content

All website text and links are stored in JSON files in [`src/data/`](src/data/). You can update the content without changing the React components.

| File | What You Can Change |
| --- | --- |
| `home.json` | Greeting, title, avatar, and quick links |
| `about.json` | Introduction, skills, and photos |
| `education.json` | Education details |
| `experience.json` | Work experience |
| `projects.json` | Projects, technologies, and links |
| `contact.json` | Calendly and social links |
| `fun.json` | Game text and random player names |
| `forYou.json` | Closing message and footer |
| `music.json` | Music playlist |

To make text bold in `experience.json`, wrap it in `**double stars**`.

If you change the order of sections in [`src/App.jsx`](src/App.jsx), update the `number` field in the relevant JSON files too.

## Add Images and Music

Put images and music in [`public/`](public/):

```text
public/
  images/me.jpg
  music/song.mp3
```

Reference them in the JSON files using paths that start with `/`:

```text
/images/me.jpg
/music/song.mp3
```

### Add a Song

1. Place an MP3 file in `public/music/`.
2. Open `src/data/music.json`.
3. Add a new song entry:

```json
{
  "title": "Song name",
  "src": "/music/song.mp3",
  "color": "#EC4899",
  "credit": "Artist"
}
```

MP3s at around 128 kbps help keep the website lightweight. Only share music you have the rights to use publicly.

## Deploy on Cloudflare Pages

The site is hosted on **Cloudflare Pages**, connected to this GitHub repository. Every push to `main` deploys automatically.

1. In the [Cloudflare dashboard](https://dash.cloudflare.com), go to **Workers & Pages → Create → Pages → Connect to Git** and pick this repository.
2. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | React (Vite) |
   | Build command | `npm run build` |
   | Output directory | `dist` |
   | Environment variable | `NODE_VERSION` = `22` |

3. **Analytics (optional):** in the Pages project, open **Metrics → Web Analytics** and enable it. It's free and cookie-free.

The footer's **Last updated** month and year refresh automatically with each build.

## Shared Game Leaderboard

The leaderboard is served by [`functions/api/scores.js`](functions/api/scores.js), a Cloudflare Pages Function that stores scores in a free **Cloudflare D1** database. It rejects impossible scores and blocked words in names.

1. In Cloudflare, go to **Storage & Databases → D1 → Create database** (for example `portfolio-leaderboard`).
2. Open the database's **Console**, paste the contents of [`schema.sql`](schema.sql) and run it.
3. In the Pages project, go to **Settings → Bindings → Add → D1 database**, set the variable name to `DB` and select the database.
4. Redeploy the latest deployment so the binding takes effect.

When running locally with `npm run dev`, scores are saved in your own browser instead.

## Project Structure

```text
src/
  sections/      Each page section
  components/    Reusable parts (avatar, cursor effect, music player, etc.)
  hooks/         Music player and leaderboard logic
  game/          Deploy Dash drawing and physics
  data/          Website content (JSON files)

functions/       Cloudflare Pages Functions (leaderboard API)
public/          Images and music
schema.sql       Leaderboard database table
```

**Quick guide:** Edit `src/data/` to change the content, `src/components/` or `src/sections/` to change the design, and `public/` to add images or music.
