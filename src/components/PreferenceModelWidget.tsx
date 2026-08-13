import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { Interaction } from '../types';

interface NeuralBrainVisualizationProps {
  preferences: { [category: string]: number };
  history?: Interaction[];
}

interface CategoryMeta {
  id: string;
  name: string;
  icon: string;
}

const CATEGORY_MAP: { [key: string]: CategoryMeta } = {
  Gaming: { id: 'Gaming', name: 'Gaming', icon: '🎮' },
  Football: { id: 'Football', name: 'Football', icon: '⚽' },
  Technology: { id: 'Technology', name: 'Technology', icon: '💻' },
  Science: { id: 'Science', name: 'Science', icon: '🔬' },
  Cooking: { id: 'Cooking', name: 'Cooking', icon: '🍳' },
  Fashion: { id: 'Fashion', name: 'Fashion', icon: '👗' },
  Music: { id: 'Music', name: 'Music', icon: '🎵' },
  Travel: { id: 'Travel', name: 'Travel', icon: '✈️' },
  Environment: { id: 'Environment', name: 'Environment', icon: '🌱' },
  Finance: { id: 'Finance', name: 'Finance', icon: '💰' },
};

// 3D Spherical/Radial Coordinate Layout for 10 categories
const BASE_DIRECTIONS: { [key: string]: [number, number, number] } = {
  Gaming: [-0.7, 0.4, 0.4],
  Football: [0.0, 0.85, -0.2],
  Technology: [0.65, 0.45, 0.3],
  Science: [0.8, 0.0, -0.5],
  Cooking: [0.55, -0.6, 0.3],
  Fashion: [0.0, -0.85, -0.3],
  Music: [-0.55, -0.55, 0.4],
  Travel: [-0.8, 0.0, -0.4],
  Environment: [-0.6, 0.5, -0.5],
  Finance: [0.4, 0.65, 0.5],
};

// Secondary interconnect pairs for true network graph look
const SECONDARY_EDGES: [string, string][] = [
  ['Gaming', 'Technology'],
  ['Football', 'Travel'],
  ['Science', 'Technology'],
  ['Cooking', 'Environment'],
  ['Fashion', 'Music'],
  ['Environment', 'Science'],
  ['Finance', 'Technology'],
];

// Central "YOU" Neural Core Component
const CentralYouCore: React.FC = () => {
  const coreRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.x += delta * 0.2;
    }
    if (glowRef.current) {
      const t = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 2) * 0.06;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={coreRef} position={[0, 0, 0]}>
      {/* Outer Halo Sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.25} />
      </mesh>

      {/* Inner Glowing Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#00f2fe"
          emissiveIntensity={1.8}
          roughness={0.2}
          wireframe
        />
      </mesh>

      {/* Point Light source */}
      <pointLight color="#00f2fe" intensity={3} distance={5} />

      {/* Center Label 🧠 YOU */}
      <Html center position={[0, 0, 0]} distanceFactor={6} zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center justify-center pointer-events-none select-none">
          <span className="text-2xl drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">🧠</span>
          <span className="text-[10px] font-black font-mono text-cyan-300 tracking-wider bg-slate-950/80 px-2 py-0.5 rounded-full border border-cyan-400/60 shadow-lg">
            YOU
          </span>
        </div>
      </Html>
    </group>
  );
};

// Flowing signal particles along connections
const SignalParticles: React.FC<{ start: [number, number, number]; end: [number, number, number]; isActive: boolean }> = ({
  start,
  end,
  isActive,
}) => {
  const particleRef = useRef<THREE.Mesh>(null);
  const speed = isActive ? 2.2 : 0.8;

  useFrame((state) => {
    if (particleRef.current) {
      const t = (state.clock.getElapsedTime() * speed) % 1;
      particleRef.current.position.x = start[0] + (end[0] - start[0]) * t;
      particleRef.current.position.y = start[1] + (end[1] - start[1]) * t;
      particleRef.current.position.z = start[2] + (end[2] - start[2]) * t;
    }
  });

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#00f2fe" />
    </mesh>
  );
};

