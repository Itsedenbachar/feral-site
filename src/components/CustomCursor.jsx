import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
      }
      animId = requestAnimationFrame(animate);
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

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    animate();

    const links = document.querySelectorAll('a, button, [data-cursor-hover]');
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });

    const observer = new MutationObserver(() => {
      const links = document.querySelectorAll('a, button, [data-cursor-hover]');
      links.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink);
        el.removeEventListener('mouseleave', onLeaveLink);
        el.addEventListener('mouseenter', onEnterLink);
        el.addEventListener('mouseleave', onLeaveLink);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(animId);
      observer.disconnect();
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
          transition: transform 0.05s ease;
          will-change: transform;
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
          transition: width 0.2s ease, height 0.2s ease, border-color 0.2s;
        }
        .cursor-dot.clicking { transform: scale(0.75) !important; }
        .cursor-ring.hovering {
          width: 48px; height: 48px;
          margin-left: -8px; margin-top: -8px;
        }
        .cursor-ring.clicking { transform: scale(0.75) !important; }
        @media (max-width: 768px) {
          .cursor-dot, .cursor-ring { display: none; }
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
