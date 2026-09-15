import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Hls from 'hls.js';
import PhotoGallery from './PhotoGallery';

const VideoPlayer = lazy(() => import('./VideoPlayer'));

function isHlsUrl(url) {
  return !!url && /\.m3u8(\?|$)/i.test(url);
}

function getMuxId(url) {
  if (!url) return null;
  const m = url.match(/stream\.mux\.com\/([^.]+)\.m3u8/);
  return m ? m[1] : null;
}

function slugify(t) {
  return (t || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function compactSlug(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function findProjectByPath(pathname, projects) {
  const raw = (pathname || '').replace(/^\/+|\/+$/g, '');
  if (!raw) return null;
  const target = compactSlug(raw);
  if (!target) return null;
  return projects.find(p => compactSlug(p.title) === target) || null;
}

const PROJECTS = [
  { title: 'SHOWREEL',                       cat: null,         thumb: 'https://image.mux.com/dwYuh02o02BOdqg3ABHkl9cH2E5IoIPd00U01GY01Vq0201qRk/thumbnail.jpg', video: 'https://stream.mux.com/dwYuh02o02BOdqg3ABHkl9cH2E5IoIPd00U01GY01Vq0201qRk.m3u8' },
  { title: 'YOUNG NIGHTS - Short Film',       cat: 'films',      thumb: 'https://image.mux.com/d6QxYezMLM018OZkZsiQn5OiDg3MwvLX5HaUJRn01lYV4/thumbnail.jpg', video: 'https://stream.mux.com/d6QxYezMLM018OZkZsiQn5OiDg3MwvLX5HaUJRn01lYV4.m3u8', bts: ['/young-nights-bts/bts-01.jpg', '/young-nights-bts/bts-02.jpg', '/young-nights-bts/bts-03.jpg', '/young-nights-bts/bts-04.jpg', '/young-nights-bts/bts-05.jpg'] },
  { title: 'GIANT ROOKS - The Big Night Out', cat: 'music',      thumb: 'https://image.mux.com/F2MVqekhXjh7l2LYnyeqKFejyZZj02yV6cLT00sw5G017I/thumbnail.jpg', video: 'https://stream.mux.com/F2MVqekhXjh7l2LYnyeqKFejyZZj02yV6cLT00sw5G017I.m3u8' },
  { title: 'Temmis - Für immer drauf',        cat: 'music',      thumb: 'https://image.mux.com/BgjyNHS4SE5ESiYRa8g301TdK5Jw3O1iLy5Nv2EW32Gk/thumbnail.jpg', video: 'https://stream.mux.com/BgjyNHS4SE5ESiYRa8g301TdK5Jw3O1iLy5Nv2EW32Gk.m3u8' },
  { title: 'ZVEZDA - Short Film',            cat: 'films',      thumb: 'https://image.mux.com/9GI01WGLJgu02hz8MzCqVjhPN0035wvtSjlmASpyzMnsuQ/thumbnail.jpg?time=73',   video: 'https://stream.mux.com/9GI01WGLJgu02hz8MzCqVjhPN0035wvtSjlmASpyzMnsuQ.m3u8' },
  { title: 'AINKER SS26',                    cat: 'fashion',    thumb: 'https://image.mux.com/FvFuLIldOQQTvBOzILCqRmDzzysAO65ehVNwyCIPJUQ/thumbnail.jpg',   video: 'https://stream.mux.com/FvFuLIldOQQTvBOzILCqRmDzzysAO65ehVNwyCIPJUQ.m3u8' },
  { title: 'ALEXANDER MALOFEEV - Prelude',   cat: 'music',      thumb: 'https://image.mux.com/W1oiTDuCS58FBqqIinq23SQw39zKuhJpjN6qM101LILE/thumbnail.jpg?time=4',   video: 'https://stream.mux.com/W1oiTDuCS58FBqqIinq23SQw39zKuhJpjN6qM101LILE.m3u8' },
  { title: 'LYZA - TOT',                     cat: 'music',      thumb: 'https://image.mux.com/028Orv7pQZE022oa5Jbs4CrzqmFmgMTB6HRF3VtTnCpQg/thumbnail.jpg?time=16',   video: 'https://stream.mux.com/028Orv7pQZE022oa5Jbs4CrzqmFmgMTB6HRF3VtTnCpQg.m3u8' },
  { title: 'BORN SHY FW26',                  cat: 'fashion',    thumb: 'https://image.mux.com/XTjGaTy02DMR6zDufzIPAr01OB3QEkuTDUwB4njx00lLzc/thumbnail.jpg?time=1',  video: 'https://stream.mux.com/XTjGaTy02DMR6zDufzIPAr01OB3QEkuTDUwB4njx00lLzc.m3u8' },
  { title: 'SHELLY OHAD FW22',               cat: 'fashion',    thumb: 'https://image.mux.com/V8FuIVhaDpayTSZjKQ01q02vxFWf16n9JiB02E2ebkIlg00/thumbnail.jpg',  video: 'https://stream.mux.com/V8FuIVhaDpayTSZjKQ01q02vxFWf16n9JiB02E2ebkIlg00.m3u8' },
  { title: 'Adidas RUNWAY',                         cat: 'commercial', thumb: 'https://image.mux.com/DTJUg2EtHyAnqEKKPYytQquolXyZQe027C9rcDipOods/thumbnail.jpg',   video: 'https://stream.mux.com/DTJUg2EtHyAnqEKKPYytQquolXyZQe027C9rcDipOods.m3u8' },
  { title: 'TAMIR GREENBERG - Pass You By',  cat: 'music',      thumb: 'https://image.mux.com/9EHh00l5BaP1O8e8YP7St4WzLjb75T71J00SNjm7pMKPE/thumbnail.jpg?time=41',   video: 'https://stream.mux.com/9EHh00l5BaP1O8e8YP7St4WzLjb75T71J00SNjm7pMKPE.m3u8' },
  { title: 'ALEXANDER MALOFEEV - The Lark',  cat: 'music',      thumb: 'https://image.mux.com/PPG3tvT8hquH3rFcPrXY7z23lcJNm67yWqHuWEVJlOg/thumbnail.jpg',    video: 'https://stream.mux.com/PPG3tvT8hquH3rFcPrXY7z23lcJNm67yWqHuWEVJlOg.m3u8' },
  { title: 'MASH - Fashion Editorial II',    cat: 'fashion',    thumb: 'https://image.mux.com/pUdnGN7FuEbMrK9nRTchq7mAENYW3Hfm43X00PYIJIBc/thumbnail.jpg',     video: 'https://stream.mux.com/pUdnGN7FuEbMrK9nRTchq7mAENYW3Hfm43X00PYIJIBc.m3u8' },
  { title: 'AINKER SS25',                    cat: 'fashion',    thumb: 'https://image.mux.com/zeCaPzfn1OBsO6SkjnuUf8QDuMnTC02kFc02kXam3jV9E/thumbnail.jpg', video: 'https://stream.mux.com/zeCaPzfn1OBsO6SkjnuUf8QDuMnTC02kFc02kXam3jV9E.m3u8' },
  { title: 'Matériau éternel - Motty Perry', cat: 'films',    thumb: 'https://image.mux.com/iycea00j0202SuL81oUVe5nn01uVrgTwn1jr1rjlAXwMOdY/thumbnail.jpg', video: 'https://stream.mux.com/iycea00j0202SuL81oUVe5nn01uVrgTwn1jr1rjlAXwMOdY.m3u8' },
  { title: 'JHON LAUNDRY',                   cat: 'fashion',    thumb: 'https://image.mux.com/D4xdOobmlNEHa6gxSxWSiQOSADw3yKMADtzVmnZ2opg/thumbnail.jpg', video: 'https://stream.mux.com/D4xdOobmlNEHa6gxSxWSiQOSADw3yKMADtzVmnZ2opg.m3u8' },
  { title: 'STRONGFUL',                      cat: 'commercial', thumb: 'https://image.mux.com/MGS1V9pJkaR01Ki9LJ02qSyw8Nk3qa2WKRPPbzPQSQjbU/thumbnail.jpg', video: 'https://stream.mux.com/MGS1V9pJkaR01Ki9LJ02qSyw8Nk3qa2WKRPPbzPQSQjbU.m3u8' },
  { title: 'TATAN - DREAM NO.5',                     cat: 'music',      thumb: 'https://image.mux.com/18WdRm5hLbfomtalIbJwDwaxucoJrIriqtqHZuMdE2E/thumbnail.jpg', video: 'https://stream.mux.com/18WdRm5hLbfomtalIbJwDwaxucoJrIriqtqHZuMdE2E.m3u8' },
  { title: 'MASH - Fashion Editorial III',   cat: 'fashion',    thumb: 'https://image.mux.com/xumuVwL1m300pIai1zFWlHSd201FcWXC4cCKfHSfyKtdE/thumbnail.jpg',   video: 'https://stream.mux.com/xumuVwL1m300pIai1zFWlHSd201FcWXC4cCKfHSfyKtdE.m3u8' },
  { title: 'ULIKE - Commercial',             cat: 'commercial', thumb: 'https://image.mux.com/OtHvCKoRnQNYv00OrdpEtr7JECg9EckNhD8tfwgQmp500/thumbnail.jpg?time=0.5',  video: 'https://stream.mux.com/OtHvCKoRnQNYv00OrdpEtr7JECg9EckNhD8tfwgQmp500.m3u8' },
  { title: 'CORUJA BLU - JOJO (LIVE)',       cat: 'music',      thumb: 'https://image.mux.com/02h02CB22MZG2quotQiEdKFD9moawwn3jcYjMRI1hWDCI/thumbnail.jpg',                video: 'https://stream.mux.com/02h02CB22MZG2quotQiEdKFD9moawwn3jcYjMRI1hWDCI.m3u8' },
];

const FILTERS = [
  { id: 'all',        label: 'All works'   },
  { id: 'music',      label: 'Music'       },
  { id: 'fashion',    label: 'Fashion'     },
  { id: 'commercial', label: 'Commercial'  },
  { id: 'films',      label: 'Short films' },
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

  return createPortal(
    <div className={`fp-lb${closing ? ' fp-lb--closing' : ''}`} onClick={handleClose}>
      <div className={`fp-lb__inner${project.bts?.length ? ' fp-lb__inner--with-bts' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="fp-lb__close" onClick={handleClose}>✕</button>
        <div className="fp-lb__video-stage">
          {isHlsUrl(project.video) ? (
            <Suspense fallback={<div className="fp-lb__iframe" style={{ background: '#000' }} />}>
              <VideoPlayer src={project.video} poster={project.thumb} />
            </Suspense>
          ) : (
            <iframe
              src={getLightboxUrl(project.video)}
              className="fp-lb__iframe"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={project.title}
            />
          )}
        </div>
        {project.bts?.length ? (
          <section className="fp-lb__bts" aria-label={`${project.title} behind the scenes`}>
            <p className="fp-lb__bts-label">Behind the scenes</p>
            <div className="fp-lb__bts-grid">
              {project.bts.map((src, index) => (
                <img key={src} src={src} alt={`${project.title} behind the scenes ${index + 1}`} loading="lazy" />
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <style>{`
        .fp-lb {
          position: fixed; inset: 0;
          background: transparent; z-index: 9000;
          display: flex; align-items: center; justify-content: center;
          overflow-y: auto; padding: 5vh 5vw;
          animation: fpLbFade 0.25s ease;
        }
        @keyframes fpLbFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fpLbFadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.97); } }
        .fp-lb--closing { animation: fpLbFadeOut 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
        .fp-lb__inner {
          position: relative;
          width: min(90vw, 1200px); aspect-ratio: 16/9;
          border-radius: 8px; overflow: hidden;
          animation: fpLbScale 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .fp-lb__inner--with-bts { aspect-ratio: auto; align-self: flex-start; margin: auto 0; }
        .fp-lb__video-stage { width: 100%; aspect-ratio: 16/9; background: transparent; }
        @keyframes fpLbScale { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .fp-lb__iframe { width: 100%; height: 100%; border: none; }
        .fp-lb__bts { padding: 56px 0 0; background: transparent; }
        .fp-lb__bts-label { margin: 0 0 16px; padding: 0 2px; color: rgba(255,255,255,0.6); font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; }
        .fp-lb__bts-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .fp-lb__bts-grid img { display: block; width: 100%; aspect-ratio: 3 / 2; object-fit: cover; background: #111; }
        .fp-lb__close {
          position: absolute; top: 12px; right: 12px;
          background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15);
          color: white; width: 36px; height: 36px; border-radius: 50%;
          font-size: 14px; display: flex; align-items: center; justify-content: center;
          z-index: 10; cursor: none; transition: background 0.2s;
        }
        .fp-lb__close:hover { background: rgba(255,255,255,0.15); }
        @media (max-width: 640px) {
          .fp-lb { align-items: flex-start; padding: 16px; }
          .fp-lb__inner { width: 100%; }
          .fp-lb__bts { padding-top: 36px; }
          .fp-lb__bts-grid { grid-template-columns: 1fr; gap: 10px; }
        }
      `}</style>
    </div>,
    document.body
  );
}

export default function FullscreenPortfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedIndexes, setLoadedIndexes] = useState(() => new Set([0]));
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxProject, setLightboxProject] = useState(null);
  const [galleryProject, setGalleryProject] = useState(null);
  const [activeView, setActiveView] = useState('projects');
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 640
  );
  const videoRefs = useRef([]);
  const hlsRefs = useRef([]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const openProject = (p) => {
    if (p.photos?.length) setGalleryProject(p);
    else setLightboxProject(p);
    const slug = slugify(p.title);
    if (slug && window.location.pathname !== '/' + slug) {
      window.history.pushState({ projectSlug: slug }, '', '/' + slug);
    }
  };

  const closeProject = () => {
    setLightboxProject(null);
    setGalleryProject(null);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  };

  useEffect(() => {
    const matched = findProjectByPath(window.location.pathname, PROJECTS);
    if (matched) {
      if (matched.photos?.length) setGalleryProject(matched);
      else setLightboxProject(matched);
    }
    const onPop = () => {
      const m = findProjectByPath(window.location.pathname, PROJECTS);
      if (m) {
        if (m.photos?.length) { setGalleryProject(m); setLightboxProject(null); }
        else { setLightboxProject(m); setGalleryProject(null); }
      } else {
        setLightboxProject(null);
        setGalleryProject(null);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    setLoadedIndexes(prev => {
      if (prev.has(activeIndex)) return prev;
      const next = new Set(prev);
      next.add(activeIndex);
      return next;
    });
  }, [activeIndex]);

  useEffect(() => {
    if (isMobile) return;
    PROJECTS.forEach((p, i) => {
      const muxId = getMuxId(p.video);
      if (!muxId) return;
      const v = videoRefs.current[i];
      if (!v) return;
      const src = `https://stream.mux.com/${muxId}.m3u8`;
      if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = src;
      } else if (Hls.isSupported()) {
        const hls = new Hls({ startLevel: 0, maxBufferLength: 30 });
        hlsRefs.current[i] = hls;
        hls.loadSource(src);
        hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, () => { v.play().catch(() => {}); });
      }
    });
    return () => { hlsRefs.current.forEach(h => h?.destroy()); hlsRefs.current = []; };
  }, [isMobile]);

  const isVisible = (p) => activeCategory === 'all' || p.cat === activeCategory;

  const handleCategoryChange = (cat) => {
    setActiveView('projects');
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const vis = (p) => cat === 'all' || p.cat === cat;
    if (!vis(PROJECTS[activeIndex])) {
      const first = PROJECTS.findIndex(p => vis(p));
      if (first !== -1) setActiveIndex(first);
    }
  };

  if (isMobile) {
    return (
      <section className="fpm">
        <div className="fpm__header">
          <div className="fpm__brand">FERAL</div>
          <div className="fpm__eyebrow">Selected Work</div>
        </div>
        <div className="fpm__grid">
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className="fpm__card"
              onClick={() => openProject(p)}
            >
              <div className="fpm__thumb">
                <img
                  src={p.thumb}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="fpm__title">{p.title}</div>
            </div>
          ))}
        </div>
        {lightboxProject && (
          <Lightbox project={lightboxProject} onClose={closeProject} />
        )}
        {galleryProject && (
          <PhotoGallery title={galleryProject.title} photos={galleryProject.photos} onClose={closeProject} />
        )}
        <style>{`
          .fpm { background: #000; padding: 24px 14px 40px; }
          .fpm__header {
            padding: 12px 6px 24px;
            display: flex; justify-content: space-between; align-items: baseline;
          }
          .fpm__brand {
            font-size: 13px; font-weight: 700;
            letter-spacing: 0.25em; text-transform: uppercase; color: #fff;
          }
          .fpm__eyebrow {
            font-size: 10px; font-weight: 600;
            letter-spacing: 0.2em; text-transform: uppercase;
            color: rgba(255,255,255,0.45);
          }
          .fpm__grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px 10px;
          }
          .fpm__card { cursor: none; }
          .fpm__thumb {
            width: 100%; aspect-ratio: 16/10;
            overflow: hidden; border-radius: 4px; background: #111;
          }
          .fpm__thumb img {
            width: 100%; height: 100%;
            object-fit: cover; display: block;
          }
          .fpm__title {
            margin-top: 8px;
            font-size: 10px; font-weight: 500;
            letter-spacing: 0.08em; text-transform: uppercase;
            color: rgba(255,255,255,0.75); line-height: 1.35;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="fp">
      <div className="fp__bg">
        {PROJECTS.map((p, i) => (
          <div
            key={i}
            className={`fp__bg-layer${(activeView === 'about' ? 0 : activeIndex) === i ? ' active' : ''}`}
            style={loadedIndexes.has(i) ? { backgroundImage: `url(${p.thumb})` } : undefined}
          />
        ))}
        {PROJECTS.map((p, i) => getMuxId(p.video) ? (
          <video
            key={`v-${i}`}
            ref={el => { videoRefs.current[i] = el; if (el) el.muted = true; }}
            muted
            loop
            playsInline
            autoPlay
            className={`fp__bg-video${(activeView === 'about' ? 0 : activeIndex) === i ? ' fp__bg-video--active' : ''}`}
          />
        ) : null)}
      </div>
      <div className="fp__vignette" />
      <div className={`fp__about-bg${activeView === 'about' ? ' fp__about-bg--visible' : ''}`} />

      <header className="fp__header">
        <div className="fp__brand">FERAL</div>
      </header>

      <nav className="fp__filters">
        {FILTERS.map(f => (
          <div
            key={f.id}
            role="button"
            tabIndex={-1}
            className={`fp__filter-btn${activeView !== 'about' && activeCategory === f.id ? ' active' : ''}`}
            onClick={() => handleCategoryChange(f.id)}
          >
            {f.label}
          </div>
        ))}
        <div
          role="button"
          tabIndex={-1}
          className={`fp__filter-btn fp__filter-about${activeView === 'about' ? ' active' : ''}`}
          onClick={() => setActiveView(activeView === 'about' ? 'projects' : 'about')}
        >
          About
        </div>
      </nav>

      <div className="fp__content-wrap">
      <ul className={`fp__list${activeView === 'about' ? ' fp__list--hidden' : ''}`}>
        {PROJECTS.map((p, i) => (
          <li key={i} className={`fp__item${i === activeIndex ? ' active' : ''}${isVisible(p) ? '' : ' fp__item--hidden'}`}>
            <div className="fp__item-inner">
              <button
                onMouseEnter={() => isVisible(p) && setActiveIndex(i)}
                onClick={() => openProject(p)}
              >
                {p.title}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className={`fp__about${activeView === 'about' ? ' fp__about--visible' : ''}`}>
        <div className="fp__about-photos">
          <img src="https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/Screenshot%202026-04-20%20at%2021.28.11.png" alt="Eden Bachar" />
          <div className="fp__about-divider" />
          <img src="https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/Screenshot%202026-04-20%20at%2021.28.27.png" alt="Yuval Aloni" />
        </div>
        <div className="fp__about-body">
          <p className="fp__about-bio">Eden Bachar and Yuval Aloni operate as a two-person cinematography unit. Roles shift as the work demands — what stays constant is a shared visual language and an egoless process.</p>
          <p className="fp__about-bio">Working with them means one conversation that holds two perspectives. Close enough to move as one, different enough to keep things alive.</p>
          <p className="fp__about-bio">Based in Berlin, they work across music videos, fashion films, and narrative projects.</p>
          <div className="fp__about-links">
            <a href="https://www.instagram.com/feral______/" target="_blank" rel="noopener noreferrer">@feral______</a>
            <a href="https://www.instagram.com/edenbachar/" target="_blank" rel="noopener noreferrer">@edenbachar</a>
            <a href="https://www.instagram.com/yuvala96/" target="_blank" rel="noopener noreferrer">@yuvala96</a>
          </div>
        </div>
      </div>
      </div>

      {lightboxProject && (
        <Lightbox project={lightboxProject} onClose={closeProject} />
      )}
      {galleryProject && (
        <PhotoGallery title={galleryProject.title} photos={galleryProject.photos} onClose={closeProject} />
      )}

      <style>{`
        .fp {
          position: relative; min-height: 100vh;
        }
        .fp__bg { position: sticky; top: 0; height: 100vh; margin-bottom: -100vh; z-index: 0; pointer-events: none; }
        .fp__bg-layer {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0; transition: opacity 0.7s ease;
        }
        .fp__bg-layer.active { opacity: 1; }
        .fp__bg-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0; transition: opacity 0.7s ease;
          pointer-events: none; z-index: 1;
        }
        .fp__bg-video--active { opacity: 1; }
        .fp__vignette { display: none; }
        .fp__about-bg {
          position: sticky; top: 0; height: 100vh; margin-bottom: -100vh;
          z-index: 1; pointer-events: none;
          background: rgba(0,0,0,0.75);
          opacity: 0; transition: opacity 0.4s ease;
        }
        .fp__about-bg--visible { opacity: 1; }
        .fp__header {
          position: sticky; top: 0; z-index: 10;
          display: flex; justify-content: space-between; align-items: baseline;
          padding: 40px 6vw 0;
        }
        .fp__brand {
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase; color: #fff;
        }
        .fp__eyebrow {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .fp__content-wrap {
          position: relative;
          min-height: 100vh;
        }
        .fp__list {
          list-style: none; padding: 24px 0 300px; position: relative; z-index: 3;
          opacity: 1; transition: opacity 0.4s ease; pointer-events: auto;
        }
        .fp__item {
          display: grid;
          grid-template-rows: 1fr;
          transition: grid-template-rows 0.45s cubic-bezier(0.4,0,0.2,1);
        }
        .fp__item--hidden {
          grid-template-rows: 0fr;
          pointer-events: none;
        }
        .fp__item-inner {
          overflow: hidden;
          min-height: 0;
        }
        .fp__item button {
          background: none; border: none; outline: none;
          display: block; width: 100%;
          padding: 18px 6vw;
          font-family: inherit;
          font-size: clamp(14px, 2.4vw, 37px);
          font-weight: 400; letter-spacing: 0.03em;
          text-transform: uppercase; text-align: left;
          color: rgba(255,255,255,0.2);
          cursor: none; user-select: none; -webkit-user-select: none;
          transition: color 0.2s ease, padding-left 0.2s ease, opacity 0.35s ease;
          line-height: 1.1;
          opacity: 1;
        }
        .fp__item--hidden button {
          opacity: 0;
        }
        .fp__item button:hover,
        .fp__item.active button {
          color: #fff;
          padding-left: calc(6vw + 12px);
        }
        .fp__filters {
          position: fixed;
          top: 30vh;
          right: calc(12vw + 20px);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        .fp__filter-btn {
          background: none; border: none; outline: none;
          font-family: inherit;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          cursor: none; user-select: none; -webkit-user-select: none;
          padding: 0;
          transition: color 0.2s ease;
        }
        .fp__filter-btn:hover { color: rgba(255,255,255,0.7); }
        .fp__filter-btn.active { color: #fff; }
        .fp__filter-about { margin-top: 24px; }
        .fp__list--hidden { opacity: 0; pointer-events: none; }
        .fp__about {
          padding: 24px 6vw 300px;
          position: absolute; top: 0; left: 0; width: 100%; z-index: 3;
          max-width: 676px;
          opacity: 0; pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .fp__about--visible { opacity: 1; pointer-events: auto; }
        .fp__about-photos {
          display: grid; grid-template-columns: 1fr 30px 1fr;
          margin-top: 30px; margin-bottom: 36px;
        }
        .fp__about-photos img {
          width: 100%; aspect-ratio: 3/4; object-fit: cover;
          filter: grayscale(100%); border-radius: 8px;
        }
        .fp__about-divider {
          display: flex; align-items: stretch; justify-content: center;
        }
        .fp__about-divider::after {
          content: ''; display: block;
          width: 1px; height: 100%;
          background: rgba(255,255,255,0.2);
        }
        .fp__about-bio {
          font-size: 18px; line-height: 1.75;
          color: rgba(255,255,255,0.55);
          margin: 0 0 16px;
          font-weight: 300; letter-spacing: 0.02em;
        }
        .fp__about-links {
          display: flex; gap: 24px; margin-top: 28px; flex-wrap: wrap;
        }
        .fp__about-links a {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          text-decoration: none; transition: color 0.2s;
        }
        .fp__about-links a:hover { color: #fff; }
      `}</style>
    </section>
  );
}
