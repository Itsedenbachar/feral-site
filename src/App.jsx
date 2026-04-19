import { useState, lazy, Suspense } from 'react';
import CustomCursor from './components/CustomCursor';
import FeralReveal from './components/FeralReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import './index.css';

const Portfolio = lazy(() => import('./components/Portfolio'));
const Contact = lazy(() => import('./components/Contact'));
const BottomCTA = lazy(() => import('./components/BottomCTA'));

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
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Portfolio />
          <Contact />
          <BottomCTA />
        </Suspense>
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
