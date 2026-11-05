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

No backend is needed unless you want a shared leaderboard for all visitors.

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

## Shared Game Leaderboard (Optional)

By default, each visitor's game scores are saved in their own browser. To show **one leaderboard for everyone**, connect Supabase:

1. Create a free project at [supabase.com](https://supabase.com).
2. Run the SQL from [`.env.example`](.env.example) in the Supabase **SQL Editor**.
3. Copy `.env.example` to `.env`.
4. Add your **Project URL** and **anon key** from **Project Settings → API**.
5. Add the same environment variables to your hosting provider.

The `.env` file is Git-ignored. The frontend anon key is still public, so make sure your Supabase database permissions are configured correctly.

## Deploy

You can deploy the website to a static hosting service like **Vercel** or **Cloudflare Pages**.

Import your GitHub repository and use:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |

The footer's **Last updated** month and year refresh automatically with each build.

## Project Structure

```text
src/
  sections/      Each page section
  components/    Reusable parts (avatar, cursor effect, music player, etc.)
  hooks/         Music player and leaderboard logic
  game/          Deploy Dash drawing and physics
  data/          Website content (JSON files)

public/          Images and music
```

**Quick guide:** Edit `src/data/` to change the content, `src/components/` or `src/sections/` to change the design, and `public/` to add images or music.
