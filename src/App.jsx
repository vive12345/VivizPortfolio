import MusicPlayer from './components/MusicPlayer';
import About from './sections/About';
import Contact from './sections/Contact';
import Education from './sections/Education';
import Experience from './sections/Experience';
import ForYou from './sections/ForYou';
import Fun from './sections/Fun';
import Home from './sections/Home';
import Projects from './sections/Projects';

export default function App() {
  return (
    <>
      <Home />
      <About />
      <Education />
      <Experience />
      <Projects />
      <Contact />
      <Fun />
      <ForYou />
      <MusicPlayer />
    </>
  );
}
