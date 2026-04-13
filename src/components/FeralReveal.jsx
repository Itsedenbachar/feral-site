import { useEffect, useState } from 'react';

export default function FeralReveal({ onComplete }) {
  const [phase, setPhase] = useState('ghost'); // ghost → fill → fadeout → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fill'), 400);
    const t2 = setTimeout(() => setPhase('fadeout'), 2200);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div className={`feral-reveal ${phase}`}>
      <div className="feral-reveal__text">
        <span className="feral-reveal__ghost">FERAL</span>
        <span className="feral-reveal__fill">FERAL</span>
      </div>
      <style>{`
        .feral-reveal {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 99997;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.9s ease;
        }
        .feral-reveal.fadeout {
          opacity: 0;
          pointer-events: none;
        }
        .feral-reveal__text {
          position: relative;
          font-size: 42px;
          font-weight: 600;
          letter-spacing: 0.2em;
          font-family: 'Inter', sans-serif;
        }
        .feral-reveal__ghost {
          color: rgba(255,255,255,0.08);
          position: absolute;
          left: 0;
          white-space: nowrap;
        }
        .feral-reveal__fill {
          color: white;
          clip-path: inset(100% 0 0 0);
          display: block;
          white-space: nowrap;
          transition: clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .feral-reveal.fill .feral-reveal__fill {
          clip-path: inset(0% 0 0 0);
        }
      `}</style>
    </div>
  );
}
