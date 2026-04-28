import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden font-mono text-[#e0e0e0] relative">
      
      {/* Glitch & Noise Overlays */}
      <div className="fixed inset-0 scanlines mix-blend-overlay"></div>
      <div className="fixed inset-0 noise-overlay"></div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #f0f 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.1,
          transform: 'rotateX(50deg) scale(1.5)',
          transformOrigin: 'top',
        }}
      ></div>

      <header className="z-10 mb-8 text-center mt-[-40px] screen-tear">
        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-widest text-[#fff] glitch-text drop-shadow-[0_0_15px_#0ff]" data-text="SYS.OVERRIDE">
          SYS.OVERRIDE
        </h1>
        <p className="mt-4 text-[#0ff] text-2xl tracking-widest uppercase bg-[#f0f] text-black inline-block px-6 py-2 font-bold shadow-[4px_4px_0_#0ff]">
          [ NEURAL LINK ESTABLISHED ]
        </p>
      </header>

      <main className="z-10 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-12 xl:gap-20 w-full max-w-7xl relative mt-8">
        
        {/* Left Side - Music Player */}
        <div className="order-2 xl:order-1 flex-1 flex justify-center xl:justify-end xl:pt-12 w-full xl:w-auto">
          <MusicPlayer />
        </div>

        {/* Center - Game */}
        <div className="order-1 xl:order-2 flex-shrink-0 relative">
          <SnakeGame />
        </div>

        {/* Right Side - Logs */}
        <div className="order-3 hidden xl:block flex-1 pt-12">
           <div className="bg-black jarring-border-alt p-6 w-full max-w-sm text-2xl relative overflow-hidden group">
              <h3 className="text-[#f0f] font-bold mb-6 border-b-4 border-[#0ff] pb-2 uppercase tracking-widest">
                &gt; PROCESS_DUMP
              </h3>
              <ul className="space-y-6 text-[#0ff] font-bold">
                <li className="flex justify-between border-b-2 border-[#333] pb-2">
                  <span>CORE_TEMP:</span> <span className="text-[#f0f] animate-pulse">CRITICAL</span>
                </li>
                <li className="flex justify-between border-b-2 border-[#333] pb-2">
                  <span>MEM_LEAK:</span> <span>DETECTED</span>
                </li>
                <li className="flex justify-between border-b-2 border-[#333] pb-2">
                  <span>NET_PORT:</span> <span className="text-[#f0f]">BREACHED</span>
                </li>
                <li className="flex justify-between border-b-2 border-[#333] pb-2">
                  <span>PROXY_STAT:</span> <span>BYPASSED</span>
                </li>
              </ul>
              <div className="mt-10 text-white uppercase text-lg leading-tight bg-[#f0f] text-black p-4 font-bold screen-tear border-2 border-[#0ff]">
                WARNING: DESTRUCTION SEQUENCE INITIATED. MAINTAIN FEED TO PREVENT SYSTEM HALT.
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}
