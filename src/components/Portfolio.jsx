import { useEffect, useRef } from 'react';
import VideoCard from './VideoCard';

const PROJECTS = [
  { title: 'SHOWREEL', thumbnail: 'https://image.mux.com/dwYuh02o02BOdqg3ABHkl9cH2E5IoIPd00U01GY01Vq0201qRk/thumbnail.jpg', video: 'https://stream.mux.com/dwYuh02o02BOdqg3ABHkl9cH2E5IoIPd00U01GY01Vq0201qRk.m3u8', comingSoon: false },
  { title: 'ZVEZDA — Short Film', thumbnail: 'https://image.mux.com/9GI01WGLJgu02hz8MzCqVjhPN0035wvtSjlmASpyzMnsuQ/thumbnail.jpg?time=73', video: 'https://stream.mux.com/9GI01WGLJgu02hz8MzCqVjhPN0035wvtSjlmASpyzMnsuQ.m3u8', comingSoon: false },
  { title: 'AINKER SS26', thumbnail: 'https://image.mux.com/FvFuLIldOQQTvBOzILCqRmDzzysAO65ehVNwyCIPJUQ/thumbnail.jpg', video: 'https://stream.mux.com/FvFuLIldOQQTvBOzILCqRmDzzysAO65ehVNwyCIPJUQ.m3u8', comingSoon: false },
  { title: 'YOUNG NIGHTS — Short Film', thumbnail: 'https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131341_1.1.1.jpg', video: null, comingSoon: false, photos: ['https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131341_1.1.1.jpg','https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131341_1.1.2.jpg','https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131341_1.1.3.jpg','https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131341_1.1.4.jpg','https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131341_1.1.5.jpg','https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131341_1.1.6.jpg','https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131341_1.1.7.jpg','https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131341_1.1.8.jpg','https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131341_1.1.9.jpg','https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131718_1.1.7.jpg','https://pub-3eb95e23168a47b5b5959d5248287c88.r2.dev/feral_youngnights_photos/Still%202025-05-27%20131718_1.1.9.jpg'] },
  { title: 'ALEXANDER MALOFEEV — Prelude', thumbnail: 'https://image.mux.com/W1oiTDuCS58FBqqIinq23SQw39zKuhJpjN6qM101LILE/thumbnail.jpg?time=4', video: 'https://stream.mux.com/W1oiTDuCS58FBqqIinq23SQw39zKuhJpjN6qM101LILE.m3u8', comingSoon: false },
  { title: 'LYZA — TOT', thumbnail: 'https://image.mux.com/028Orv7pQZE022oa5Jbs4CrzqmFmgMTB6HRF3VtTnCpQg/thumbnail.jpg?time=16', video: 'https://stream.mux.com/028Orv7pQZE022oa5Jbs4CrzqmFmgMTB6HRF3VtTnCpQg.m3u8', comingSoon: false },
  { title: 'BORN SHY FW26', thumbnail: 'https://image.mux.com/XTjGaTy02DMR6zDufzIPAr01OB3QEkuTDUwB4njx00lLzc/thumbnail.jpg?time=1', video: 'https://stream.mux.com/XTjGaTy02DMR6zDufzIPAr01OB3QEkuTDUwB4njx00lLzc.m3u8', comingSoon: false },
  { title: 'SHELLY OHAD FW22', thumbnail: 'https://image.mux.com/V8FuIVhaDpayTSZjKQ01q02vxFWf16n9JiB02E2ebkIlg00/thumbnail.jpg', video: 'https://stream.mux.com/V8FuIVhaDpayTSZjKQ01q02vxFWf16n9JiB02E2ebkIlg00.m3u8', comingSoon: false },
  { title: 'ADIDAS', thumbnail: 'https://image.mux.com/DTJUg2EtHyAnqEKKPYytQquolXyZQe027C9rcDipOods/thumbnail.jpg', video: 'https://stream.mux.com/DTJUg2EtHyAnqEKKPYytQquolXyZQe027C9rcDipOods.m3u8', comingSoon: false },
  { title: 'TAMIR GREENBERG — Pass You By', thumbnail: 'https://image.mux.com/9EHh00l5BaP1O8e8YP7St4WzLjb75T71J00SNjm7pMKPE/thumbnail.jpg?time=41', video: 'https://stream.mux.com/9EHh00l5BaP1O8e8YP7St4WzLjb75T71J00SNjm7pMKPE.m3u8', comingSoon: false },
  { title: 'ALEXANDER MALOFEEV — The Lark', thumbnail: 'https://image.mux.com/PPG3tvT8hquH3rFcPrXY7z23lcJNm67yWqHuWEVJlOg/thumbnail.jpg', video: 'https://stream.mux.com/PPG3tvT8hquH3rFcPrXY7z23lcJNm67yWqHuWEVJlOg.m3u8', comingSoon: false },
  { title: 'MASH — Fashion Editorial', thumbnail: 'https://framerusercontent.com/images/LK9MM6nfqEZCWbe8b79UxIA.jpg', video: 'https://vimeo.com/1135286242', comingSoon: false },
  { title: 'AINKER SS25', thumbnail: 'https://image.mux.com/zeCaPzfn1OBsO6SkjnuUf8QDuMnTC02kFc02kXam3jV9E/thumbnail.jpg', video: 'https://stream.mux.com/zeCaPzfn1OBsO6SkjnuUf8QDuMnTC02kFc02kXam3jV9E.m3u8', comingSoon: false },
  { title: 'Matériau éternel - Motty Perry', thumbnail: 'https://image.mux.com/iycea00j0202SuL81oUVe5nn01uVrgTwn1jr1rjlAXwMOdY/thumbnail.jpg', video: 'https://stream.mux.com/iycea00j0202SuL81oUVe5nn01uVrgTwn1jr1rjlAXwMOdY.m3u8', comingSoon: false },
  { title: 'JHON LAUNDRY', thumbnail: 'https://image.mux.com/D4xdOobmlNEHa6gxSxWSiQOSADw3yKMADtzVmnZ2opg/thumbnail.jpg', video: 'https://stream.mux.com/D4xdOobmlNEHa6gxSxWSiQOSADw3yKMADtzVmnZ2opg.m3u8', comingSoon: false },
  { title: 'STRONGFUL', thumbnail: 'https://image.mux.com/MGS1V9pJkaR01Ki9LJ02qSyw8Nk3qa2WKRPPbzPQSQjbU/thumbnail.jpg', video: 'https://stream.mux.com/MGS1V9pJkaR01Ki9LJ02qSyw8Nk3qa2WKRPPbzPQSQjbU.m3u8', comingSoon: false },
  { title: 'TATAN — MV', thumbnail: 'https://image.mux.com/18WdRm5hLbfomtalIbJwDwaxucoJrIriqtqHZuMdE2E/thumbnail.jpg', video: 'https://stream.mux.com/18WdRm5hLbfomtalIbJwDwaxucoJrIriqtqHZuMdE2E.m3u8', comingSoon: false },
  { title: 'MASH — Fashion Editorial', thumbnail: 'https://image.mux.com/xumuVwL1m300pIai1zFWlHSd201FcWXC4cCKfHSfyKtdE/thumbnail.jpg', video: 'https://stream.mux.com/xumuVwL1m300pIai1zFWlHSd201FcWXC4cCKfHSfyKtdE.m3u8', comingSoon: false },
  { title: 'ULIKE — Commercial', thumbnail: 'https://image.mux.com/OtHvCKoRnQNYv00OrdpEtr7JECg9EckNhD8tfwgQmp500/thumbnail.jpg?time=0.5', video: 'https://stream.mux.com/OtHvCKoRnQNYv00OrdpEtr7JECg9EckNhD8tfwgQmp500.m3u8', comingSoon: false },
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
            photos={p.photos}
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
