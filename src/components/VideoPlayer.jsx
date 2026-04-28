import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import './VideoPlayer.css';

// Generic HLS player. Pass a full .m3u8 URL in `src` and a poster URL.
// Works with Mux, Bunny.net, or any other HLS source.
export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const hideTimer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [scrub, setScrub] = useState({ visible: false, x: 0, time: 0 });
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [showQuality, setShowQuality] = useState(false);

  const muxId = src ? (src.match(/stream\.mux\.com\/([^.]+)\.m3u8/) || [])[1] : null;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;

    if (Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setLevels(data.levels.map((l, i) => ({ index: i, height: l.height })));
        setCurrentLevel(-1);
      });
    } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
      v.src = src;
    }

    return () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    };
  }, [src]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  useEffect(() => {
    function handleKey(e) {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [playing]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrentTime(v.currentTime);
    setDuration(v.duration);
    setProgress((v.currentTime / v.duration) * 100);
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const handleProgressMouseMove = (e) => {
    const v = videoRef.current;
    if (!v || !v.duration || !muxId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setScrub({ visible: true, x: e.clientX - rect.left, time: Math.floor(ratio * v.duration) });
  };

  const handleProgressMouseLeave = () => setScrub(s => ({ ...s, visible: false }));

  const selectLevel = (index) => {
    if (hlsRef.current) {
      hlsRef.current.nextLevel = index;
      hlsRef.current.loadLevel = index;
    }
    setCurrentLevel(index);
    setShowQuality(false);
  };

  const toggleFullscreen = () => {
    const el = videoRef.current?.closest('.vl-player-wrap');
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  const revealControls = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => { if (playing) setShowControls(false); }, 2500);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '00:00';
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  return (
    <div
      className="vl-player-wrap"
      onMouseMove={revealControls}
      onMouseEnter={revealControls}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        muted={muted}
        className="vl-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <div className={`vl-controls ${showControls || !playing ? 'vl-controls-visible' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="vl-controls-row">
          <span className="vl-play-label" onClick={togglePlay}>
            <span className={`vl-label-text ${playing ? 'vl-label-hidden' : ''}`}>Play</span>
            <span className={`vl-label-text vl-label-abs ${playing ? '' : 'vl-label-hidden'}`}>Pause</span>
          </span>

          <button className="vl-ctrl-btn" onClick={togglePlay}>
            {playing ? (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="#fff">
                <rect x="0" y="0" width="3" height="12" />
                <rect x="7" y="0" width="3" height="12" />
              </svg>
            ) : (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="#fff">
                <polygon points="0,0 10,6 0,12" />
              </svg>
            )}
          </button>

          <span className="vl-timecode">{fmt(currentTime)} / {fmt(duration)}</span>

          <div
            className="vl-progress"
            onClick={handleSeek}
            onMouseMove={handleProgressMouseMove}
            onMouseLeave={handleProgressMouseLeave}
          >
            <div className="vl-progress-track" />
            <div className="vl-progress-buffered" style={{ width: `${buffered}%` }} />
            <div className="vl-progress-played" style={{ width: `${progress}%` }} />
            {muxId && scrub.visible && (
              <div className="vl-scrub-preview" style={{ left: scrub.x }}>
                <img
                  src={`https://image.mux.com/${muxId}/thumbnail.jpg?time=${scrub.time}&width=160`}
                  alt=""
                />
                <span className="vl-scrub-time">{fmt(scrub.time)}</span>
              </div>
            )}
          </div>

          {muxId && (
            <div className="vl-quality-wrap" onClick={e => e.stopPropagation()}>
              {showQuality && (
                <div className="vl-quality-menu">
                  <button className={currentLevel === -1 ? 'active' : ''} onClick={() => selectLevel(-1)}>Auto</button>
                  {[...levels].reverse().map(l => (
                    <button key={l.index} className={currentLevel === l.index ? 'active' : ''} onClick={() => selectLevel(l.index)}>
                      {l.height}p
                    </button>
                  ))}
                </div>
              )}
              <button className="vl-ctrl-btn" onClick={() => setShowQuality(v => !v)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
          )}

          <button className="vl-ctrl-btn vl-fullscreen-btn" onClick={toggleFullscreen}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="7" y="7" width="10" height="10" rx="1" />
              <path d="M2 8V2h6" />
              <path d="M22 8V2h-6" />
              <path d="M2 16v6h6" />
              <path d="M22 16v6h-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
