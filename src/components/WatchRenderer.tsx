import React, { useEffect, useState, useRef } from 'react';
import { WatchConfig } from '../types/watch';
import { METALS, LUME_COLORS } from '../data/horologySpecs';
import { horologyAudio } from '../utils/audio';

interface WatchRendererProps {
  config: WatchConfig;
  size?: number; // pixel width/height default 420
  isExhibitionBack?: boolean;
  interactive?: boolean;
  isPaused?: boolean;
  playAudio?: boolean;
  customTime?: { hours: number; minutes: number; seconds: number; millis: number };
  className?: string;
  winderSpinning?: boolean;
  winderDirection?: 'cw' | 'ccw' | 'bidirectional';
}

export const WatchRenderer: React.FC<WatchRendererProps> = ({
  config,
  size = 420,
  isExhibitionBack = false,
  isPaused = false,
  playAudio = false,
  customTime,
  className = '',
  winderSpinning = false,
  winderDirection = 'cw'
}) => {
  const [time, setTime] = useState({ hours: 10, minutes: 8, seconds: 37, millis: 0 });
  const animFrameRef = useRef<number | null>(null);
  const lastSecondRef = useRef<number>(-1);

  // Time loop for live mechanical second hand sweep
  useEffect(() => {
    if (customTime) {
      setTime(customTime);
      return;
    }

    if (isPaused) return;

    let mounted = true;
    const update = () => {
      if (!mounted) return;
      const now = new Date();
      const s = now.getSeconds();
      const ms = now.getMilliseconds();
      const m = now.getMinutes();
      const h = now.getHours();

      setTime({ hours: h, minutes: m, seconds: s, millis: ms });

      // Trigger mechanical tick sound on each second change
      if (playAudio && s !== lastSecondRef.current) {
        lastSecondRef.current = s;
        horologyAudio.playMechanicalTick(s % 2 === 0);
      }

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      mounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused, customTime, playAudio]);

  const metalSpec = METALS.find(m => m.id === config.caseMetal) || METALS[0];
  const lumeSpec = LUME_COLORS.find(l => l.id === config.lumeColor) || LUME_COLORS[1];

  // Calculate hand angles
  const totalSeconds = time.seconds + time.millis / 1000;
  const secondDeg = totalSeconds * 6; // 360 / 60
  const minuteDeg = (time.minutes + totalSeconds / 60) * 6;
  const hourDeg = ((time.hours % 12) + (time.minutes + totalSeconds / 60) / 60) * 30;

  // Complication states
  const hasTourbillon = config.complications.includes('tourbillon');
  const hasChronograph = config.complications.includes('chronograph');
  const hasMoonphase = config.complications.includes('moonphase');
  const hasPowerReserve = config.complications.includes('power_reserve');
  const hasGMT = config.complications.includes('gmt');

  // Tourbillon rotation: 1 full rotation per 60 seconds
  const tourbillonDeg = secondDeg;

  // Winder rotation animation
  const winderClass = winderSpinning
    ? winderDirection === 'ccw'
      ? 'animate-spin-reverse'
      : 'animate-spin-slow'
    : '';

  // Strap SVG components
  const renderStrap = () => {
    switch (config.strap) {
      case 'alligator_leather':
        return (
          <g id="strap-leather">
            {/* Top Strap */}
            <path d="M 140 30 L 148 100 L 252 100 L 260 30 Z" fill="#18181b" stroke="#27272a" strokeWidth="2" />
            <path d="M 148 35 L 154 95 M 246 95 L 252 35" stroke="#d4af37" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
            {/* Alligator scales */}
            <rect x="156" y="38" width="24" height="14" rx="2" fill="#202024" stroke="#121214" />
            <rect x="184" y="38" width="28" height="14" rx="2" fill="#1f1f23" stroke="#121214" />
            <rect x="216" y="38" width="24" height="14" rx="2" fill="#202024" stroke="#121214" />
            <rect x="154" y="56" width="30" height="16" rx="2" fill="#222227" stroke="#121214" />
            <rect x="188" y="56" width="28" height="16" rx="2" fill="#202024" stroke="#121214" />
            <rect x="220" y="56" width="24" height="16" rx="2" fill="#222227" stroke="#121214" />
            <rect x="156" y="76" width="26" height="18" rx="2" fill="#1e1e22" stroke="#121214" />
            <rect x="186" y="76" width="30" height="18" rx="2" fill="#202024" stroke="#121214" />
            <rect x="220" y="76" width="22" height="18" rx="2" fill="#1e1e22" stroke="#121214" />

            {/* Bottom Strap */}
            <path d="M 148 300 L 140 370 L 260 370 L 252 300 Z" fill="#18181b" stroke="#27272a" strokeWidth="2" />
            <path d="M 154 305 L 148 365 M 246 305 L 252 365" stroke="#d4af37" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
            <rect x="154" y="306" width="28" height="16" rx="2" fill="#202024" stroke="#121214" />
            <rect x="186" y="306" width="28" height="16" rx="2" fill="#222227" stroke="#121214" />
            <rect x="218" y="306" width="24" height="16" rx="2" fill="#202024" stroke="#121214" />
            <rect x="152" y="326" width="30" height="16" rx="2" fill="#1e1e22" stroke="#121214" />
            <rect x="186" y="326" width="28" height="16" rx="2" fill="#202024" stroke="#121214" />
            <rect x="218" y="326" width="26" height="16" rx="2" fill="#1e1e22" stroke="#121214" />
            <rect x="150" y="346" width="30" height="18" rx="2" fill="#222227" stroke="#121214" />
            <rect x="184" y="346" width="32" height="18" rx="2" fill="#202024" stroke="#121214" />
            <rect x="220" y="346" width="26" height="18" rx="2" fill="#222227" stroke="#121214" />
          </g>
        );

      case 'titanium_bracelet':
        return (
          <g id="strap-titanium">
            {/* Top link segments */}
            <path d="M 142 30 L 148 100 L 252 100 L 258 30 Z" fill="url(#metal-grad-case)" stroke="#3f3f46" strokeWidth="1.5" />
            {[-1, 0, 1].map(row => (
              <g key={`top-link-${row}`}>
                <line x1="145" y1={45 + row * 22} x2="255" y2={45 + row * 22} stroke="#18181b" strokeWidth="2" />
                <rect x="175" y={35 + row * 22} width="50" height="18" rx="2" fill="url(#metal-grad-highlight)" stroke="#27272a" />
              </g>
            ))}
            {/* Bottom link segments */}
            <path d="M 148 300 L 142 370 L 258 370 L 252 300 Z" fill="url(#metal-grad-case)" stroke="#3f3f46" strokeWidth="1.5" />
            {[0, 1, 2].map(row => (
              <g key={`bot-link-${row}`}>
                <line x1="145" y1={310 + row * 22} x2="255" y2={310 + row * 22} stroke="#18181b" strokeWidth="2" />
                <rect x="175" y={312 + row * 22} width="50" height="18" rx="2" fill="url(#metal-grad-highlight)" stroke="#27272a" />
              </g>
            ))}
          </g>
        );

      case 'vulcanized_rubber':
        return (
          <g id="strap-rubber">
            <path d="M 142 30 L 148 100 L 252 100 L 258 30 Z" fill="#121214" stroke="#27272a" strokeWidth="1.5" />
            {[40, 52, 64, 76, 88].map(y => (
              <line key={`rub-top-${y}`} x1="160" y1={y} x2="240" y2={y} stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
            ))}
            <path d="M 148 300 L 142 370 L 258 370 L 252 300 Z" fill="#121214" stroke="#27272a" strokeWidth="1.5" />
            {[312, 324, 336, 348, 360].map(y => (
              <line key={`rub-bot-${y}`} x1="160" y1={y} x2="240" y2={y} stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
            ))}
          </g>
        );

      case 'milanese_mesh':
        return (
          <g id="strap-milanese">
            <pattern id="milanese-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 0 3 L 3 0 L 6 3 L 3 6 Z" fill="none" stroke="#71717a" strokeWidth="0.8" />
              <circle cx="3" cy="3" r="1" fill="#d4d4d8" />
            </pattern>
            <path d="M 142 30 L 148 100 L 252 100 L 258 30 Z" fill="url(#milanese-pattern)" stroke="#52525b" strokeWidth="2" />
            <path d="M 148 300 L 142 370 L 258 370 L 252 300 Z" fill="url(#milanese-pattern)" stroke="#52525b" strokeWidth="2" />
          </g>
        );

      case 'hybrid_cordura':
      default:
        return (
          <g id="strap-cordura">
            <pattern id="cordura-weave" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="2" height="2" fill="#27272a" />
              <rect x="2" y="2" width="2" height="2" fill="#3f3f46" />
            </pattern>
            <path d="M 142 30 L 148 100 L 252 100 L 258 30 Z" fill="url(#cordura-weave)" stroke="#3f3f46" strokeWidth="2" />
            <line x1="152" y1="35" x2="156" y2="95" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="248" y1="35" x2="244" y2="95" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />

            <path d="M 148 300 L 142 370 L 258 370 L 252 300 Z" fill="url(#cordura-weave)" stroke="#3f3f46" strokeWidth="2" />
            <line x1="156" y1="305" x2="152" y2="365" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="244" y1="305" x2="248" y2="365" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
          </g>
        );
    }
  };

  // Bezel pattern rendering
  const renderBezel = () => {
    switch (config.bezel) {
      case 'tachymeter_ceramic':
        return (
          <g id="bezel-tachymeter">
            <circle cx="200" cy="200" r="95" fill="none" stroke="#09090b" strokeWidth="12" />
            <circle cx="200" cy="200" r="101" fill="none" stroke="#27272a" strokeWidth="1" />
            {/* Tachymeter markings */}
            {[60, 65, 70, 75, 80, 90, 100, 120, 150, 200, 240, 300, 400].map((val, idx) => {
              const angle = (idx / 13) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 200 + 95 * Math.cos(rad);
              const y = 200 + 95 * Math.sin(rad);
              return (
                <text
                  key={`tachy-${val}`}
                  x={x}
                  y={y + 2.5}
                  fill="#e4e4e7"
                  fontSize="5.5"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                  transform={`rotate(${angle + 90}, ${x}, ${y})`}
                >
                  {val}
                </text>
              );
            })}
          </g>
        );

      case 'fluted_gold':
        return (
          <g id="bezel-fluted">
            <circle cx="200" cy="200" r="96" fill="none" stroke="url(#metal-grad-case)" strokeWidth="12" />
            {/* 60 fluted ridges */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * 360;
              const rad = (angle * Math.PI) / 180;
              const x1 = 200 + 90 * Math.cos(rad);
              const y1 = 200 + 90 * Math.sin(rad);
              const x2 = 200 + 102 * Math.cos(rad);
              const y2 = 200 + 102 * Math.sin(rad);
              return (
                <line
                  key={`flute-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? 'url(#metal-grad-highlight)' : '#000000'}
                  strokeWidth="1.5"
                  opacity="0.85"
                />
              );
            })}
          </g>
        );

      case 'diver_countup':
        return (
          <g id="bezel-diver">
            <circle cx="200" cy="200" r="95" fill="none" stroke="#18181b" strokeWidth="12" />
            <polygon points="200,90 196,98 204,98" fill={lumeSpec.glowHex} />
            <circle cx="200" cy="95" r="1.5" fill="#ffffff" />
            {['10', '20', '30', '40', '50'].map((mark, i) => {
              const angle = ((i + 1) * 60) - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 200 + 95 * Math.cos(rad);
              const y = 200 + 95 * Math.sin(rad);
              return (
                <text
                  key={`div-${mark}`}
                  x={x}
                  y={y + 3}
                  fill="#ffffff"
                  fontSize="7"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                  textAnchor="middle"
                  transform={`rotate(${angle + 90}, ${x}, ${y})`}
                >
                  {mark}
                </text>
              );
            })}
          </g>
        );

      case 'gemset_baguette':
        return (
          <g id="bezel-gemset">
            <circle cx="200" cy="200" r="96" fill="none" stroke="url(#metal-grad-case)" strokeWidth="12" />
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i / 36) * 360;
              const rad = (angle * Math.PI) / 180;
              const cx = 200 + 96 * Math.cos(rad);
              const cy = 200 + 96 * Math.sin(rad);
              return (
                <rect
                  key={`baguette-${i}`}
                  x={cx - 3}
                  y={cy - 5}
                  width="6"
                  height="10"
                  rx="1"
                  fill="#f8fafc"
                  stroke="#94a3b8"
                  strokeWidth="0.5"
                  transform={`rotate(${angle + 90}, ${cx}, ${cy})`}
                />
              );
            })}
          </g>
        );

      case 'minimalist_polished':
      default:
        return (
          <g id="bezel-minimal">
            <circle cx="200" cy="200" r="95" fill="none" stroke="url(#metal-grad-highlight)" strokeWidth="10" />
            <circle cx="200" cy="200" r="90" fill="none" stroke="#27272a" strokeWidth="0.8" />
          </g>
        );
    }
  };

  // Dial background patterns
  const renderDialTexture = () => {
    switch (config.dialTexture) {
      case 'meteorite':
        return (
          <g id="dial-meteorite">
            <circle cx="200" cy="200" r="88" fill="#334155" />
            {/* Widmanstätten lattice patterns */}
            {[-60, -40, -20, 0, 20, 40, 60, 80].map((offset, i) => (
              <line
                key={`wid1-${i}`}
                x1={120 + offset}
                y1="120"
                x2={180 + offset}
                y2="280"
                stroke="#64748b"
                strokeWidth="1.5"
                opacity="0.6"
              />
            ))}
            {[-40, -10, 20, 50, 80].map((offset, i) => (
              <line
                key={`wid2-${i}`}
                x1="120"
                y1={130 + offset}
                x2="280"
                y2={190 + offset}
                stroke="#94a3b8"
                strokeWidth="1.2"
                opacity="0.5"
              />
            ))}
            {[-50, -20, 10, 40, 70].map((offset, i) => (
              <line
                key={`wid3-${i}`}
                x1={280 - offset}
                y1="130"
                x2={130 - offset}
                y2="270"
                stroke="#475569"
                strokeWidth="1"
                opacity="0.7"
              />
            ))}
          </g>
        );

      case 'azure_sunburst':
        return (
          <g id="dial-azure">
            <defs>
              <radialGradient id="azure-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="60%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="88" fill="url(#azure-glow)" />
            {Array.from({ length: 72 }).map((_, i) => {
              const angle = (i / 72) * 360;
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={`sun-${i}`}
                  x1="200"
                  y1="200"
                  x2={200 + 88 * Math.cos(rad)}
                  y2={200 + 88 * Math.sin(rad)}
                  stroke="#38bdf8"
                  strokeWidth="0.5"
                  opacity={i % 3 === 0 ? '0.4' : '0.15'}
                />
              );
            })}
          </g>
        );

      case 'aventurine':
        return (
          <g id="dial-aventurine">
            <circle cx="200" cy="200" r="88" fill="#090d16" />
            {/* Starry specks */}
            {[
              [160, 160], [240, 150], [170, 230], [230, 240], [190, 140],
              [210, 260], [140, 190], [260, 210], [150, 220], [245, 180],
              [180, 190], [220, 170], [175, 250], [215, 135], [135, 165]
            ].map(([x, y], i) => (
              <circle
                key={`star-${i}`}
                cx={x}
                cy={y}
                r={i % 3 === 0 ? 1.4 : 0.8}
                fill={i % 2 === 0 ? '#fde047' : '#e0f2fe'}
                opacity={0.7 + (i % 4) * 0.08}
              />
            ))}
          </g>
        );

      case 'guilloche_tapisserie':
        return (
          <g id="dial-guilloche">
            <pattern id="tapisserie-grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#1e293b" />
              <rect x="1" y="1" width="6" height="6" fill="#334155" rx="0.5" />
              <rect x="2" y="2" width="4" height="4" fill="#475569" rx="0.5" />
            </pattern>
            <circle cx="200" cy="200" r="88" fill="url(#tapisserie-grid)" />
            <circle cx="200" cy="200" r="88" fill="url(#dial-vignette)" />
          </g>
        );

      case 'quantum_skeleton':
        return (
          <g id="dial-skeleton">
            {/* Openworked base plate */}
            <circle cx="200" cy="200" r="88" fill="#18181b" />
            {/* Cutouts exposing titanium bridges */}
            <circle cx="200" cy="200" r="82" fill="#0f0f12" />

            {/* Gear Train Gears */}
            {/* Mainspring barrel at 12 o'clock */}
            <g transform="translate(200, 145)">
              <circle cx="0" cy="0" r="26" fill="#27272a" stroke="#d4af37" strokeWidth="1" />
              <circle cx="0" cy="0" r="24" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="2,2" />
              <circle cx="0" cy="0" r="6" fill="#d4af37" />
              <circle cx="0" cy="0" r="2" fill="#e11d48" /> {/* Ruby jewel */}
            </g>

            {/* Center wheel */}
            <g transform={`rotate(${secondDeg / 10}, 200, 200)`}>
              <circle cx="200" cy="200" r="16" fill="none" stroke="#d4af37" strokeWidth="2" strokeDasharray="3,3" />
              <line x1="200" y1="184" x2="200" y2="216" stroke="#d4af37" strokeWidth="1.5" />
              <line x1="184" y1="200" x2="216" y2="200" stroke="#d4af37" strokeWidth="1.5" />
            </g>

            {/* Escape wheel and gear at 9 o'clock */}
            <g transform={`translate(160, 195) rotate(${secondDeg * 2}, 0, 0)`}>
              <circle cx="0" cy="0" r="14" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2,2" />
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#d4af37" strokeWidth="1" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#d4af37" strokeWidth="1" />
              <circle cx="0" cy="0" r="3" fill="#e11d48" /> {/* Jewel */}
            </g>

            {/* Skeleton Ruthenium Bridge Plate with Beveled Anglage */}
            <path
              d="M 145 155 Q 200 130 255 155 L 245 185 Q 200 170 155 185 Z"
              fill="#27272a"
              stroke="#d4af37"
              strokeWidth="0.8"
            />
            {/* Blued Screws */}
            <circle cx="160" cy="165" r="2.5" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="0.5" />
            <line x1="158" y1="165" x2="162" y2="165" stroke="#ffffff" strokeWidth="0.6" />
            <circle cx="240" cy="165" r="2.5" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="0.5" />
            <line x1="238" y1="165" x2="242" y2="165" stroke="#ffffff" strokeWidth="0.6" />
          </g>
        );

      case 'matte_obsidian':
      default:
        return (
          <g id="dial-matte">
            <circle cx="200" cy="200" r="88" fill="#09090b" />
            <circle cx="200" cy="200" r="88" fill="url(#dial-vignette)" />
          </g>
        );
    }
  };

  // Hour and minute index markers
  const renderDialIndices = () => {
    return (
      <g id="dial-indices">
        {/* Minute chapter track */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * 360;
          const isFiveMin = i % 5 === 0;
          const rad = (angle * Math.PI) / 180;
          const rInner = isFiveMin ? 78 : 82;
          const rOuter = 85;
          const x1 = 200 + rInner * Math.cos(rad);
          const y1 = 200 + rInner * Math.sin(rad);
          const x2 = 200 + rOuter * Math.cos(rad);
          const y2 = 200 + rOuter * Math.sin(rad);

          return (
            <line
              key={`index-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isFiveMin ? '#f4f4f5' : '#71717a'}
              strokeWidth={isFiveMin ? 1.8 : 0.8}
            />
          );
        })}

        {/* Applied faceted hour batons with lume */}
        {[1, 2, 4, 5, 7, 8, 10, 11].map(hour => {
          // Skip if covered by prominent complications
          if (hasTourbillon && (hour === 5 || hour === 6 || hour === 7)) return null;
          if (hasMoonphase && (hour === 6)) return null;

          const angle = hour * 30 - 90;
          const rad = (angle * Math.PI) / 180;
          const cx = 200 + 74 * Math.cos(rad);
          const cy = 200 + 74 * Math.sin(rad);
          return (
            <g key={`applied-${hour}`} transform={`rotate(${angle + 90}, ${cx}, ${cy})`}>
              <rect x={cx - 2} y={cy - 6} width="4" height="12" rx="0.8" fill="url(#metal-grad-highlight)" stroke="#27272a" strokeWidth="0.5" />
              <rect x={cx - 1} y={cy - 4} width="2" height="8" rx="0.5" fill={lumeSpec.hex} />
            </g>
          );
        })}

        {/* 12 o'clock double marker */}
        <g transform="translate(200, 126)">
          <rect x="-4" y="-6" width="3" height="12" rx="0.8" fill="url(#metal-grad-highlight)" stroke="#27272a" strokeWidth="0.5" />
          <rect x="-3" y="-4" width="1" height="8" fill={lumeSpec.hex} />
          <rect x="1" y="-6" width="3" height="12" rx="0.8" fill="url(#metal-grad-highlight)" stroke="#27272a" strokeWidth="0.5" />
          <rect x="2" y="-4" width="1" height="8" fill={lumeSpec.hex} />
        </g>

        {/* Brand wordmark on dial */}
        <text
          x="200"
          y={hasTourbillon ? '168' : '155'}
          fill="#e4e4e7"
          fontSize="6"
          fontWeight="700"
          fontFamily="var(--font-serif)"
          letterSpacing="0.15em"
          textAnchor="middle"
        >
          CHRONOS
        </text>
        <text
          x="200"
          y={hasTourbillon ? '174' : '162'}
          fill="#a1a1aa"
          fontSize="3.8"
          fontFamily="var(--font-mono)"
          letterSpacing="0.08em"
          textAnchor="middle"
        >
          GENÈVE · 4Hz
        </text>
      </g>
    );
  };

  // Complication modules
  const renderComplications = () => {
    return (
      <g id="complications">
        {/* 60-Second Flying Tourbillon at 6 o'clock */}
        {hasTourbillon && (
          <g id="comp-tourbillon" transform="translate(200, 245)">
            {/* Exhibition opening aperture */}
            <circle cx="0" cy="0" r="23" fill="#0c0c0e" stroke="url(#metal-grad-case)" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="21" fill="none" stroke="#27272a" strokeWidth="0.8" />

            {/* Rotating Tourbillon Cage */}
            <g transform={`rotate(${tourbillonDeg}, 0, 0)`}>
              {/* Outer Cage Ring */}
              <circle cx="0" cy="0" r="18" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="1,1" />

              {/* 3-Arm Titanium Carriage */}
              {[0, 120, 240].map(rot => (
                <path
                  key={`tourb-arm-${rot}`}
                  d="M 0 0 L 0 -17 L 2 -17 L 1 0 Z"
                  fill="#e2e8f0"
                  stroke="#64748b"
                  strokeWidth="0.5"
                  transform={`rotate(${rot}, 0, 0)`}
                />
              ))}

              {/* Oscillating Balance Wheel & Hairspring */}
              <circle cx="0" cy="0" r="13" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
              {/* Micro regulation weights */}
              {[30, 90, 150, 210, 270, 330].map(angle => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <circle
                    key={`weight-${angle}`}
                    cx={13 * Math.cos(rad)}
                    cy={13 * Math.sin(rad)}
                    r="1.2"
                    fill="#d4af37"
                  />
                );
              })}

              {/* Blued screws on cage */}
              <circle cx="0" cy="-12" r="1.5" fill="#2563eb" />
              <circle cx="10" cy="6" r="1.5" fill="#2563eb" />
              <circle cx="-10" cy="6" r="1.5" fill="#2563eb" />

              {/* Center synthetic ruby bearing */}
              <circle cx="0" cy="0" r="3.5" fill="#be123c" stroke="#fb7185" strokeWidth="0.6" />
              <circle cx="0" cy="0" r="1.2" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* Chronograph sub-dials at 3 and 9 o'clock */}
        {hasChronograph && (
          <g id="comp-chronograph">
            {/* 3 o'clock 30-minute register */}
            <g transform="translate(242, 200)">
              <circle cx="0" cy="0" r="16" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" opacity="0.9" />
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={`sub3-${i}`}
                    x1={11 * Math.cos(rad)}
                    y1={11 * Math.sin(rad)}
                    x2={14 * Math.cos(rad)}
                    y2={14 * Math.sin(rad)}
                    stroke="#a1a1aa"
                    strokeWidth="0.8"
                  />
                );
              })}
              <text x="0" y="7" fill="#a1a1aa" fontSize="4" fontFamily="var(--font-mono)" textAnchor="middle">30</text>
              {/* Needle pointing at elapsed minutes */}
              <g transform={`rotate(${(time.minutes % 30) * 12}, 0, 0)`}>
                <line x1="0" y1="2" x2="0" y2="-12" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
                <circle cx="0" cy="0" r="1.5" fill="#ef4444" />
              </g>
            </g>

            {/* 9 o'clock 12-hour register */}
            <g transform="translate(158, 200)">
              <circle cx="0" cy="0" r="16" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" opacity="0.9" />
              {Array.from({ length: 4 }).map((_, i) => {
                const angle = (i / 4) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={`sub9-${i}`}
                    x1={11 * Math.cos(rad)}
                    y1={11 * Math.sin(rad)}
                    x2={14 * Math.cos(rad)}
                    y2={14 * Math.sin(rad)}
                    stroke="#a1a1aa"
                    strokeWidth="0.8"
                  />
                );
              })}
              <text x="0" y="7" fill="#a1a1aa" fontSize="4" fontFamily="var(--font-mono)" textAnchor="middle">12</text>
              {/* Needle */}
              <g transform={`rotate(${(time.hours % 12) * 30}, 0, 0)`}>
                <line x1="0" y1="2" x2="0" y2="-12" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
                <circle cx="0" cy="0" r="1.5" fill="#ef4444" />
              </g>
            </g>
          </g>
        )}

        {/* Astronomical Moonphase at 6 o'clock (when not tourbillon) */}
        {hasMoonphase && !hasTourbillon && (
          <g id="comp-moonphase" transform="translate(200, 245)">
            <circle cx="0" cy="0" r="18" fill="#090d16" stroke="#3f3f46" strokeWidth="1" />
            {/* Lunar crescent aperture mask */}
            <path d="M -16 0 A 16 16 0 0 1 16 0 Q 0 -6 -16 0 Z" fill="#18181b" />
            {/* Golden Moon disk */}
            <circle cx="2" cy="4" r="7" fill="url(#gold-moon-grad)" />
            <circle cx="-1" cy="2" r="1.2" fill="#d97706" opacity="0.4" />
            <circle cx="4" cy="6" r="0.8" fill="#d97706" opacity="0.4" />
            {/* Stars */}
            <circle cx="-8" cy="6" r="0.7" fill="#ffffff" />
            <circle cx="10" cy="3" r="0.7" fill="#ffffff" />
            <circle cx="-6" cy="-4" r="0.5" fill="#fde047" />
          </g>
        )}

        {/* 72-Hour Power Reserve Arc at 10 o'clock */}
        {hasPowerReserve && (
          <g id="comp-power-reserve" transform="translate(160, 160)">
            <path
              d="M -10 10 A 18 18 0 0 1 10 -10"
              fill="none"
              stroke="#27272a"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M -10 10 A 18 18 0 0 1 4 -6"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Warning red sector */}
            <path
              d="M -10 10 A 18 18 0 0 1 -7 5"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Indicator Needle */}
            <line x1="0" y1="0" x2="6" y2="-9" stroke="#f4f4f5" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="0" cy="0" r="1.5" fill="#f4f4f5" />
            <text x="-4" y="16" fill="#a1a1aa" fontSize="3.5" fontFamily="var(--font-mono)">72H</text>
          </g>
        )}

        {/* GMT 24H Hand */}
        {hasGMT && (
          <g id="comp-gmt" transform={`rotate(${((time.hours + 4) % 24) * 15}, 200, 200)`}>
            <line x1="200" y1="200" x2="200" y2="128" stroke="#ef4444" strokeWidth="1.2" />
            {/* Red Arrow Head with Lume */}
            <polygon points="200,123 197,130 203,130" fill="#ef4444" />
            <polygon points="200,125 198,129 202,129" fill={lumeSpec.hex} />
          </g>
        )}
      </g>
    );
  };

  // Main watch hands
  const renderHands = () => {
    switch (config.handsStyle) {
      case 'blued_breguet':
        return (
          <g id="hands-breguet">
            {/* Hour Hand */}
            <g transform={`rotate(${hourDeg}, 200, 200)`}>
              <line x1="200" y1="210" x2="200" y2="152" stroke="#1e40af" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="200" cy="154" r="4" fill="none" stroke="#1e40af" strokeWidth="1.6" />
              <circle cx="200" cy="154" r="2.2" fill="#09090b" />
              <line x1="200" y1="150" x2="200" y2="144" stroke="#1e40af" strokeWidth="1.8" />
            </g>
            {/* Minute Hand */}
            <g transform={`rotate(${minuteDeg}, 200, 200)`}>
              <line x1="200" y1="214" x2="200" y2="130" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="200" cy="132" r="3.5" fill="none" stroke="#1e40af" strokeWidth="1.4" />
              <circle cx="200" cy="132" r="2" fill="#09090b" />
              <line x1="200" y1="128.5" x2="200" y2="122" stroke="#1e40af" strokeWidth="1.4" />
            </g>
            {/* Second Hand */}
            <g transform={`rotate(${secondDeg}, 200, 200)`}>
              <line x1="200" y1="220" x2="200" y2="118" stroke="#3b82f6" strokeWidth="0.8" />
              <circle cx="200" cy="214" r="2.2" fill="#1e40af" />
            </g>
          </g>
        );

      case 'skeleton_obelisque':
        return (
          <g id="hands-obelisque">
            {/* Hour hand */}
            <g transform={`rotate(${hourDeg}, 200, 200)`}>
              <polygon points="198,206 202,206 202.5,150 200,144 197.5,150" fill="url(#metal-grad-highlight)" stroke="#18181b" strokeWidth="0.5" />
              <polygon points="199,195 201,195 201.5,152 200,148 198.5,152" fill={lumeSpec.hex} />
            </g>
            {/* Minute hand */}
            <g transform={`rotate(${minuteDeg}, 200, 200)`}>
              <polygon points="198.5,210 201.5,210 202,128 200,122 198,128" fill="url(#metal-grad-highlight)" stroke="#18181b" strokeWidth="0.5" />
              <polygon points="199,200 201,200 201.5,130 200,125 198.5,130" fill={lumeSpec.hex} />
            </g>
            {/* Second hand */}
            <g transform={`rotate(${secondDeg}, 200, 200)`}>
              <line x1="200" y1="220" x2="200" y2="116" stroke="#d4af37" strokeWidth="0.8" />
              <rect x="198.5" y="128" width="3" height="10" rx="0.5" fill={lumeSpec.hex} />
            </g>
          </g>
        );

      case 'quantum_baton':
        return (
          <g id="hands-baton">
            {/* Hour Hand */}
            <g transform={`rotate(${hourDeg}, 200, 200)`}>
              <rect x="198" y="146" width="4" height="60" rx="1" fill="url(#metal-grad-highlight)" stroke="#18181b" strokeWidth="0.5" />
              <rect x="199" y="150" width="2" height="40" rx="0.5" fill={lumeSpec.hex} />
            </g>
            {/* Minute Hand */}
            <g transform={`rotate(${minuteDeg}, 200, 200)`}>
              <rect x="198.5" y="124" width="3" height="82" rx="0.8" fill="url(#metal-grad-highlight)" stroke="#18181b" strokeWidth="0.5" />
              <rect x="199.2" y="128" width="1.6" height="58" rx="0.5" fill={lumeSpec.hex} />
            </g>
            {/* Second Hand */}
            <g transform={`rotate(${secondDeg}, 200, 200)`}>
              <line x1="200" y1="222" x2="200" y2="116" stroke="#e11d48" strokeWidth="0.9" />
              <circle cx="200" cy="216" r="3" fill="#e11d48" />
              <polygon points="200,120 198,126 202,126" fill="#e11d48" />
            </g>
          </g>
        );

      case 'royal_dauphine':
      default:
        return (
          <g id="hands-dauphine">
            {/* Hour hand */}
            <g transform={`rotate(${hourDeg}, 200, 200)`}>
              <polygon points="200,208 196.5,185 200,146 203.5,185" fill="url(#metal-grad-highlight)" stroke="#18181b" strokeWidth="0.5" />
              <line x1="200" y1="208" x2="200" y2="146" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
              <polygon points="199.2,185 200,154 200.8,185" fill={lumeSpec.hex} />
            </g>
            {/* Minute hand */}
            <g transform={`rotate(${minuteDeg}, 200, 200)`}>
              <polygon points="200,212 197,180 200,124 203,180" fill="url(#metal-grad-highlight)" stroke="#18181b" strokeWidth="0.5" />
              <line x1="200" y1="212" x2="200" y2="124" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
              <polygon points="199.3,180 200,132 200.7,180" fill={lumeSpec.hex} />
            </g>
            {/* Second hand */}
            <g transform={`rotate(${secondDeg}, 200, 200)`}>
              <line x1="200" y1="222" x2="200" y2="116" stroke="#d4af37" strokeWidth="0.8" />
              <circle cx="200" cy="216" r="2.5" fill="#d4af37" />
            </g>
          </g>
        );
    }
  };

  // Exhibition Caseback view
  const renderExhibitionBack = () => {
    return (
      <g id="exhibition-caseback">
        {/* Metal case ring with engraved technical markings */}
        <circle cx="200" cy="200" r="96" fill="url(#metal-grad-case)" stroke="#27272a" strokeWidth="2" />
        <circle cx="200" cy="200" r="88" fill="#18181b" stroke="url(#metal-grad-highlight)" strokeWidth="1" />

        {/* Circular text engraving on metal rim */}
        <path id="caseback-text-path" d="M 120 200 A 80 80 0 1 1 280 200" fill="none" />
        <text fill="#a1a1aa" fontSize="4.8" fontFamily="var(--font-mono)" letterSpacing="0.1em">
          <textPath href="#caseback-text-path" startOffset="50%" textAnchor="middle">
            CHRONOS HOROLOGIE · 300M TITANIUM · {config.serialNumber}
          </textPath>
        </text>

        {/* Sapphire Exhibition Crystal */}
        <circle cx="200" cy="200" r="76" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />

        {/* Movement Base Plates with Côtes de Genève stripes */}
        <g id="cotes-de-geneve">
          {[-70, -50, -30, -10, 10, 30, 50, 70].map(y => (
            <rect
              key={`cotes-${y}`}
              x="130"
              y={200 + y}
              width="140"
              height="18"
              fill={y % 20 === 0 ? '#27272a' : '#1f1f23'}
              opacity="0.8"
            />
          ))}
        </g>

        {/* Visible Balance Wheel & Jewel pivots */}
        <circle cx="160" cy="180" r="16" fill="none" stroke="#fbbf24" strokeWidth="1.4" />
        <circle cx="160" cy="180" r="4" fill="#e11d48" stroke="#ffffff" strokeWidth="0.5" />
        <circle cx="230" cy="185" r="3" fill="#e11d48" stroke="#ffffff" strokeWidth="0.5" />
        <circle cx="215" cy="225" r="3.5" fill="#e11d48" stroke="#ffffff" strokeWidth="0.5" />

        {/* 22K Gold Skeletonized Winding Rotor (rotates with time or mouse) */}
        <g transform={`rotate(${secondDeg * 0.5}, 200, 200)`}>
          <path
            d="M 128 200 A 72 72 0 0 1 272 200 L 255 200 A 55 55 0 0 0 145 200 Z"
            fill="url(#gold-rotor-grad)"
            stroke="#997b1a"
            strokeWidth="1"
          />
          <path
            d="M 140 200 L 190 200 L 195 200 L 205 200 L 210 200 L 260 200"
            stroke="#d4af37"
            strokeWidth="1.5"
          />
          {/* Custom Rotor Engraving */}
          <text
            x="200"
            y="155"
            fill="#451a03"
            fontSize="4.8"
            fontWeight="700"
            fontFamily="var(--font-serif)"
            textAnchor="middle"
          >
            {config.rotorEngraving || 'CHRONOS HAUTE HORLOGERIE'}
          </text>
          <text
            x="200"
            y="163"
            fill="#78350f"
            fontSize="3.8"
            fontFamily="var(--font-mono)"
            textAnchor="middle"
          >
            CALIBRE CH-9000 · 39 JEWELS · 22K ROTOR
          </text>
        </g>

        {/* Central Rotor Bearing with Micro Ball Bearings */}
        <circle cx="200" cy="200" r="10" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
        <circle cx="200" cy="200" r="4" fill="#18181b" />
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i / 7) * 360;
          const rad = (angle * Math.PI) / 180;
          return (
            <circle
              key={`ball-${i}`}
              cx={200 + 7 * Math.cos(rad)}
              cy={200 + 7 * Math.sin(rad)}
              r="1.2"
              fill="#cbd5e1"
            />
          );
        })}
      </g>
    );
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        className={`max-w-full h-auto drop-shadow-2xl transition-transform duration-700 ${winderClass}`}
      >
        <defs>
          {/* Metallic Case Gradient */}
          <linearGradient id="metal-grad-case" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={metalSpec.accentHex} />
            <stop offset="40%" stopColor={metalSpec.hex} />
            <stop offset="70%" stopColor="#1e293b" />
            <stop offset="100%" stopColor={metalSpec.accentHex} />
          </linearGradient>

          {/* Highlight Gradient */}
          <linearGradient id="metal-grad-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="35%" stopColor={metalSpec.hex} />
            <stop offset="70%" stopColor="#0f172a" />
            <stop offset="100%" stopColor={metalSpec.accentHex} />
          </linearGradient>

          {/* Gold Rotor Gradient */}
          <linearGradient id="gold-rotor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Gold Moon Gradient */}
          <radialGradient id="gold-moon-grad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </radialGradient>

          {/* Vignette Shadow for Dials */}
          <radialGradient id="dial-vignette" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
          </radialGradient>

          {/* Sapphire Glare Arc */}
          <linearGradient id="sapphire-glare" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.08" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* 1. Strap (rendered behind case) */}
        {renderStrap()}

        {/* 2. Case Lugs */}
        <g id="case-lugs">
          {/* Top-left lug */}
          <path d="M 142 95 L 140 40 L 165 50 L 165 105 Z" fill="url(#metal-grad-case)" stroke="#27272a" strokeWidth="1" />
          {/* Top-right lug */}
          <path d="M 258 95 L 260 40 L 235 50 L 235 105 Z" fill="url(#metal-grad-case)" stroke="#27272a" strokeWidth="1" />
          {/* Bottom-left lug */}
          <path d="M 142 305 L 140 360 L 165 350 L 165 295 Z" fill="url(#metal-grad-case)" stroke="#27272a" strokeWidth="1" />
          {/* Bottom-right lug */}
          <path d="M 258 305 L 260 360 L 235 350 L 235 295 Z" fill="url(#metal-grad-case)" stroke="#27272a" strokeWidth="1" />
        </g>

        {/* 3. Crown & Chronograph Pushers */}
        <g id="crown-and-pushers">
          {/* Winding Crown at 3 o'clock */}
          <path d="M 300 190 L 314 192 L 314 208 L 300 210 Z" fill="url(#metal-grad-highlight)" stroke="#27272a" strokeWidth="1" />
          {/* Crown ridging */}
          {[193, 196, 199, 202, 205, 207].map(y => (
            <line key={`crown-ridge-${y}`} x1="304" y1={y} x2="313" y2={y} stroke="#18181b" strokeWidth="1.2" />
          ))}

          {/* Chrono Pushers at 2 and 4 o'clock (if chronograph complication selected) */}
          {hasChronograph && (
            <>
              <path d="M 288 140 L 298 135 L 304 145 L 294 150 Z" fill="url(#metal-grad-highlight)" stroke="#27272a" strokeWidth="1" />
              <path d="M 294 250 L 304 255 L 298 265 L 288 260 Z" fill="url(#metal-grad-highlight)" stroke="#27272a" strokeWidth="1" />
            </>
          )}
        </g>

        {/* 4. Case Body Outer Ring */}
        <circle cx="200" cy="200" r="104" fill="url(#metal-grad-case)" stroke="#18181b" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="101" fill="none" stroke="url(#metal-grad-highlight)" strokeWidth="0.8" />

        {/* 5. Dial or Exhibition Caseback */}
        {isExhibitionBack ? (
          renderExhibitionBack()
        ) : (
          <>
            {/* Bezel */}
            {renderBezel()}

            {/* Dial Texture */}
            {renderDialTexture()}

            {/* Dial Applied Indices */}
            {renderDialIndices()}

            {/* Complications */}
            {renderComplications()}

            {/* Watch Hands */}
            {renderHands()}

            {/* Center Pin & Cap */}
            <circle cx="200" cy="200" r="4.5" fill="url(#metal-grad-highlight)" stroke="#18181b" strokeWidth="0.8" />
            <circle cx="200" cy="200" r="1.5" fill="#e11d48" /> {/* Center jewel */}

            {/* 6. Sapphire Crystal Anti-Reflective Coating & Subtle Glare Arc */}
            <circle cx="200" cy="200" r="88" fill="url(#sapphire-glare)" pointerEvents="none" />
            <path
              d="M 125 155 Q 165 125 215 130 Q 170 145 140 180 Z"
              fill="#ffffff"
              opacity="0.12"
              pointerEvents="none"
            />
          </>
        )}
      </svg>
    </div>
  );
};
