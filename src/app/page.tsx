"use client";

import { useState } from "react";
import { EmotionsGrid } from "@/components/ui/emotions-grid";
import { motion } from "framer-motion";
import { KiiaChatCard } from "@/components/sections/kiia-chat-card";
import { BoostModuleCard } from "@/components/sections/boost-module-card";
import { useRouter } from 'next/navigation';

const emotions = [
  { emotion: "feliz", name: "Feliz" },
  { emotion: "tranquilo", name: "Tranquilo" },
  { emotion: "neutral", name: "Neutral" },
  { emotion: "triste", name: "Triste" },
  { emotion: "ansioso", name: "Ansioso" },
  { emotion: "enojado", name: "Enojado" },
];

export default function Home() {
  const router = useRouter();

  const handleEmotionSelect = (emotion: string) => {
    // Redirigir al chat de KIIA con el parámetro de la emoción
    router.push(`/kiia-chat?emotion=${emotion}`);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181f2a] via-[#232b3b] to-[#1a2233]">
      <div className="z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center py-12">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 bg-clip-text text-transparent mb-2 drop-shadow-lg"
        >
          KIIA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-200 mb-8 font-medium"
        >
          Tu compañía emocional
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">¿Cómo te sientes hoy?</h2>
          <p className="text-lg text-gray-300 mb-4">Selecciona tu estado emocional actual y habla con KIIA</p>
        </motion.div>
        
        <EmotionsGrid onSelect={handleEmotionSelect} />
      </div>
      
      <div className="z-10 w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <KiiaChatCard />
        <BoostModuleCard />
      </div>
    </main>
  );
}