// Individual 3D Category Orb Node
const CategoryNode3D: React.FC<{
  cat: string;
  weight: number;
  activeCategory: string | null;
  hoveredNode: string | null;
  setHoveredNode: (cat: string | null) => void;
  changes: { [cat: string]: number };
}> = ({ cat, weight, activeCategory, hoveredNode, setHoveredNode, changes }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const meta = CATEGORY_MAP[cat] || { id: cat, name: cat, icon: '📌' };

  const isHighlight = activeCategory === cat || hoveredNode === cat;

  // 3D position calculation: Attraction brings high weight closer to YOU core [0,0,0]
  const baseDir = BASE_DIRECTIONS[cat] || [1, 0, 0];
  const maxDistance = 3.2;
  const attractionRange = 1.4;
  const distance = maxDistance - (weight / 100) * attractionRange;

  const position: [number, number, number] = useMemo(() => {
    const len = Math.sqrt(baseDir[0] ** 2 + baseDir[1] ** 2 + baseDir[2] ** 2);
    return [
      (baseDir[0] / len) * distance,
      (baseDir[1] / len) * distance,
      (baseDir[2] / len) * distance,
    ];
  }, [baseDir, distance]);

  // Node scale exponential mapping (0.5 to 1.6) for clear visual hierarchy
  const normWeight = weight / 100;
  const targetScale = 0.5 + Math.pow(normWeight, 1.5) * 1.1;
  const orbRadius = 0.28 * targetScale;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      // Gentle idle ambient floating drift
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5 + normWeight * 10) * 0.05;
    }
  });

  const hasChange = changes[cat] !== undefined && changes[cat] !== 0;

  return (
    <group position={position}>
      {/* Primary Neural Connection to YOU core [0,0,0] */}
      <Line
        points={[[0, 0, 0], [0, 0, 0].map((v, i) => -position[i]) as [number, number, number]]}
        color={isHighlight ? '#00f2fe' : weight >= 70 ? '#38bdf8' : weight >= 50 ? '#6366f1' : '#334155'}
        lineWidth={isHighlight ? 4.0 : 0.8 + normWeight * 3.2}
        transparent
        opacity={isHighlight ? 1 : 0.15 + normWeight * 0.65}
      />

      {/* Signal flow particle */}
      <SignalParticles start={[0, 0, 0]} end={[0, 0, 0].map((v, i) => -position[i]) as [number, number, number]} isActive={isHighlight} />

      {/* Glowing 3D Category Orb Mesh */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode(cat);
        }}
        onPointerOut={() => setHoveredNode(null)}
      >
        <sphereGeometry args={[orbRadius, 24, 24]} />
        <meshStandardMaterial
          color={isHighlight ? '#00f2fe' : weight >= 70 ? '#0284c7' : weight >= 50 ? '#4f46e5' : '#1e293b'}
          emissive={isHighlight ? '#00f2fe' : weight >= 70 ? '#38bdf8' : '#4338ca'}
          emissiveIntensity={isHighlight ? 2.2 : weight >= 70 ? 1.4 : 0.6}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Aura ring on highlight */}
      {isHighlight && (
        <mesh>
          <sphereGeometry args={[orbRadius * 1.4, 16, 16]} />
          <meshBasicMaterial color="#00f2fe" transparent opacity={0.25} wireframe />
        </mesh>
      )}

      {/* Floating 3D HTML Label */}
      <Html center position={[0, orbRadius + 0.35, 0]} distanceFactor={7} zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center justify-center pointer-events-none select-none">
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-md border shadow-lg transition-all ${isHighlight
              ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 scale-110 shadow-cyan-500/40'
              : 'bg-slate-950/80 border-slate-800 text-slate-300'
              }`}
          >
            <span className="text-xs">{meta.icon}</span>
            <span className="text-[10px] font-bold font-mono">{meta.name}</span>
            <span className="text-[10px] font-extrabold font-mono text-cyan-400 ml-0.5">{weight}%</span>
          </div>

          {/* Temporary Trend Badge (e.g. ↑ +18) */}
          {hasChange && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: -8 }}
              className={`mt-1 px-2 py-0.5 rounded-full text-[9px] font-black font-mono shadow-md ${changes[cat] > 0
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                : 'bg-rose-950 text-rose-300 border border-rose-500/60'
                }`}
            >
              {changes[cat] > 0 ? `↑ +${changes[cat]}` : `↓ ${changes[cat]}`}
            </motion.div>
          )}
        </div>
      </Html>
    </group>
  );
};

// Secondary Interconnect Lines between categories
const SecondaryConnections: React.FC<{ preferences: { [cat: string]: number } }> = ({ preferences }) => {
  return (
    <group>
      {SECONDARY_EDGES.map(([catA, catB], idx) => {
        const baseA = BASE_DIRECTIONS[catA];
        const baseB = BASE_DIRECTIONS[catB];
        if (!baseA || !baseB) return null;

        const wA = preferences[catA] ?? 50;
        const wB = preferences[catB] ?? 50;

        const distA = 3.2 - (wA / 100) * 1.4;
        const distB = 3.2 - (wB / 100) * 1.4;

        const lenA = Math.sqrt(baseA[0] ** 2 + baseA[1] ** 2 + baseA[2] ** 2);
        const lenB = Math.sqrt(baseB[0] ** 2 + baseB[1] ** 2 + baseB[2] ** 2);

        const posA: [number, number, number] = [(baseA[0] / lenA) * distA, (baseA[1] / lenA) * distA, (baseA[2] / lenA) * distA];
        const posB: [number, number, number] = [(baseB[0] / lenB) * distB, (baseB[1] / lenB) * distB, (baseB[2] / lenB) * distB];

        return (
          <Line
            key={`sec-${idx}`}
            points={[posA, posB]}
            color="#334155"
            lineWidth={0.8}
            transparent
            opacity={0.25}
          />
        );
      })}
    </group>
  );
};

// Subtle ambient background particle field
const BackgroundParticles: React.FC = () => {
  const count = 120;
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  });

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#38bdf8" transparent opacity={0.3} />
    </points>
  );
};

// Main 3D Canvas Scene Wrapper
const NeuralScene3D: React.FC<{
  preferences: { [cat: string]: number };
  activeCategory: string | null;
  hoveredNode: string | null;
  setHoveredNode: (cat: string | null) => void;
  changes: { [cat: string]: number };
}> = ({ preferences, activeCategory, hoveredNode, setHoveredNode, changes }) => {
  const categories = Object.keys(preferences);

  return (
    <Canvas
      camera={{ position: [0, 0, 9.2], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4f46e5" />

      {/* Orbit Controls with auto-rotate */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
      />

      {/* Background Particles */}
      <BackgroundParticles />

      {/* Central YOU Core */}
      <CentralYouCore />

      {/* Secondary Connections between Orbs */}
      <SecondaryConnections preferences={preferences} />

      {/* 3D Category Nodes */}
      {categories.map((cat) => (
        <CategoryNode3D
          key={cat}
          cat={cat}
          weight={preferences[cat] ?? 50}
          activeCategory={activeCategory}
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
          changes={changes}
        />
      ))}

      {/* Postprocessing Bloom */}
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
      </EffectComposer>
    </Canvas>
  );
};

export const PreferenceModelWidget: React.FC<NeuralBrainVisualizationProps> = ({
  preferences,
  history = [],
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [learningStatus, setLearningStatus] = useState<string>('LEARNING LIVE');
  const [changes, setChanges] = useState<{ [cat: string]: number }>({});
  const [hasWebGL, setHasWebGL] = useState(true);

  const prevPrefsRef = useRef<{ [cat: string]: number }>(preferences);

  // Check WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Track weight changes and animate status + pulse highlight
  useEffect(() => {
    const prev = prevPrefsRef.current;
    const newChanges: { [cat: string]: number } = {};
    let changedCat: string | null = null;

    Object.keys(preferences).forEach((cat) => {
      const oldVal = Math.round((prev[cat] ?? 0.5) * 100);
      const newVal = Math.round((preferences[cat] ?? 0.5) * 100);
      const diff = newVal - oldVal;
      if (diff !== 0) {
        newChanges[cat] = diff;
        changedCat = cat;
      }
    });

    if (changedCat) {
      const catName: string = changedCat;
      setActiveCategory(catName);
      setLearningStatus(`LEARNING FROM ${catName.toUpperCase()} SIGNAL`);
      setChanges(newChanges);

      setTimeout(() => {
        setActiveCategory(null);
        setLearningStatus('LEARNING LIVE');
      }, 2500);
    }

    prevPrefsRef.current = preferences;
  }, [preferences]);

  const [isPanelsExpanded, setIsPanelsExpanded] = useState(true);

  const recentEvents = history.slice(-4).reverse();
  const sortedTextList = Object.entries(preferences)
    .map(([cat, val]) => ({ cat, weight: Math.round(val * 100), meta: CATEGORY_MAP[cat] || { id: cat, name: cat, icon: '📌' } }))
    .sort((a, b) => b.weight - a.weight);

  return (
    <div className="glass-panel border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden select-none hud-corner-box font-mono">
      {/* Header Live Status Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#07070b] border border-[#00F0FF]/30 text-[#00F0FF]">
            <Brain className="animate-pulse" size={20} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider font-mono">
              [ 3D ALGORITHMIC PREFERENCE MATRIX ]
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">// Real-time Machine Learning Neural Vector Weights</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Collapse / Expand Side Panels Toggle */}
          <button
            onClick={() => setIsPanelsExpanded(!isPanelsExpanded)}
            className="px-2.5 py-1 rounded-xl bg-[#07070b] hover:bg-[#131520] border border-white/10 text-[10px] font-mono text-slate-300 transition-colors hidden sm:block"
          >
            {isPanelsExpanded ? '[ FOCUS 3D GRAPH ]' : '[ SHOW MATRIX LOG ]'}
          </button>

          {/* Live Learning Status Badge */}
          <div className="flex items-center gap-2 bg-[#07070b] px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-bold font-mono">
            <span className={`w-2 h-2 rounded-full ${activeCategory ? 'bg-[#FF0055] animate-ping' : 'bg-[#00FF9D] animate-pulse'}`} />
            <span className={activeCategory ? 'text-[#FF0055]' : 'text-[#00FF9D]'}>{learningStatus}</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid: 3D Canvas + Side Panels */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: 3D Three.js Interactive Neural Brain Canvas */}
        <div className={`${isPanelsExpanded ? 'md:col-span-8' : 'md:col-span-12'} flex flex-col items-center justify-center relative bg-slate-950 border border-slate-800/90 rounded-2xl p-2 shadow-inner h-[520px] overflow-hidden transition-all duration-300`}>
          {hasWebGL ? (
            <NeuralScene3D
              preferences={preferences}
              activeCategory={activeCategory}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              changes={changes}
            />
          ) : (
            <div className="text-center text-xs text-slate-400 p-4">WebGL disabled. 3D Neural Scene unavailable.</div>
          )}

          {/* Interactive Hover Tooltip Drawer */}
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 inset-x-4 bg-slate-900/95 border border-cyan-400/80 rounded-xl p-2.5 text-xs shadow-2xl backdrop-blur-md flex items-center justify-between z-30 pointer-events-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{CATEGORY_MAP[hoveredNode]?.icon}</span>
                <div>
                  <span className="font-bold text-white block">{hoveredNode}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Learned Weight: {Math.round((preferences[hoveredNode] ?? 0.5) * 100)}% &bull; Influence: {(preferences[hoveredNode] ?? 0.5) >= 0.7 ? 'HIGH' : (preferences[hoveredNode] ?? 0.5) >= 0.5 ? 'MEDIUM' : 'LOW'}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-300 italic max-w-[140px] text-right">
                3D attraction brings stronger interests closer to core.
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Recent Learning Events Panel + Readable Text Model (4 cols) */}
        {isPanelsExpanded && (
          <div className="md:col-span-4 space-y-4">
          {/* Recent Learning Activity Log Panel */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-inner">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Activity size={14} className="text-cyan-400" />
              Recent Learning Signals
            </h4>

            {recentEvents.length > 0 ? (
              <div className="space-y-2">
                {recentEvents.map((evt, idx) => {
                  const isHigh = evt.engagementPercent >= 70;
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{CATEGORY_MAP[evt.category]?.icon || '📌'}</span>
                        <div>
                          <span className="font-bold text-slate-100 block">{evt.category}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {isHigh ? 'Strong watch time signal' : 'Skipped / lower interest'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold flex items-center gap-0.5 text-xs ${isHigh ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {isHigh ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          {isHigh ? '+15' : '-5'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-center text-[11px] text-slate-500 italic bg-slate-900/50 rounded-xl border border-slate-800/50">
                Awaiting user content recommendation decisions...
              </div>
            )}
          </div>

          {/* Accessible Text Representation: Current Learned Model Cards List */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-inner">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Info size={14} className="text-cyan-400" />
              What The Algorithm Knows
            </h4>

            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {sortedTextList.map((node) => (
                <div
                  key={node.cat}
                  className={`p-2 rounded-xl border flex items-center justify-between text-xs ${node.cat === activeCategory
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-sm">{node.meta.icon}</span>
                    <span className="font-bold truncate text-[11px]">{node.meta.name}</span>
                  </div>
                  <span className="font-mono font-bold text-[11px] text-cyan-400 ml-1">
                    {node.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
