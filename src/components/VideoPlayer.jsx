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

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;

    if (v.canPlayType('application/vnd.apple.mpegurl')) {
      v.src = src;
    } else if (Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(v);
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

          <div className="vl-progress" onClick={handleSeek}>
            <div className="vl-progress-track" />
            <div className="vl-progress-buffered" style={{ width: `${buffered}%` }} />
            <div className="vl-progress-played" style={{ width: `${progress}%` }} />
          </div>

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
