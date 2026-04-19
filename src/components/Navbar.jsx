import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToId = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="/" className="navbar__logo">FERAL</a>
      <div className="navbar__links">
        <a href="#portfolio" className="navbar__link" onClick={scrollToId('portfolio')}>Work</a>
        <a href="#contact" className="navbar__link" onClick={scrollToId('contact')}>Contact</a>
      </div>
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 24px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.4s ease, padding 0.4s ease;
        }
        .navbar.scrolled {
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(12px);
          padding: 16px 40px;
        }
        .navbar__logo {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--blue);
          font-family: 'Inter', sans-serif;
        }
        .navbar__links {
          display: flex;
          gap: 40px;
        }
        .navbar__link {
          font-size: 14px;
          font-weight: 500;
          color: var(--blue);
          letter-spacing: 0.05em;
          position: relative;
          font-family: 'Inter', sans-serif;
        }
        .navbar__link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: var(--blue);
          transition: width 0.3s ease;
        }
        .navbar__link:hover::after { width: 100%; }
        @media (max-width: 768px) {
          .navbar { padding: 20px 24px; }
          .navbar__links { gap: 24px; }
        }
      `}</style>
    </nav>
  );
}
