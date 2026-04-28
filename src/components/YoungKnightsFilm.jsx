import CustomCursor from './CustomCursor';
import VideoPlayer from './VideoPlayer';

const PLAYBACK_ID = 'E0002I02xaSn6gCcE22jXpDK02lbkiX2VXOOoFfePtLwpFc';

export default function YoungKnightsFilm() {
  const src = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
  const poster = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?width=1920`;

  return (
    <div className="ykf-page">
      <CustomCursor />
      <div className="ykf-stage">
        <VideoPlayer src={src} poster={poster} />
      </div>
      <style>{`
        html, body, #root { background: #000; }
        .ykf-page {
          min-height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .ykf-stage {
          width: 100%;
          max-width: 1600px;
          aspect-ratio: 16 / 9;
        }
      `}</style>
    </div>
  );
}
