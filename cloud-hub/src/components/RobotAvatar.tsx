import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type RobotAvatarProps = {
  size?: number;
  animated?: boolean;
  className?: string;
};

/**
 * A cute friendly robot avatar — with antenna, glowing eyes and chest light.
 * Used as the chatbot mascot.
 */
export function RobotAvatar({ size = 48, animated = true, className }: RobotAvatarProps) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_12px_rgba(59,130,246,0.45)]"
      >
        <defs>
          <linearGradient id="bot-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
          <linearGradient id="bot-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <radialGradient id="bot-eye" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="60%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </radialGradient>
        </defs>

        {/* Antenna */}
        <line x1="32" y1="6" x2="32" y2="14" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" />
        <motion.circle
          cx="32"
          cy="5"
          r="2.5"
          fill="#3b82f6"
          animate={animated ? { opacity: [1, 0.4, 1] } : undefined}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Head body */}
        <rect x="10" y="14" width="44" height="36" rx="10" fill="url(#bot-body)" />
        <rect x="10" y="14" width="44" height="36" rx="10" fill="none" stroke="#1e40af" strokeWidth="1.2" opacity="0.4" />

        {/* Face screen */}
        <rect x="16" y="20" width="32" height="22" rx="6" fill="url(#bot-face)" />
        <rect x="16" y="20" width="32" height="22" rx="6" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.5" />

        {/* Eyes */}
        <motion.circle
          cx="25"
          cy="31"
          r="3.2"
          fill="url(#bot-eye)"
          animate={animated ? { scaleY: [1, 0.15, 1] } : undefined}
          transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }}
          style={{ transformOrigin: "25px 31px" }}
        />
        <motion.circle
          cx="39"
          cy="31"
          r="3.2"
          fill="url(#bot-eye)"
          animate={animated ? { scaleY: [1, 0.15, 1] } : undefined}
          transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }}
          style={{ transformOrigin: "39px 31px" }}
        />

        {/* Smile */}
        <path
          d="M 26 37 Q 32 41 38 37"
          stroke="#60a5fa"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Side bolts / ears */}
        <circle cx="9" cy="32" r="2.2" fill="#1e40af" />
        <circle cx="55" cy="32" r="2.2" fill="#1e40af" />

        {/* Chest light */}
        <motion.circle
          cx="32"
          cy="55"
          r="3"
          fill="#3b82f6"
          animate={animated ? { opacity: [0.6, 1, 0.6] } : undefined}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="32" cy="55" r="4.5" fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.4" />
      </svg>
    </div>
  );
}
