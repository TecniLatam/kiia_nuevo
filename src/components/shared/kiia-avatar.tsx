"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface KiiaAvatarProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  emotion?: 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral';
  size?: 'small' | 'medium' | 'large';
}

// Generador de partículas simples con valores determinísticos
function NeonParticles({ color }: { color: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Valores determinísticos basados en el índice para evitar errores de hidratación
  const particles = Array.from({ length: 8 }, (_, i) => ({
    angle: (i * 360) / 8,
    radius: 80 + (i * 2.5), // Valores determinísticos en lugar de Math.random()
    size: 8 + (i % 3) * 2, // Valores determinísticos
    duration: 3 + (i % 2) * 1.5, // Valores determinísticos
  }));

  // No renderizar hasta que estemos en el cliente
  if (!isClient) {
    return <g></g>;
  }

  return (
    <g>
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          cx={100 + p.radius * Math.cos((p.angle * Math.PI) / 180)}
          cy={100 + p.radius * Math.sin((p.angle * Math.PI) / 180)}
          r={p.size}
          fill={color}
          initial={{ opacity: 0.7, scale: 0.7 }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [0.7, 1.2, 0.7],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: 'loop',
            delay: i * 0.2,
          }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      ))}
    </g>
  );
}

export function KiiaAvatar({ isSpeaking, isListening, emotion = 'neutral', size = 'medium' }: KiiaAvatarProps) {
  // Paleta de colores neón por emoción
  const emotionColors: Record<string, string> = {
    happy: '#fff700',    // Amarillo neón
    sad: '#00e1ff',      // Azul celeste neón
    angry: '#ff0059',    // Rojo neón
    anxious: '#a259ff',  // Violeta neón
    neutral: '#00f0ff',  // Azul/verde neón
  };

  // Colores de acción
  const actionColors = {
    speaking: '#ff00e6', // Rosa neón
    listening: '#39ff14', // Verde neón
  };

  // Color base según emoción
  const baseColor = emotionColors[emotion] || emotionColors.neutral;
  // Prioridad: hablando > escuchando > emoción
  const activeColor = isSpeaking ? actionColors.speaking : isListening ? actionColors.listening : baseColor;
  const haloColor = activeColor;
  const glowStrength = isSpeaking || isListening ? 1.2 : 0.7;

  // Tamaños según la propiedad size
  const sizeClasses = {
    small: 'w-24 h-24 sm:w-20 sm:h-20',
    medium: 'w-60 h-60',
    large: 'w-80 h-80'
  };

  const containerClass = sizeClasses[size];

  // Animación de halo exterior
  const haloVariants = {
    initial: { opacity: 0.7, scale: 1 },
    animate: {
      opacity: [0.7, 1, 0.7],
      scale: [1, 1.15, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: 'loop' as const
      },
    },
  };

  // Animación de pulso para el orbe
  const orbVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.04, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'loop' as const
      },
    },
  };

  // Animación de parpadeo para los ojos
  const eyeVariants = {
    blinking: {
      scaleY: [1, 0.1, 1],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: 5
      },
    },
  };

  return (
    <div className={`relative ${containerClass}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          {/* Degradado neón para el orbe */}
          <radialGradient id="orbGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="60%" stopColor={activeColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
          </radialGradient>
          {/* Halo exterior animado */}
          <radialGradient id="haloGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={haloColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={haloColor} stopOpacity="0" />
          </radialGradient>
          {/* Glow filter */}
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={18 * glowStrength} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Halo exterior */}
        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="url(#haloGradient)"
          style={{ filter: `blur(8px)` }}
          variants={haloVariants}
          initial="initial"
          animate="animate"
        />
        {/* Partículas neón */}
        <NeonParticles color={haloColor} />
        {/* Orbe principal */}
        <motion.circle
          cx="100"
          cy="100"
          r="70"
          fill="url(#orbGradient)"
          filter="url(#neonGlow)"
          variants={orbVariants}
          initial="initial"
          animate="pulse"
        />
        {/* Ojos */}
        <motion.g className="eyes" variants={eyeVariants} animate="blinking">
          <circle cx="80" cy="95" r="8" fill="#fff" />
          <circle cx="120" cy="95" r="8" fill="#fff" />
        </motion.g>
        {/* Boca */}
        <AnimatePresence mode="wait">
          {isSpeaking ? (
            <motion.path
              key="speaking"
              d="M 75 125 Q 100 145 125 125"
              stroke="#fff"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' as const }}
            />
          ) : isListening ? (
            <motion.path
              key="listening"
              d="M 85 130 Q 100 135 115 130"
              stroke="#fff"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' as const }}
            />
          ) : (
            <motion.path
              key="normal"
              d="M 80 130 Q 100 140 120 130"
              stroke="#fff"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' as const }}
            />
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
} 