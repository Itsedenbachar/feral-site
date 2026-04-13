import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const BTS_IMAGES = [
  'https://framerusercontent.com/images/tFxk79p3WIkm8MHOgmJbKxeR24.jpg',
  'https://framerusercontent.com/images/wHMk5TqL5smgOMi9bgGX1caA944.jpg',
  'https://framerusercontent.com/images/88q7DN3ZUSZyV5G26tYVQhjmGw.jpg',
  'https://framerusercontent.com/images/NepyIgemZlJWFxho5npKLnRzxME.jpg',
  'https://framerusercontent.com/images/fL92iKaIAWNBYlX3nwbcILJqg.jpg',
  'https://framerusercontent.com/images/LK9MM6nfqEZCWbe8b79UxIA.jpg',
  'https://framerusercontent.com/images/6BE2dw7aXAVGbqMc1wer8BIZTQs.jpg',
  'https://framerusercontent.com/images/8J3GyX73dcdX4YlV3MDA0g82lgs.jpg',
];

function ContactModal({ onClose }) {
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
    <div className="contact-modal" onClick={onClose}>
      <div className="contact-modal__card" onClick={e => e.stopPropagation()}>
        <button className="contact-modal__close" onClick={onClose}>✕</button>
        <h3 className="contact-modal__title">Get In Touch</h3>
        <p className="contact-modal__sub">Two filmmakers, one fluid workflow.</p>
        <div className="contact-modal__options">
          <a
            href="https://www.instagram.com/feral______/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-modal__option"
          >
            <div className="contact-modal__option-icon">📸</div>
            <div>
              <div className="contact-modal__option-label">Instagram DM</div>
              <div className="contact-modal__option-handle">@feral______</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="mailto:feralisus@gmail.com"
            className="contact-modal__option"
          >
            <div className="contact-modal__option-icon">✉️</div>
            <div>
              <div className="contact-modal__option-label">Email</div>
              <div className="contact-modal__option-handle">feralisus@gmail.com</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
      <style>{`
        .contact-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 9000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .contact-modal__card {
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 48px;
          width: min(480px, 90vw);
          position: relative;
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .contact-modal__close {
          position: absolute;
          top: 16px; right: 16px;
          background: rgba(255,255,255,0.06);
          border: none;
          color: white;
          width: 32px; height: 32px;
          border-radius: 50%;
          font-size: 12px;
          cursor: none;
          transition: background 0.2s;
        }
        .contact-modal__close:hover { background: rgba(255,255,255,0.12); }
        .contact-modal__title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .contact-modal__sub {
          font-size: 14px;
          color: var(--grey);
          margin-bottom: 36px;
        }
        .contact-modal__options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .contact-modal__option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: white;
          transition: border-color 0.2s, background 0.2s;
        }
        .contact-modal__option:hover {
          border-color: rgba(0,153,255,0.4);
          background: rgba(0,153,255,0.04);
        }
        .contact-modal__option > svg { margin-left: auto; color: var(--grey); }
        .contact-modal__option-icon { font-size: 24px; }
        .contact-modal__option-label {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .contact-modal__option-handle {
          font-size: 13px;
          color: var(--grey);
        }
      `}</style>
    </div>,
    document.body
  );
}

