import { useEffect, useRef } from 'react';

function AboutImage({ imageUrl }) {
  return (
    <div className="about-img-wrap">
      <img
        src={imageUrl}
        alt="FERAL"
        className="about-img"
        loading="lazy"
        decoding="async"
      />
      <style>{`
        .about-img-wrap {
          position: relative;
          width: 100%;
          max-width: 551px;
          border-radius: 12px;
          overflow: hidden;
        }
        .about-img {
          width: 100%;
          aspect-ratio: 551/405;
          object-fit: cover;
          display: block;
          border-radius: 12px;
          transform: scale(1);
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .about.in-view .about-img {
          transform: scale(1.04);
        }
      `}</style>
    </div>
  );
}

function DotGrid() {
  return (
    <div className="dot-grid">
      <style>{`
        .dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current?.classList.add('in-view');
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about" ref={sectionRef}>
      <DotGrid />
      <div className="about__inner">
        <div className="about__left">
          <AboutImage imageUrl="https://framerusercontent.com/images/wHMk5TqL5smgOMi9bgGX1caA944.jpg" />
        </div>
        <div className="about__right">
          <p className="about__body">
            Two filmmakers, one fluid workflow. We're wired for collaboration — working solo or integrating with teams who push as hard as we do.
          </p>
          <p className="about__sub">Commercial, Music Videos and Film</p>
          <a
            href="#portfolio"
            className="about__btn"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            SEE WORKS
            <span className="about__btn-arrow">→</span>
          </a>
          {/* Decorative rings */}
          <div className="about__rings">
            <div className="about__ring" style={{ width: 120, height: 120, opacity: 0.08 }} />
            <div className="about__ring" style={{ width: 80, height: 80, opacity: 0.05 }} />
            <div className="about__ring" style={{ width: 40, height: 40, opacity: 0.04 }} />
          </div>
        </div>
      </div>
      <style>{`
        .about {
          position: relative;
          padding: 120px 40px;
          max-width: 1480px;
          margin: 0 auto;
          overflow: hidden;
        }
        .about__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .about__left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .about.in-view .about__left {
          opacity: 1;
          transform: translateX(0);
        }
        .about__right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
          position: relative;
        }
        .about.in-view .about__right {
          opacity: 1;
          transform: translateX(0);
        }
        .about__body {
          font-size: 22px;
          font-weight: 500;
          line-height: 1.4;
          color: var(--white);
          margin-bottom: 16px;
          font-family: 'Helvetica Neue', sans-serif;
        }
        .about__sub {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--grey);
          margin-bottom: 48px;
        }
        .about__btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 28px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: white;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .about__btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.4);
        }
        .about__btn-arrow {
          font-size: 16px;
          transition: transform 0.3s ease;
        }
        .about__btn:hover .about__btn-arrow {
          transform: translateX(4px);
        }
        .about__rings {
          position: absolute;
          right: -20px;
          top: -40px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .about__ring {
          position: absolute;
          border: 1px solid rgba(0,153,255,0.3);
          border-radius: 50%;
          animation: ringPulse 4s ease-in-out infinite;
        }
        .about__ring:nth-child(2) { animation-delay: 0.5s; }
        .about__ring:nth-child(3) { animation-delay: 1s; }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @media (max-width: 900px) {
          .about__inner { grid-template-columns: 1fr; gap: 48px; }
          .about { padding: 80px 24px; }
        }
      `}</style>
    </section>
  );
}
