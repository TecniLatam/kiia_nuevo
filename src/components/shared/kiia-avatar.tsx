"use client";

import { motion, AnimatePresence } from 'framer-motion';

interface KiiaAvatarProps {
  isSpeaking?: boolean;
  isListening?: boolean;
}

export function KiiaAvatar({ isSpeaking, isListening }: KiiaAvatarProps) {
  // --- Variantes de Animación ---

  // 1. Animación de respiración para el cuerpo
  const bodyVariants = {
    initial: { scale: 1 },
    breathing: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 4,
        ease: "easeInOut" as const,
        repeat: Infinity,
      },
    },
  };

  // 2. Animación de parpadeo para los ojos
  const eyeVariants = {
    blinking: {
      scaleY: [1, 0.1, 1],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: 5, // Parpadea cada 5 segundos
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* --- Definiciones de Filtros y Gradientes --- */}
        <defs>
          {/* Gradiente principal para el cuerpo del avatar */}
          <radialGradient id="avatarGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--primary) / 0.3)', stopOpacity: 1 }} />
          </radialGradient>
          
          {/* 3. El filtro de resplandor ahora reacciona a 'isListening' */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <motion.feGaussianBlur in="SourceGraphic" stdDeviation={isListening ? 15 : 10} result="blur" transition={{ duration: 0.5 }}/>
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- Cuerpo del Avatar --- */}
        <motion.g 
          filter="url(#glow)"
          variants={bodyVariants}
          animate="breathing"
        >
          <circle cx="100" cy="100" r="80" fill="url(#avatarGradient)" />
        </motion.g>
        
        {/* --- Ojos --- */}
        <motion.g className="eyes" variants={eyeVariants} animate="blinking">
            {/* Ojo Izquierdo */}
            <circle cx="80" cy="95" r="8" fill="white" />
            {/* Ojo Derecho */}
            <circle cx="120" cy="95" r="8" fill="white" />
        </motion.g>

        {/* --- Boca --- */}
        <AnimatePresence mode="wait">
          {isSpeaking ? (
            // Boca abierta cuando está hablando
            <motion.path
              key="speaking"
              d="M 75 125 Q 100 145 125 125"
              stroke="white"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' as const }}
            />
          ) : isListening ? (
            // Boca pequeña cuando está escuchando
            <motion.path
              key="listening"
              d="M 85 130 Q 100 135 115 130"
              stroke="white"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' as const }}
            />
          ) : (
            // Boca normal cuando está en reposo
            <motion.path
              key="normal"
              d="M 80 130 Q 100 140 120 130"
              stroke="white"
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