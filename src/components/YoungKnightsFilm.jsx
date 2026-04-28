import VideoPlayer from './VideoPlayer';

const PLAYBACK_ID = 'E0002I02xaSn6gCcE22jXpDK02lbkiX2VXOOoFfePtLwpFc';

export default function YoungKnightsFilm() {
  const src = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
  const poster = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?width=1920`;

  return (
    <div className="ykf-page">
      <div className="ykf-stage">
        <VideoPlayer src={src} poster={poster} />
      </div>
      <style>{`
        html, body, #root { background: #000; }
        html, body, #root, .ykf-page, .ykf-page * { cursor: auto !important; }
        .ykf-page .vl-progress,
        .ykf-page .vl-progress *,
        .ykf-page .vl-ctrl-btn,
        .ykf-page .vl-play-label,
        .ykf-page button,
        .ykf-page a { cursor: pointer !important; }
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
