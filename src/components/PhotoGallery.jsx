import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function PhotoGallery({ title, photos, onClose }) {
  const [closing, setClosing] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 500);
  };

  const openPhoto = (i) => setSelected(i);
  const closePhoto = () => setSelected(null);
  const prev = () => setSelected(i => (i - 1 + photos.length) % photos.length);
  const next = () => setSelected(i => (i + 1) % photos.length);

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (selected !== null) {
        if (e.key === 'ArrowLeft') prev();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'Escape') closePhoto();
      } else {
        if (e.key === 'Escape') handleClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return createPortal(
    <div className={`pg-overlay${closing ? ' pg-overlay--closing' : ''}`} onClick={selected !== null ? closePhoto : handleClose}>
      <div className="pg-container" onClick={e => e.stopPropagation()}>
        <div className="pg-header">
          <span className="pg-title">{title}</span>
          <button className="pg-close" onClick={selected !== null ? closePhoto : handleClose}>✕</button>
        </div>
        <div className="pg-grid">
          {photos.map((src, i) => (
            <div key={i} className="pg-item" onClick={() => openPhoto(i)}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>

      {selected !== null && (
        <div className="pg-viewer" onClick={closePhoto}>
          <div className="pg-viewer__img-wrap" onClick={e => e.stopPropagation()}>
            <img src={photos[selected]} alt="" />
          </div>
          <div className="pg-viewer__nav" onClick={e => e.stopPropagation()}>
            <button className="pg-viewer__arrow" onClick={prev}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="pg-viewer__count">{selected + 1} / {photos.length}</span>
            <button className="pg-viewer__arrow" onClick={next}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .pg-overlay {
          position: fixed; inset: 0;
          background: #000;
          z-index: 9000;
          overflow-y: auto;
          animation: pgFade 0.25s ease;
        }
        @keyframes pgFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pgFadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.97); } }
        .pg-overlay--closing { animation: pgFadeOut 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
        .pg-container {
          padding: 40px 6vw 80px;
          min-height: 100%;
        }
        .pg-header {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: 40px;
        }
        .pg-title {
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase; color: #fff;
        }
        .pg-close {
          background: none; border: none;
          color: rgba(255,255,255,0.4); font-size: 18px;
          cursor: none; transition: color 0.2s;
          padding: 0;
        }
        .pg-close:hover { color: #fff; }
        .pg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .pg-item {
          aspect-ratio: 16/9;
          overflow: hidden;
          border-radius: 4px;
          background: #111;
          cursor: none;
        }
        .pg-item img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: opacity 0.3s ease;
        }
        .pg-item:hover img { opacity: 0.75; }

        /* Fullscreen viewer */
        .pg-viewer {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.96);
          z-index: 9100;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          animation: pgFade 0.2s ease;
        }
        .pg-viewer__img-wrap {
          flex: 1; width: 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 6vw 20px;
          min-height: 0;
        }
        .pg-viewer__img-wrap img {
          max-width: 100%; max-height: 100%;
          object-fit: contain; display: block;
          border-radius: 4px;
        }
        .pg-viewer__nav {
          display: flex; align-items: center; gap: 32px;
          padding: 20px 0 36px;
          flex-shrink: 0;
        }
        .pg-viewer__arrow {
          background: none; border: none;
          color: rgba(255,255,255,0.5);
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: none; transition: color 0.2s;
          padding: 0;
        }
        .pg-viewer__arrow:hover { color: #fff; }
        .pg-viewer__count {
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.4);
          min-width: 48px; text-align: center;
        }

        @media (max-width: 768px) {
          .pg-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .pg-container { padding: 24px 14px 60px; }
          .pg-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>,
    document.body
  );
}
