import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    let mouseX = 0, mouseY = 0;
    let lastMoveTime = Date.now();
    let currentOpacity = 1;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTime = Date.now();
      if (dotRef.current) {
        dotRef.current.style.opacity = '1';
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = '1';
        ringRef.current.style.transform = `translate(${mouseX - 16}px, ${mouseY - 16}px)`;
        const modalOpen = document.body.classList.contains('modal-open');
        const stale = modalOpen && (Date.now() - lastMoveTime > 150);
        const targetOpacity = stale ? 0 : 1;
        if (targetOpacity !== currentOpacity) {
          ringRef.current.style.opacity = String(targetOpacity);
          if (dotRef.current) dotRef.current.style.opacity = String(targetOpacity);
          currentOpacity = targetOpacity;
        }
      }
    };

    const onDown = () => {
      dotRef.current?.classList.add('clicking');
      ringRef.current?.classList.add('clicking');
    };
    const onUp = () => {
      dotRef.current?.classList.remove('clicking');
      ringRef.current?.classList.remove('clicking');
    };

    const onEnterLink = () => ringRef.current?.classList.add('hovering');
    const onLeaveLink = () => ringRef.current?.classList.remove('hovering');

    const onOver = (e) => {
      if (e.target.closest && e.target.closest('a, button, [data-cursor-hover]')) {
        onEnterLink();
      }
    };
    const onOut = (e) => {
      const from = e.target.closest && e.target.closest('a, button, [data-cursor-hover]');
      if (!from) return;
      const to = e.relatedTarget && e.relatedTarget.closest
        ? e.relatedTarget.closest('a, button, [data-cursor-hover]')
        : null;
      if (to !== from) onLeaveLink();
    };

    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const CURSOR_TARGETS = '.fp__filter-btn, .fp__item button, .fp__item div[role="button"]';
    const onContextMenu = (e) => {
      if (e.target.closest && e.target.closest(CURSOR_TARGETS)) e.preventDefault();
    };
    const onSelectStart = (e) => {
      if (e.target.closest && e.target.closest(CURSOR_TARGETS)) e.preventDefault();
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('selectstart', onSelectStart);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('selectstart', onSelectStart);
    };
  }, []);

  return (
    <>
      <style>{`
        .cursor-dot {
          position: fixed;
          top: 0; left: 0;
          width: 6px; height: 6px;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          mix-blend-mode: difference;
          will-change: transform;
          opacity: 0;
        }
        .cursor-ring {
          position: fixed;
          top: 0; left: 0;
          width: 32px; height: 32px;
          border: 1px solid white;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          mix-blend-mode: difference;
          will-change: transform;
          transition: width 0.2s ease, height 0.2s ease;
          opacity: 0;
        }
        .cursor-dot.clicking { scale: 0.75; }
        .cursor-ring.hovering {
          width: 48px; height: 48px;
          margin-left: -8px; margin-top: -8px;
        }
        .cursor-ring.clicking { scale: 0.75; }
        @media (max-width: 768px) {
          .cursor-dot, .cursor-ring { display: none; }
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
