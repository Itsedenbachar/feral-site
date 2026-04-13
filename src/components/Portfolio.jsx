import { useEffect, useRef } from 'react';
import VideoCard from './VideoCard';

const PROJECTS = [
  { title: 'ZVEZDA — Short Film', thumbnail: 'https://framerusercontent.com/images/95V69KjMRtXphHTwh2yMvgsvk.jpg', video: 'https://vimeo.com/1146976260', comingSoon: false },
  { title: 'AINKER SS26', thumbnail: 'https://framerusercontent.com/images/g95vL7DR4tEUb2ulOvR7vEq1tQ.png', video: 'https://iframe.mediadelivery.net/embed/457575/f3df6d6d-979d-48bc-90cd-ea18f1788ed2', comingSoon: false },
  { title: 'YOUNG NIGHTS — Short Film', thumbnail: 'https://framerusercontent.com/images/DcjIDzMxgbfSJUEshu7pYaR5SA.jpg', video: null, comingSoon: true },
  { title: 'ALEXANDER MALOFEEV — Prelude', thumbnail: 'https://framerusercontent.com/images/88q7DN3ZUSZyV5G26tYVQhjmGw.jpg', video: 'https://vimeo.com/1162708355', comingSoon: false },
  { title: 'LYZA — TOT', thumbnail: 'https://framerusercontent.com/images/a5SS9HRw4thfvT5wCVC5luDMw0.jpg', video: 'https://vimeo.com/1161517747', comingSoon: false },
  { title: 'BORN SHY FW26', thumbnail: 'https://framerusercontent.com/images/NepyIgemZlJWFxho5npKLnRzxME.jpg', video: 'https://vimeo.com/1171861807', comingSoon: false },
  { title: 'MASH — Fashion Editorial', thumbnail: 'https://framerusercontent.com/images/WrFnVsLZ9jPgA45Quwgt4ChNOaQ.png', video: 'https://iframe.mediadelivery.net/embed/457575/591ec67c-1097-4551-8bef-dcee25b42383', comingSoon: false },
  { title: 'ADIDAS', thumbnail: 'https://framerusercontent.com/images/EGtGCYqhOW6gqcf6weiEduNiUE.png', video: 'https://iframe.mediadelivery.net/embed/457575/37bc53e4-6350-4fd1-84a0-658005b71979', comingSoon: false },
  { title: 'TAMIR GREENBERG — Pass You By', thumbnail: 'https://framerusercontent.com/images/fL92iKaIAWNBYlX3nwbcILJqg.jpg', video: 'https://vimeo.com/1003711808', comingSoon: false },
  { title: 'ALEXANDER MALOFEEV — The Lark', thumbnail: 'https://framerusercontent.com/images/ccfstWtAQ6D6AXN0i7ujgGMI.jpg', video: 'https://vimeo.com/1162708659', comingSoon: false },
  { title: 'MASH — Fashion Editorial', thumbnail: 'https://framerusercontent.com/images/LK9MM6nfqEZCWbe8b79UxIA.jpg', video: 'https://vimeo.com/1135286242', comingSoon: false },
  { title: 'AINKER FW25', thumbnail: 'https://framerusercontent.com/images/ofeIZxDJ02VE4QScIS8aVBz2Jzw.png', video: 'https://iframe.mediadelivery.net/embed/457575/d872d0b6-6307-410d-9f05-843df9c28a36', comingSoon: false },
  { title: 'Matériau éternel - Motty Perry', thumbnail: 'https://framerusercontent.com/images/6BE2dw7aXAVGbqMc1wer8BIZTQs.jpg', video: 'https://vimeo.com/996677557', comingSoon: false },
  { title: 'JHON LAUNDRY', thumbnail: 'https://framerusercontent.com/images/8J3GyX73dcdX4YlV3MDA0g82lgs.jpg', video: 'https://vimeo.com/660125933', comingSoon: false },
  { title: 'STRONGFUL', thumbnail: 'https://framerusercontent.com/images/954SLi64wkZIGJfaxDmshPT2efQ.jpg', video: 'https://vimeo.com/765465571', comingSoon: false },
  { title: 'TATAN — MV', thumbnail: 'https://framerusercontent.com/images/Z2sjnWWKrXYJFalA5vXhNUGGby4.jpg', video: 'https://vimeo.com/726039555', comingSoon: false },
  { title: 'MASH — Fashion Editorial', thumbnail: 'https://framerusercontent.com/images/f65b5lJDNohM3u85D0m1EtVtg.jpg', video: 'https://vimeo.com/1084326507', comingSoon: false },
  { title: 'ULIKE — Commercial', thumbnail: 'https://framerusercontent.com/images/sPsGUEQcewzHV1feudGhRyITlE.jpg', video: 'https://vimeo.com/1108859882', comingSoon: false },
];

export default function Portfolio() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" className="portfolio" ref={sectionRef}>
      <div ref={gridRef} className="portfolio__grid">
        {PROJECTS.map((p, i) => (
          <VideoCard
            key={i}
            index={i}
            title={p.title}
            videoUrl={p.video}
            thumbnailUrl={p.thumbnail}
            comingSoon={p.comingSoon}
          />
        ))}
      </div>
      <style>{`
        .portfolio {
          padding: 0 40px 100px;
          max-width: 1480px;
          margin: 0 auto;
        }
        .portfolio__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .portfolio__grid.in-view .video-card {
          animation: cardReveal 0.6s ease both;
        }
        @media (max-width: 1024px) {
          .portfolio__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .portfolio { padding: 0 16px 60px; }
          .portfolio__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
