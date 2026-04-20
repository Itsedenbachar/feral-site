import { useRef, useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Hls from 'hls.js';
import PhotoGallery from './PhotoGallery';

const VideoPlayer = lazy(() => import('./VideoPlayer'));

function isHlsUrl(url) {
  return !!url && /\.m3u8(\?|$)/i.test(url);
}

function getMuxPlaybackId(url) {
  if (!url) return null;
  const match = url.match(/stream\.mux\.com\/([^.]+)\.m3u8/);
  return match ? match[1] : null;
}

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

function Lightbox({ url, title, thumbnailUrl, onClose }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 500);
  };

  useEffect(() => {
    document.body.classList.add('modal-open');
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const useCustomPlayer = isHlsUrl(url);
  const lightboxUrl = useCustomPlayer ? null : getLightboxUrl(url);

  return createPortal(
    <div className={`lightbox${closing ? ' lightbox--closing' : ''}`} onClick={handleClose}>
      <div className="lightbox__inner" onClick={e => e.stopPropagation()}>
        <button className="lightbox__close" onClick={handleClose}>✕</button>
        {useCustomPlayer ? (
          <Suspense fallback={<div className="lightbox__loading" />}>
            <VideoPlayer src={url} poster={thumbnailUrl} />
          </Suspense>
        ) : (
          <iframe
            src={lightboxUrl}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
            className="lightbox__iframe"
          />
        )}
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
        @keyframes lbFadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.97); }
        }
        .lightbox--closing { animation: lbFadeOut 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
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
        .lightbox__loading {
          width: 100%; height: 100%;
          background: #000;
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

export default function VideoCard({ title, videoUrl, thumbnailUrl, comingSoon, photos, index }) {
  const [hovered, setHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const iframeRef = useRef(null);
  const previewVideoRef = useRef(null);
  const hlsPreviewRef = useRef(null);
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);

  const previewUrl = getPreviewUrl(videoUrl);
  const muxPlaybackId = getMuxPlaybackId(videoUrl);

  const handleEnter = useCallback(() => {
    if (comingSoon) return;
    clearTimeout(leaveTimer.current);
    hoverTimer.current = setTimeout(() => {
      setHovered(true);
      if (muxPlaybackId && previewVideoRef.current) {
        const v = previewVideoRef.current;
        v.classList.remove('video-card__preview-video--ready');
        const src = `https://stream.mux.com/${muxPlaybackId}.m3u8`;
        if (Hls.isSupported()) {
          if (hlsPreviewRef.current) hlsPreviewRef.current.destroy();
          const hls = new Hls({ startLevel: 0, maxBufferLength: 10 });
          hlsPreviewRef.current = hls;
          hls.loadSource(src);
          hls.attachMedia(v);
          hls.on(Hls.Events.MANIFEST_PARSED, () => { v.play().catch(() => {}); });
        } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
          v.src = src;
          v.play().catch(() => {});
        }
      } else if (iframeRef.current && previewUrl) {
        iframeRef.current.src = previewUrl;
      }
    }, 80);
  }, [comingSoon, muxPlaybackId, previewUrl]);

  const handleLeave = useCallback(() => {
    clearTimeout(hoverTimer.current);
    setHovered(false);
    if (hlsPreviewRef.current) {
      hlsPreviewRef.current.destroy();
      hlsPreviewRef.current = null;
    }
    if (previewVideoRef.current) {
      previewVideoRef.current.classList.remove('video-card__preview-video--ready');
      previewVideoRef.current.pause();
      previewVideoRef.current.removeAttribute('src');
      previewVideoRef.current.load();
    }
    leaveTimer.current = setTimeout(() => {
      if (iframeRef.current) iframeRef.current.src = 'about:blank';
    }, 400);
  }, []);

  const handleClick = useCallback(() => {
    if (comingSoon) return;
    if (photos?.length) { setGalleryOpen(true); return; }
    if (!videoUrl) return;
    setLightboxOpen(true);
  }, [comingSoon, videoUrl, photos]);

  useEffect(() => () => {
    clearTimeout(hoverTimer.current);
    clearTimeout(leaveTimer.current);
    if (hlsPreviewRef.current) hlsPreviewRef.current.destroy();
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
          <img src={thumbnailUrl} alt={title} loading="lazy" decoding="async" />
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
        {muxPlaybackId && (
          <video
            ref={previewVideoRef}
            muted
            loop
            playsInline
            className="video-card__preview-video"
            onCanPlay={() => previewVideoRef.current?.classList.add('video-card__preview-video--ready')}
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
          thumbnailUrl={thumbnailUrl}
          onClose={() => setLightboxOpen(false)}
        />
      )}
      {galleryOpen && (
        <PhotoGallery
          title={title}
          photos={photos}
          onClose={() => setGalleryOpen(false)}
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
        }
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
        .video-card__preview-video {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .video-card__preview-video--ready { opacity: 1; }
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
