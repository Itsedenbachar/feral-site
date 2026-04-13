import { useState } from 'react';
import CustomCursor from './components/CustomCursor';
import FeralReveal from './components/FeralReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import BottomCTA from './components/BottomCTA';
import './index.css';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <CustomCursor />
      <FeralReveal onComplete={() => setLoaded(true)} />
      <div className={`site ${loaded ? 'site--loaded' : ''}`}>
        <Navbar />
        <Hero loaded={loaded} />
        <Marquee />
        <About />
        <Portfolio />
        <Contact />
        <BottomCTA />
      </div>
      <style>{`
        .site {
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .site--loaded { opacity: 1; }
      `}</style>
    </>
  );
}
