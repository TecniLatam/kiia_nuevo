"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EmotionCardProps {
  emotion: string;
  icon: string;
  name: string;
  description: string;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const emotionStyles = {
  feliz: {
    color: "#ffd700",
    glow: "rgba(255, 215, 0, 0.4)",
    bg: "rgba(255, 215, 0, 0.1)",
  },
  tranquilo: {
    color: "#4ecdc4",
    glow: "rgba(78, 205, 196, 0.4)",
    bg: "rgba(78, 205, 196, 0.1)",
  },
  neutral: {
    color: "#95a5a6",
    glow: "rgba(149, 165, 166, 0.4)",
    bg: "rgba(149, 165, 166, 0.1)",
  },
  triste: {
    color: "#3498db",
    glow: "rgba(52, 152, 219, 0.4)",
    bg: "rgba(52, 152, 219, 0.1)",
  },
  ansioso: {
    color: "#e74c3c",
    glow: "rgba(231, 76, 60, 0.4)",
    bg: "rgba(231, 76, 60, 0.1)",
  },
  enojado: {
    color: "#ff4500",
    glow: "rgba(255, 69, 0, 0.4)",
    bg: "rgba(255, 69, 0, 0.1)",
  },
};

export function EmotionCard({
  emotion,
  icon,
  name,
  description,
  isSelected,
  onClick,
  compact,
}: EmotionCardProps) {
  const styles = emotionStyles[emotion as keyof typeof emotionStyles];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 text-center cursor-pointer transition-all duration-300",
        "bg-white/5 backdrop-blur-lg border border-white/10",
        "hover:shadow-lg hover:border-opacity-50",
        isSelected && "scale-105 shadow-xl",
        "group"
      )}
      style={{
        borderColor: isSelected ? styles.color : "rgba(255, 255, 255, 0.1)",
        boxShadow: isSelected ? `0 0 30px ${styles.glow}` : "none",
        background: isSelected ? styles.bg : "rgba(255, 255, 255, 0.05)",
      }}
      onClick={onClick}
    >
      <div className="relative">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${styles.color}20, transparent)`,
            transform: "translateX(-100%)",
          }}
        />
        <div
          className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110"
          style={{ filter: `drop-shadow(0 0 10px ${styles.glow})` }}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">{name}</h3>
        {!compact && <p className="text-sm text-gray-400">{description}</p>}
      </div>
    </motion.div>
  );
} 