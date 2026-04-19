import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const PROJECTS = [
  { title: 'ZVEZDA — Short Film',            thumb: 'https://framerusercontent.com/images/95V69KjMRtXphHTwh2yMvgsvk.jpg',   video: 'https://vimeo.com/1146976260' },
  { title: 'AINKER SS26',                    thumb: 'https://framerusercontent.com/images/g95vL7DR4tEUb2ulOvR7vEq1tQ.png',   video: 'https://iframe.mediadelivery.net/embed/457575/f3df6d6d-979d-48bc-90cd-ea18f1788ed2' },
  { title: 'ALEXANDER MALOFEEV — Prelude',   thumb: 'https://framerusercontent.com/images/88q7DN3ZUSZyV5G26tYVQhjmGw.jpg',   video: 'https://vimeo.com/1162708355' },
  { title: 'LYZA — TOT',                     thumb: 'https://framerusercontent.com/images/a5SS9HRw4thfvT5wCVC5luDMw0.jpg',   video: 'https://vimeo.com/1161517747' },
  { title: 'BORN SHY FW26',                  thumb: 'https://framerusercontent.com/images/NepyIgemZlJWFxho5npKLnRzxME.jpg',  video: 'https://vimeo.com/1171861807' },
  { title: 'MASH — Fashion Editorial',       thumb: 'https://framerusercontent.com/images/WrFnVsLZ9jPgA45Quwgt4ChNOaQ.png',  video: 'https://iframe.mediadelivery.net/embed/457575/591ec67c-1097-4551-8bef-dcee25b42383' },
  { title: 'ADIDAS',                         thumb: 'https://framerusercontent.com/images/EGtGCYqhOW6gqcf6weiEduNiUE.png',   video: 'https://iframe.mediadelivery.net/embed/457575/37bc53e4-6350-4fd1-84a0-658005b71979' },
  { title: 'TAMIR GREENBERG — Pass You By',  thumb: 'https://framerusercontent.com/images/fL92iKaIAWNBYlX3nwbcILJqg.jpg',   video: 'https://vimeo.com/1003711808' },
  { title: 'ALEXANDER MALOFEEV — The Lark',  thumb: 'https://framerusercontent.com/images/ccfstWtAQ6D6AXN0i7ujgGMI.jpg',    video: 'https://vimeo.com/1162708659' },
  { title: 'MASH — Fashion Editorial II',    thumb: 'https://framerusercontent.com/images/LK9MM6nfqEZCWbe8b79UxIA.jpg',     video: 'https://vimeo.com/1135286242' },
  { title: 'AINKER FW25',                    thumb: 'https://framerusercontent.com/images/ofeIZxDJ02VE4QScIS8aVBz2Jzw.png', video: 'https://iframe.mediadelivery.net/embed/457575/d872d0b6-6307-410d-9f05-843df9c28a36' },
  { title: 'Matériau éternel — Motty Perry', thumb: 'https://framerusercontent.com/images/6BE2dw7aXAVGbqMc1wer8BIZTQs.jpg', video: 'https://vimeo.com/996677557' },
  { title: 'JHON LAUNDRY',                   thumb: 'https://framerusercontent.com/images/8J3GyX73dcdX4YlV3MDA0g82lgs.jpg', video: 'https://vimeo.com/660125933' },
  { title: 'STRONGFUL',                      thumb: 'https://framerusercontent.com/images/954SLi64wkZIGJfaxDmshPT2efQ.jpg', video: 'https://vimeo.com/765465571' },
  { title: 'TATAN — MV',                     thumb: 'https://framerusercontent.com/images/Z2sjnWWKrXYJFalA5vXhNUGGby4.jpg', video: 'https://vimeo.com/726039555' },
  { title: 'MASH — Fashion Editorial III',   thumb: 'https://framerusercontent.com/images/f65b5lJDNohM3u85D0m1EtVtg.jpg',   video: 'https://vimeo.com/1084326507' },
  { title: 'ULIKE — Commercial',             thumb: 'https://framerusercontent.com/images/sPsGUEQcewzHV1feudGhRyITlE.jpg',  video: 'https://vimeo.com/1108859882' },
];

