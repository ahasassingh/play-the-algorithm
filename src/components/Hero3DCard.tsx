import React, { useMemo } from 'react';
import { Cpu, Activity, Zap, Radio, Shield, TrendingUp, Sparkles } from 'lucide-react';

interface Hero3DCardProps {
  rotationY: number; // in degrees (0 to 360)
  tiltX?: number; // tilt in deg
  tiltY?: number; // tilt in deg
  scale?: number;
  isMobile?: boolean;
}

export const Hero3DCard: React.FC<Hero3DCardProps> = ({
  rotationY,
  tiltX = 0,
  tiltY = 0,
  scale = 1,
  isMobile = false,
}) => {
  // Determine front vs back visibility based on rotation angle modulo 360
  const normalizedY = ((rotationY % 360) + 360) % 360;
  const isBackVisible = normalizedY > 90 && normalizedY < 270;

  // Calculate dynamic surface lighting highlight based on rotation
  const rad = (normalizedY * Math.PI) / 180;
  const lightIntensity = Math.max(0.15, Math.abs(Math.cos(rad)));
  const edgeOpacity = Math.max(0.2, 1 - Math.abs(Math.cos(rad))); // Edge visible near 90 & 270

  // Thickness layers depth (4 layers stacked in Z-space)
  const depthPlanes = useMemo(() => [-4, -2, 0, 2, 4], []);

  return (
    <div
      className="relative flex items-center justify-center pointer-events-auto select-none"
      style={{
        perspective: 1200,
        width: isMobile ? 260 : 300,
        height: isMobile ? 400 : 450,
      }}
    >
      {/* Dynamic Ground Shadow */}
      <div
        className="absolute bottom-[-40px] w-[80%] h-[30px] rounded-[100%] bg-[#00F0FF]/20 blur-xl pointer-events-none transition-all"
        style={{
          transform: `scale(${scale * (0.8 + lightIntensity * 0.2)}) rotateX(80deg)`,
          opacity: 0.4 + lightIntensity * 0.4,
        }}
      />

      {/* 3D Card Container with preserve-3d */}
      <div
        className="w-full h-full relative transition-transform duration-75"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${scale}) rotateX(${tiltX}deg) rotateY(${rotationY + tiltY}deg)`,
        }}
      >
        {/* PHYSICAL CARD THICKNESS EDGES (stacked 3D planes for realistic depth) */}
        {depthPlanes.map((zOffset) => (
          <div
            key={zOffset}
            className="absolute inset-0 rounded-[24px] border border-[#00F0FF]/30 pointer-events-none"
            style={{
              transform: `translateZ(${zOffset}px)`,
              backgroundColor: zOffset === 0 ? 'transparent' : '#0a0b12',
              opacity: edgeOpacity * 0.8,
            }}
          />
        ))}

        {/* Outer Edge Bevel Highlight */}
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none z-30 transition-opacity"
          style={{
            transform: 'translateZ(5px)',
            boxShadow: `0 0 ${15 + lightIntensity * 20}px rgba(0, 240, 255, ${0.3 * lightIntensity}), inset 0 0 15px rgba(0, 240, 255, ${0.2 * lightIntensity})`,
            border: `1.5px solid rgba(0, 240, 255, ${0.4 + lightIntensity * 0.4})`,
          }}
        />

        {/* ===================================================
            FRONT FACE OF CARD
            =================================================== */}
        <div
          className="absolute inset-0 rounded-[24px] bg-[#0d0e15] border border-[#00F0FF]/40 p-5 flex flex-col justify-between overflow-hidden shadow-2xl hud-corner-box"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg) translateZ(4px)',
            background: 'linear-gradient(135deg, rgba(13,14,21,0.95) 0%, rgba(7,7,11,0.98) 100%)',
          }}
        >
          {/* Top Brand Header */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] font-black text-xs">
                AL
              </div>
              <span className="font-mono text-[10px] text-slate-400 tracking-wider">
                CORE_ENGINE // 3.6
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-[#00FF9D] bg-[#00FF9D]/10 px-2 py-0.5 rounded border border-[#00FF9D]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
              <span>ACTIVE</span>
            </div>
          </div>

          {/* Central Title & Tagline */}
          <div className="my-auto text-center z-10 py-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-[9px] font-mono mb-3 uppercase tracking-widest">
              <Sparkles size={10} className="text-[#FF0055]" />
              <span>SYSTEM ARCHITECTURE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight uppercase leading-tight">
              Algorithm <span className="text-[#00F0FF]">Lens</span>
            </h2>
            <p className="text-[11px] font-mono text-slate-300 mt-1 italic">
              "YOU WERE THE ALGORITHM"
            </p>

            {/* Abstract Recommendation Graph Graphic */}
            <div className="mt-4 p-3 bg-[#07070b]/90 rounded-xl border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-around text-slate-400 text-[10px] font-mono mb-2">
                <span className="text-[#00F0FF] font-bold">NODE_A</span>
                <span className="text-[#FF0055] font-bold">SIGNAL</span>
                <span className="text-[#FFE600] font-bold">FEED</span>
              </div>
              <div className="relative h-12 flex items-center justify-between px-3">
                <div className="w-7 h-7 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF] flex items-center justify-center text-[#00F0FF]">
                  <Cpu size={14} />
                </div>
                <div className="flex-1 h-[2px] bg-gradient-to-r from-[#00F0FF] via-[#FF0055] to-[#FFE600] mx-2 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
                </div>
                <div className="w-7 h-7 rounded-full bg-[#FFE600]/20 border border-[#FFE600] flex items-center justify-center text-[#FFE600]">
                  <Activity size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer Parameters */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400 z-10">
            <span>ENGAGEMENT: <strong className="text-[#00F0FF]">HIGH</strong></span>
            <span>MODEL: <strong className="text-[#FFE600]">NEURAL</strong></span>
          </div>

          {/* Surface Specular Reflection Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,${0.15 * lightIntensity}) 48%, transparent 52%)`,
            }}
          />
        </div>

        {/* ===================================================
            BACK FACE OF CARD
            =================================================== */}
        <div
          className="absolute inset-0 rounded-[24px] bg-[#0d0e15] border border-[#FF0055]/40 p-5 flex flex-col justify-between overflow-hidden shadow-2xl hud-corner-box"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(4px)',
            background: 'linear-gradient(135deg, rgba(13,14,21,0.95) 0%, rgba(7,7,11,0.98) 100%)',
          }}
        >
          {/* Back Header */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">
              // USER_PROFILE_TELEMETRY
            </span>
            <div className="w-2 h-2 rounded-full bg-[#FF0055] animate-ping" />
          </div>

          {/* Interest Signals */}
          <div className="my-auto space-y-3 z-10 py-1">
            <h3 className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1">
              <Radio size={12} className="text-[#00F0FF]" />
              <span>INTEREST SIGNALS</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                  <span>Football</span>
                  <span className="text-[#00F0FF] font-bold">78%</span>
                </div>
                <div className="w-full h-1.5 bg-[#07070b] rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-[#00F0FF] rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                  <span>Technology</span>
                  <span className="text-[#FF0055] font-bold">64%</span>
                </div>
                <div className="w-full h-1.5 bg-[#07070b] rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-[#FF0055] rounded-full" style={{ width: '64%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                  <span>Gaming</span>
                  <span className="text-[#FFE600] font-bold">52%</span>
                </div>
                <div className="w-full h-1.5 bg-[#07070b] rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-[#FFE600] rounded-full" style={{ width: '52%' }} />
                </div>
              </div>
            </div>

            {/* Metrics block */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-[#07070b] p-2 rounded-lg border border-white/10">
                <span className="text-[9px] font-mono text-slate-400 block">ENGAGEMENT</span>
                <span className="text-sm font-black font-mono text-[#00FF9D] flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  84%
                </span>
              </div>
              <div className="bg-[#07070b] p-2 rounded-lg border border-white/10">
                <span className="text-[9px] font-mono text-slate-400 block">DIVERSITY</span>
                <span className="text-sm font-black font-mono text-[#FF0055] flex items-center gap-0.5">
                  ↓ 47%
                </span>
              </div>
            </div>
          </div>

          {/* Back Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400 z-10">
            <span>FILTER BUBBLE: <strong className="text-[#FF0055]">FORMING</strong></span>
            <span>ID: <strong className="text-[#00F0FF]">#8829</strong></span>
          </div>

          {/* Surface Specular Reflection Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,${0.15 * lightIntensity}) 48%, transparent 52%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
