import { useEffect, useRef } from 'react';

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LINKS = [
  { label: 'Wiener Strasse 11, Berlin', href: null },
  { label: 'Follow us on Instagram', href: 'https://www.instagram.com/feral______/' },
  { label: '+49 1522 5362977', href: 'tel:+4915225362977' },
  { label: 'feralisus@gmail.com', href: 'mailto:feralisus@gmail.com' },
];

export default function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) sectionRef.current?.classList.add('in-view');
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="contact" ref={sectionRef}>
      <div className="contact__inner">
        <div className="contact__photo-wrap">
          <img
            src="https://framerusercontent.com/images/tFxk79p3WIkm8MHOgmJbKxeR24.jpg"
            alt="FERAL"
            className="contact__photo"
          />
        </div>
        <div className="contact__info">
          {LINKS.map((link, i) => (
            link.href ? (
              <a key={i} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="contact__link">
                <span>{link.label}</span>
                <ArrowIcon />
              </a>
            ) : (
              <div key={i} className="contact__link contact__link--no-link">
                <span>{link.label}</span>
                <ArrowIcon />
              </div>
            )
          ))}
        </div>
      </div>
      <style>{`
        .contact {
          padding: 80px 40px;
          max-width: 1480px;
          margin: 0 auto;
        }
        .contact__inner {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 100px;
          align-items: center;
        }
        .contact__photo-wrap {
          width: 340px;
          height: 388px;
          border-radius: 10px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .contact.in-view .contact__photo-wrap {
          opacity: 1;
          transform: translateY(0);
        }
        .contact__photo {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .contact__info {
          display: flex;
          flex-direction: column;
          gap: 0;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s;
        }
        .contact.in-view .contact__info {
          opacity: 1;
          transform: translateY(0);
        }
        .contact__link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 16px;
          font-weight: 500;
          color: var(--white);
          transition: color 0.2s ease;
        }
        .contact__link:first-child {
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .contact__link:hover {
          color: var(--blue);
        }
        .contact__link--no-link {
          cursor: default;
          color: var(--grey);
        }
        @media (max-width: 900px) {
          .contact__inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .contact__photo-wrap { width: 100%; height: 300px; }
          .contact { padding: 60px 24px; }
        }
      `}</style>
    </section>
  );
}
