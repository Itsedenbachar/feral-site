export default function Marquee() {
  const text = 'Featured Works';
  const repeated = Array(8).fill(text);

  return (
    <section className="marquee-section">
      <div className="marquee-track-wrap">
        <div className="marquee-track">
          {[...repeated, ...repeated].map((t, i) => (
            <span key={i} className="marquee-item">
              {t}<span className="marquee-sep"> </span>
            </span>
          ))}
        </div>
      </div>
      <style>{`
        .marquee-section {
          width: 100%;
          overflow: hidden;
          padding: 0;
          background: #000;
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .marquee-track-wrap {
          overflow: hidden;
          width: 100%;
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          width: max-content;
          animation: marqueeScroll 18s linear infinite;
          padding: 16px 0;
        }
        .marquee-item {
          font-size: clamp(72px, 12vw, 160px);
          font-weight: 600;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--white);
          padding: 0 40px;
          font-family: 'Inter', sans-serif;
          display: inline-block;
        }
        .marquee-sep {
          color: var(--blue);
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
