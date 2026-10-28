import React from 'react';

interface NEXORALogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const NEXORALogo: React.FC<NEXORALogoProps> = ({
  className = '',
  size = 32,
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Distinctive NEXORA Geometric Hexa-Nexus Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform hover:scale-105 duration-200"
      >
        <defs>
          <linearGradient id="nexoraGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="nexoraGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
        
        {/* Outer subtle rounded polygon */}
        <rect
          x="3"
          y="3"
          width="34"
          height="34"
          rx="10"
          className="fill-slate-900 dark:fill-indigo-950/70 stroke-indigo-500/30"
          strokeWidth="1.5"
        />

        {/* Dynamic Nexus "N" path */}
        <path
          d="M12 28V12L20 23V12"
          stroke="url(#nexoraGrad1)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 28V17L28 28V12"
          stroke="url(#nexoraGrad2)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Optical center accent node */}
        <circle cx="20" cy="20" r="2.2" className="fill-indigo-400" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              NEXORA
            </span>
            <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
              HR
            </span>
          </div>
          <span className="text-[9px] font-medium tracking-wider text-slate-600 dark:text-slate-300 uppercase mt-0.5">
            Workforce Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
