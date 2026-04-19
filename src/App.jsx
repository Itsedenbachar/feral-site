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

function Impressum() {
  return (
    <footer className="impressum">
      <div className="impressum__inner">
        <div>
          <p className="impressum__heading">Impressum</p>
          <p>Eden Bachar</p>
          <p>Wiener Str. 11</p>
          <p>10999 Berlin</p>
          <p>Germany</p>
        </div>
        <div>
          <p className="impressum__heading">Kontakt</p>
          <p><a href="mailto:itsedenbachar@gmail.com">itsedenbachar@gmail.com</a></p>
          <p>+49 176 36899257</p>
        </div>
        <div>
          <p>Freiberufler</p>
          <p>Kleinunternehmer gemäß § 19 UStG</p>
        </div>
      </div>
      <style>{`
        .impressum {
          background: #000;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 48px 40px;
        }
        .impressum__inner {
          max-width: 1480px;
          margin: 0 auto;
          display: flex;
          gap: 60px;
          flex-wrap: wrap;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          line-height: 1.9;
          font-family: 'Helvetica Neue', sans-serif;
        }
        .impressum__heading {
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 4px;
        }
        .impressum a {
          color: rgba(255,255,255,0.35);
          text-decoration: none;
        }
        .impressum a:hover { color: rgba(255,255,255,0.6); }
        @media (max-width: 640px) {
          .impressum { padding: 40px 24px; }
          .impressum__inner { gap: 32px; flex-direction: column; }
        }
      `}</style>
    </footer>
  );
}

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
        <Impressum />
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
