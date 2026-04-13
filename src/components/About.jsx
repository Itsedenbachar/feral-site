import { useEffect, useRef } from 'react';

function ScrollRippleImage({ imageUrl }) {
  const imgRef = useRef(null);
  const turbRef = useRef(null);
  const dispRef = useRef(null);
  const velRef = useRef(0);
  const seedRef = useRef(0);
  const rafRef = useRef(null);
  const filterId = useRef(`ripple-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const animate = () => {
      velRef.current *= 0.91;
      if (Math.abs(velRef.current) > 0.001) {
        seedRef.current += velRef.current * 0.1;
        if (turbRef.current) turbRef.current.setAttribute('seed', seedRef.current);
        const scale = 7 + Math.abs(velRef.current) * 12;
        if (dispRef.current) dispRef.current.setAttribute('scale', scale);
      } else {
        if (dispRef.current) dispRef.current.setAttribute('scale', 7);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const onWheel = (e) => {
      velRef.current += e.deltaY * 0.004;
    };
    const onScroll = () => {
      velRef.current += 0.5;
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const id = filterId.current;

  return (
    <div className="ripple-wrap">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="turbulence"
              baseFrequency="0.002 0.018"
              numOctaves="2"
              seed="0"
              result="turbulence"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="turbulence"
              scale="7"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>
      <img
        ref={imgRef}
        src={imageUrl}
        alt="FERAL"
        className="ripple-img"
        style={{ filter: `url(#${id})` }}
      />
      <style>{`
        .ripple-wrap {
          position: relative;
          width: 100%;
          max-width: 551px;
          border-radius: 12px;
          overflow: hidden;
        }
        .ripple-img {
          width: 100%;
          aspect-ratio: 551/405;
          object-fit: cover;
          display: block;
          border-radius: 12px;
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
          <ScrollRippleImage imageUrl="https://framerusercontent.com/images/wHMk5TqL5smgOMi9bgGX1caA944.jpg" />
        </div>
        <div className="about__right">
          <p className="about__body">
            Two filmmakers, one fluid workflow. We're wired for collaboration — working solo or integrating with teams who push as hard as we do.
          </p>
          <p className="about__sub">Commercial, Music Videos and Film</p>
          <a href="#portfolio" className="about__btn">
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
