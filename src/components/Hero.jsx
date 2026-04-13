import { useEffect, useRef } from 'react';

const TAGS = ['Art Direction', 'Branding', 'Strategy', 'Web Design', 'Film', 'Music Video', 'Commercial', 'Editorial'];

export default function Hero({ loaded }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!loaded) return;
    setTimeout(() => {
      overlayRef.current?.classList.add('visible');
    }, 200);
  }, [loaded]);

  return (
    <section className="hero">
      <div className="hero__video-wrap">
        <iframe
          src="https://player.vimeo.com/video/1170983124?autoplay=1&muted=1&loop=1&controls=0&background=1"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          className="hero__iframe"
          title="FERAL Reel"
        />
        {/* LightBleed overlay */}
        <div className="hero__bleed hero__bleed--tl" />
        <div className="hero__bleed hero__bleed--tr" />
        <div className="hero__bleed hero__bleed--bl" />
        <div className="hero__bleed hero__bleed--br" />
        <div className="hero__vignette" />
      </div>

      <div ref={overlayRef} className="hero__overlay">
        <div className="hero__meta-row">
          <span className="hero__meta-label">© FEATURED PROJECTS</span>
          <span className="hero__meta-label">OUR WORK</span>
          <span className="hero__meta-label">CREATIVE UNIT</span>
        </div>
        <div className="hero__year">2026</div>
        <div className="hero__brand-tag">FERAL</div>
      </div>

      {/* Scrolling tag banner */}
      <div className="hero__tag-banner">
        <div className="hero__tag-track">
          {[...TAGS, ...TAGS, ...TAGS].map((tag, i) => (
            <span key={i} className="hero__tag">
              {tag} <span className="hero__tag-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #000;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .hero__video-wrap {
          flex: 1;
          position: relative;
          max-width: 1480px;
          width: 100%;
          margin: 60px auto 0;
          border-radius: 12px;
          overflow: hidden;
        }
        .hero__iframe {
          position: absolute;
          inset: -10%;
          width: 120%;
          height: 120%;
          border: none;
          pointer-events: none;
        }
        .hero__bleed {
          position: absolute;
          width: 50%; height: 50%;
          pointer-events: none;
          z-index: 2;
        }
        .hero__bleed--tl {
          top: 0; left: 0;
          background: radial-gradient(circle at 0% 0%, rgba(255,210,130,0.18) 0%, transparent 60%);
        }
        .hero__bleed--tr {
          top: 0; right: 0;
          background: radial-gradient(circle at 100% 0%, rgba(180,215,255,0.13) 0%, transparent 60%);
        }
        .hero__bleed--bl {
          bottom: 0; left: 0;
          background: radial-gradient(circle at 0% 100%, rgba(255,190,100,0.10) 0%, transparent 60%);
        }
        .hero__bleed--br {
          bottom: 0; right: 0;
          background: radial-gradient(circle at 100% 100%, rgba(140,190,255,0.08) 0%, transparent 60%);
        }
        .hero__vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%);
          z-index: 3;
          pointer-events: none;
        }
        .hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 4;
          opacity: 0;
          transition: opacity 1s ease 0.3s;
          pointer-events: none;
        }
        .hero__overlay.visible { opacity: 1; }
        .hero__meta-row {
          position: absolute;
          bottom: 60px; left: 0; right: 0;
          display: flex;
          justify-content: space-between;
          padding: 0 40px;
          pointer-events: none;
        }
        .hero__meta-label {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
        }
        .hero__year {
          position: absolute;
          top: 100px; left: 50px;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
        }
        .hero__brand-tag {
          position: absolute;
          bottom: 120px; right: 50px;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.25em;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
        }
        .hero__tag-banner {
          width: 100%;
          overflow: hidden;
          background: transparent;
          padding: 12px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 5;
        }
        .hero__tag-track {
          display: flex;
          gap: 0;
          white-space: nowrap;
          animation: tagScroll 20s linear infinite;
          width: max-content;
        }
        .hero__tag {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--grey);
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          gap: 20px;
        }
        .hero__tag-dot { color: var(--blue); font-size: 8px; }
        @keyframes tagScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (max-width: 768px) {
          .hero__video-wrap { margin: 56px auto 0; border-radius: 8px; }
          .hero__meta-row { display: none; }
          .hero__year, .hero__brand-tag { display: none; }
        }
      `}</style>
    </section>
  );
}