function getLightboxUrl(url) {
  if (!url) return null;
  if (url.includes('vimeo.com/') && !url.includes('player.vimeo')) {
    const id = url.split('/').filter(Boolean).pop();
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  if (url.includes('mediadelivery.net')) {
    return url + '?autoplay=true&muted=false&controls=true';
  }
  return url;
}

function Lightbox({ project, onClose }) {
  useEffect(() => {
    document.body.classList.add('modal-open');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fp-lb" onClick={onClose}>
      <div className="fp-lb__inner" onClick={e => e.stopPropagation()}>
        <button className="fp-lb__close" onClick={onClose}>✕</button>
        <iframe
          src={getLightboxUrl(project.video)}
          className="fp-lb__iframe"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={project.title}
        />
      </div>
      <style>{`
        .fp-lb {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.92); z-index: 9000;
          display: flex; align-items: center; justify-content: center;
          animation: fpLbFade 0.25s ease;
        }
        @keyframes fpLbFade { from { opacity: 0; } to { opacity: 1; } }
        .fp-lb__inner {
          position: relative;
          width: min(90vw, 1200px); aspect-ratio: 16/9;
          border-radius: 8px; overflow: hidden;
          animation: fpLbScale 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes fpLbScale { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .fp-lb__iframe { width: 100%; height: 100%; border: none; }
        .fp-lb__close {
          position: absolute; top: 12px; right: 12px;
          background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15);
          color: white; width: 36px; height: 36px; border-radius: 50%;
          font-size: 14px; display: flex; align-items: center; justify-content: center;
          z-index: 10; cursor: none; transition: background 0.2s;
        }
        .fp-lb__close:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>,
    document.body
  );
}

export default function FullscreenPortfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxProject, setLightboxProject] = useState(null);

  return (
    <section className="fp">
      <div className="fp__bg">
        {PROJECTS.map((p, i) => (
          <div
            key={i}
            className={`fp__bg-layer${i === activeIndex ? ' active' : ''}`}
            style={{ backgroundImage: `url(${p.thumb})` }}
          />
        ))}
      </div>
      <div className="fp__vignette" />

      <nav className="fp__sidebar">
        <div className="fp__brand">FERAL</div>
        <ul className="fp__list">
          {PROJECTS.map((p, i) => (
            <li key={i} className={`fp__item${i === activeIndex ? ' active' : ''}`}>
              <button
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => setLightboxProject(p)}
              >
                {p.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="fp__label">
        <div className="fp__label-eyebrow">Selected Work</div>
        <div className="fp__label-title">{PROJECTS[activeIndex].title}</div>
      </div>

      {lightboxProject && (
        <Lightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />
      )}

      <style>{`
        .fp {
          position: relative; height: 100vh;
          overflow: hidden; background: #000;
        }
        .fp__bg { position: absolute; inset: 0; }
        .fp__bg-layer {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0; transition: opacity 0.7s ease;
        }
        .fp__bg-layer.active { opacity: 1; }
        .fp__vignette {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%);
        }
        .fp__sidebar {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 320px; z-index: 10;
          display: flex; flex-direction: column;
          padding: 48px 40px;
        }
        .fp__brand {
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #fff; margin-bottom: 60px;
        }
        .fp__list {
          list-style: none;
          display: flex; flex-direction: column;
          gap: 4px; overflow-y: auto; flex: 1;
          padding-bottom: 60px;
        }
        .fp__list::-webkit-scrollbar { display: none; }
        .fp__item button {
          background: none; border: none; outline: none;
          color: rgba(255,255,255,0.35);
          font-family: inherit; font-size: 13px; font-weight: 400;
          letter-spacing: 0.04em; text-align: left;
          padding: 7px 0; cursor: none;
          transition: color 0.2s ease, transform 0.2s ease;
          line-height: 1.3; width: 100%; text-transform: uppercase;
        }
        .fp__item button:hover,
        .fp__item.active button { color: #fff; transform: translateX(6px); }
        .fp__label {
          position: absolute; bottom: 48px; right: 48px;
          z-index: 10; text-align: right;
        }
        .fp__label-eyebrow {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); margin-bottom: 4px;
        }
        .fp__label-title {
          font-size: 15px; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase; color: #fff;
        }
        @media (max-width: 640px) {
          .fp__sidebar { width: 100%; padding: 32px 24px; }
          .fp__label { display: none; }
        }
      `}</style>
    </section>
  );
}
