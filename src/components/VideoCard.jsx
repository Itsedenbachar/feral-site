import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

function getPreviewUrl(url) {
  if (!url) return null;
  if (url.includes('vimeo.com/video/') || url.includes('vimeo.com/')) {
    const id = url.split('/').filter(Boolean).pop();
    return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&controls=0&background=1`;
  }
  if (url.includes('mediadelivery.net')) {
    return url + '?autoplay=true&muted=true&loop=true&controls=false';
  }
  return null;
}

function getLightboxUrl(url) {
  if (!url) return null;
  if (url.includes('vimeo.com/video/')) {
    return url + '?autoplay=1';
  }
  if (url.includes('vimeo.com/') && !url.includes('player.vimeo')) {
    const id = url.split('/').filter(Boolean).pop();
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  if (url.includes('mediadelivery.net')) {
    return url + '?autoplay=true&muted=false&controls=true';
  }
  return url;
}

function Lightbox({ url, title, onClose }) {
  useEffect(() => {
    document.body.classList.add('modal-open');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const lightboxUrl = getLightboxUrl(url);

  return createPortal(
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox__inner" onClick={e => e.stopPropagation()}>
        <button className="lightbox__close" onClick={onClose}>✕</button>
        <iframe
          src={lightboxUrl}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
          className="lightbox__iframe"
        />
      </div>
      <style>{`
        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 9000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lbFadeIn 0.25s ease;
        }
        @keyframes lbFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .lightbox__inner {
          position: relative;
          width: min(90vw, 1200px);
          aspect-ratio: 16/9;
          border-radius: 8px;
          overflow: hidden;
          animation: lbScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes lbScaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .lightbox__iframe {
          width: 100%; height: 100%;
          border: none;
        }
        .lightbox__close {
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          z-index: 10;
          cursor: none;
          transition: background 0.2s;
        }
        .lightbox__close:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>,
    document.body
  );
}

export default function VideoCard({ title, videoUrl, thumbnailUrl, comingSoon, index }) {
  const [hovered, setHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const iframeRef = useRef(null);
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);

  const previewUrl = getPreviewUrl(videoUrl);

  const handleEnter = useCallback(() => {
    if (comingSoon) return;
    clearTimeout(leaveTimer.current);
    hoverTimer.current = setTimeout(() => {
      setHovered(true);
      if (iframeRef.current && previewUrl) {
        iframeRef.current.src = previewUrl;
      }
    }, 80);
  }, [comingSoon, previewUrl]);

  const handleLeave = useCallback(() => {
    clearTimeout(hoverTimer.current);
    setHovered(false);
    leaveTimer.current = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank';
      }
    }, 400);
  }, []);

  const handleClick = useCallback(() => {
    if (comingSoon || !videoUrl) return;
    setLightboxOpen(true);
  }, [comingSoon, videoUrl]);

  useEffect(() => () => {
    clearTimeout(hoverTimer.current);
    clearTimeout(leaveTimer.current);
  }, []);

  return (
    <>
      <div
        className={`video-card ${hovered ? 'video-card--hovered' : ''} ${comingSoon ? 'video-card--coming-soon' : ''}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        style={{ animationDelay: `${(index % 6) * 0.05}s` }}
      >
        <div className="video-card__thumb">
          <img src={thumbnailUrl} alt={title} loading="lazy" />
        </div>
        {previewUrl && (
          <iframe
            ref={iframeRef}
            src="about:blank"
            frameBorder="0"
            allow="autoplay"
            className="video-card__preview"
            title={`${title} preview`}
          />
        )}
        <div className="video-card__overlay">
          {comingSoon && (
            <span className="video-card__coming-soon">COMING SOON</span>
          )}
          {!comingSoon && (
            <span className="video-card__title">{title}</span>
          )}
        </div>
      </div>
      {lightboxOpen && (
        <Lightbox
          url={videoUrl}
          title={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
      <style>{`
        .video-card {
          position: relative;
          border-radius: 7px;
          overflow: hidden;
          aspect-ratio: 16/10;
          cursor: none;
          background: #111;
          animation: cardReveal 0.6s ease both;
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .video-card--coming-soon { cursor: default; }
        .video-card__thumb {
          position: absolute;
          inset: 0;
          transition: opacity 0.35s ease;
        }
        .video-card--hovered .video-card__thumb { opacity: 0; }
        .video-card__thumb img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .video-card__preview {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          border: none;
          pointer-events: none;
        }
        .video-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
          display: flex;
          align-items: flex-end;
          padding: 14px;
          z-index: 2;
        }
        .video-card__title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: white;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .video-card--hovered .video-card__title {
          opacity: 1;
          transform: translateY(0);
        }
        .video-card__coming-soon {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--grey);
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
        .video-card:not(.video-card--coming-soon):hover {
          box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
        }
      `}</style>
    </>
  );
}
