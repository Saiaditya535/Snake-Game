import React, { useRef, useState, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "0x0A: NEON_OVERDRIVE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: 2,
    title: "0x0B: CITY_NIGHTS.BIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "0x0C: SYNTHWAVE.SH",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  }
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-black jarring-border p-6 w-full max-w-sm flex flex-col items-center gap-6 relative transform transition-transform hover:scale-[1.02]">
      
      <h2 className="text-3xl font-bold text-[#0ff] glitch-text relative z-10 w-full text-left border-b-4 border-[#f0f] pb-2 uppercase tracking-widest" data-text="&gt; AUDIO_CTRL">
        &gt; AUDIO_CTRL
      </h2>
      
      <div className="w-full text-left bg-[#f0f] text-black p-4 screen-tear border-x-4 border-l-black border-r-black">
        <p className="font-bold flex justify-between uppercase border-b border-black/30 pb-1 mb-2 tracking-widest text-lg">
          <span>STAT:</span> 
          <span>{isPlaying ? 'ACTIVE' : 'HALTED'}</span>
        </p>
        <p className="font-bold text-2xl truncate">
          {TRACKS[currentTrackIndex].title}
        </p>
        <p className="text-black text-sm mt-1 uppercase font-bold tracking-widest">
          INDEX: 0{currentTrackIndex + 1} / 0{TRACKS.length}
        </p>
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrackIndex].url}
        onEnded={handleEnded}
        preload="auto"
      />

      <div className="flex items-center justify-between w-full gap-4 mt-2">
        <button 
          onClick={prevTrack}
          className="flex-1 bg-transparent border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black font-bold text-xl py-2 px-4 transition-colors uppercase tracking-widest"
        >
          [PREV]
        </button>
        
        <button 
          onClick={togglePlay}
          className="flex-1 bg-[#f0f] text-black border-2 border-[#f0f] hover:bg-transparent hover:text-[#f0f] font-bold text-xl py-2 px-4 transition-colors uppercase tracking-widest shadow-[0_0_15px_#f0f]"
        >
          {isPlaying ? '[PAUSE]' : '[PLAY]'}
        </button>

        <button 
          onClick={nextTrack}
          className="flex-1 bg-transparent border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black font-bold text-xl py-2 px-4 transition-colors uppercase tracking-widest"
        >
          [NEXT]
        </button>
      </div>

      <div className="flex items-center gap-4 w-full mt-2 border-t-4 border-[#333] pt-6">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className="text-[#f0f] border-2 border-[#f0f] px-3 py-1 uppercase text-lg font-bold tracking-widest hover:bg-[#f0f] hover:text-black transition-colors"
        >
          {isMuted || volume === 0 ? 'MUTED' : 'VOL'}
        </button>
        <div className="flex-1 relative h-6 bg-[#111] border-2 border-[#0ff] overflow-hidden">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(parseFloat(e.target.value) === 0);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="h-full bg-[#0ff] transition-all" 
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            ></div>
            {/* Volume hash marks behind the bar */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-1 opacity-30 mix-blend-difference">
               {[...Array(10)].map((_, i) => (
                 <div key={i} className="h-full w-[2px] bg-black"></div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
}