export default function BottomCTA() {
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const intervalRef = useRef(null);

  const prev = () => setCurrent(c => (c - 1 + BTS_IMAGES.length) % BTS_IMAGES.length);
  const next = () => setCurrent(c => (c + 1) % BTS_IMAGES.length);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % BTS_IMAGES.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const visibleImages = () => {
    const indices = [];
    for (let i = -1; i <= 2; i++) {
      indices.push((current + i + BTS_IMAGES.length) % BTS_IMAGES.length);
    }
    return indices;
  };

  return (
    <section className="bottom-cta">
      {/* Retro grid bg */}
      <div className="bottom-cta__grid-bg" />

      {/* Contact ticker */}
      <div className="contact-ticker">
        <div className="contact-ticker__track">
          {['Contact', 'Contact', 'Contact', 'Contact', 'Contact', 'Contact'].map((t, i) => (
            <span key={i} className="contact-ticker__item">{t}</span>
          ))}
        </div>
      </div>

      <div className="bottom-cta__content">
        <button
          className="bottom-cta__cta"
          onClick={() => setModalOpen(true)}
        >
          Contact Now
        </button>

        {/* BTS Carousel */}
        <div className="carousel">
          <div className="carousel__track">
            {visibleImages().map((idx, pos) => (
              <div
                key={idx}
                className={`carousel__slide carousel__slide--${pos}`}
              >
                <img src={BTS_IMAGES[idx]} alt="BTS" />
              </div>
            ))}
          </div>
          <div className="carousel__controls">
            <button className="carousel__btn" onClick={prev}>‹</button>
            <div className="carousel__dots">
              {BTS_IMAGES.map((_, i) => (
                <button
                  key={i}
                  className={`carousel__dot ${i === current ? 'active' : ''}`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
            <button className="carousel__btn" onClick={next}>›</button>
          </div>
        </div>
      </div>

      {modalOpen && <ContactModal onClose={() => setModalOpen(false)} />}

      <style>{`
        .bottom-cta {
          position: relative;
          min-height: 100vh;
          background: #000;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .bottom-cta__grid-bg {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: perspective(600px) rotateX(40deg) scaleY(2);
          transform-origin: bottom center;
          animation: gridMove 8s linear infinite;
          pointer-events: none;
        }
        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 0 60px; }
        }
        .contact-ticker {
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
          background: rgba(0,0,0,0.5);
          position: relative;
          z-index: 2;
        }
        .contact-ticker__track {
          display: flex;
          animation: tickerScroll 10s linear infinite;
          width: max-content;
          padding: 14px 0;
        }
        .contact-ticker__item {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--white);
          padding: 0 60px;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .bottom-cta__content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 60px;
          padding: 80px 40px;
          position: relative;
          z-index: 2;
        }
        .bottom-cta__cta {
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 600;
          color: white;
          background: none;
          border: none;
          cursor: none;
          letter-spacing: -0.03em;
          font-family: 'Inter', sans-serif;
          position: relative;
          transition: color 0.3s ease;
        }
        .bottom-cta__cta::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 2px;
          background: var(--blue);
          transition: width 0.4s ease;
        }
        .bottom-cta__cta:hover { color: rgba(255,255,255,0.8); }
        .bottom-cta__cta:hover::after { width: 100%; }

        /* Carousel */
        .carousel { width: 100%; max-width: 600px; }
        .carousel__track {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          height: 200px;
          margin-bottom: 24px;
          perspective: 1000px;
        }
        .carousel__slide {
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.34, 1.1, 0.64, 1);
          flex-shrink: 0;
        }
        .carousel__slide img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .carousel__slide--0 {
          width: 100px; height: 130px;
          opacity: 0.4;
          transform: rotateY(15deg) translateX(10px);
        }
        .carousel__slide--1 {
          width: 200px; height: 180px;
          opacity: 0.7;
          transform: rotateY(8deg) translateX(5px);
        }
        .carousel__slide--2 {
          width: 220px; height: 200px;
          opacity: 1;
          transform: rotateY(0deg);
          z-index: 2;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }
        .carousel__slide--3 {
          width: 120px; height: 150px;
          opacity: 0.5;
          transform: rotateY(-10deg) translateX(-5px);
        }
        .carousel__controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .carousel__btn {
          width: 40px; height: 40px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
          color: white;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: none;
          transition: background 0.2s;
        }
        .carousel__btn:hover { background: rgba(255,255,255,0.1); }
        .carousel__dots { display: flex; gap: 6px; }
        .carousel__dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          cursor: none;
          transition: background 0.2s, width 0.3s;
          padding: 0;
        }
        .carousel__dot.active {
          background: white;
          width: 20px;
          border-radius: 3px;
        }
        @media (max-width: 640px) {
          .carousel__track { height: 160px; }
          .carousel__slide--2 { width: 160px; height: 150px; }
          .carousel__slide--1 { width: 130px; height: 120px; }
          .carousel__slide--0, .carousel__slide--3 { display: none; }
        }
      `}</style>
    </section>
  );
}
