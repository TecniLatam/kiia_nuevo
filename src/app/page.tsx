"use client";

import { useState } from "react";
import { EmotionsGrid } from "@/components/ui/emotions-grid";
import { motion } from "framer-motion";
import { KiiaChatCard } from "@/components/sections/kiia-chat-card";
import { BoostModuleCard } from "@/components/sections/boost-module-card";
import { Lightbulb, CheckCircle } from "lucide-react";

const examplePlan = [
  {
    title: "1 Minuto de Respiración Consciente:",
    description:
      "Cierra los ojos, inhala profundamente contando hasta cuatro, exhala lentamente contando hasta seis. Repite esto durante un minuto. Enfócate en el aire que entra y sale de tu cuerpo. Esto te ayudará a calmarte y centrarte.",
  },
  {
    title: "Mensaje de Afirmación:",
    description:
      'Repite para ti mismo/a: "Soy fuerte y capaz de superar este sentimiento. Merezco sentir alegría y paz."',
  },
  {
    title: "Ejercicio de Gratitud (2 Minutos):",
    description:
      "Escribe en un papel o en tu teléfono tres cosas por las que te sientes agradecido/a hoy. Pueden ser cosas pequeñas, como un rayo de sol o una llamada de un amigo. Enfócate en las emociones positivas que estas cosas te generan.",
  },
  {
    title: "Movimiento Ligero (3 Minutos):",
    description:
      "Ponte de pie y estira tus brazos hacia el cielo, luego inclínate suavemente hacia adelante para tocar tus dedos de los pies (si puedes). Repite esto varias veces. El movimiento ayuda a liberar endorfinas, que pueden mejorar tu estado de ánimo.",
  },
  {
    title: "Conexión (1 Minuto):",
    description:
      "Llama o envía un mensaje a un amigo o familiar con quien te sientas cómodo/a. Compartir tus sentimientos puede aliviar la tristeza.",
  },
];

const emotions = [
  { emotion: "feliz", name: "Feliz" },
  { emotion: "tranquilo", name: "Tranquilo" },
  { emotion: "neutral", name: "Neutral" },
  { emotion: "triste", name: "Triste" },
  { emotion: "ansioso", name: "Ansioso" },
  { emotion: "enojado", name: "Enojado" },
];

export default function Home() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [faith, setFaith] = useState(false);

  const selectedEmotionName = emotions.find(e => e.emotion === selectedEmotion)?.name;

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
        {!selectedEmotion && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">¿Cómo te sientes hoy?</h2>
              <p className="text-lg text-gray-300 mb-4">Selecciona tu estado emocional actual</p>
            </motion.div>
            <EmotionsGrid onSelect={setSelectedEmotion} />
          </>
        )}
        {selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto bg-white/10 rounded-2xl shadow-lg p-8 border border-white/10 backdrop-blur-lg mt-4"
          >
            <div className="flex flex-col items-center mb-4">
              <Lightbulb className="h-8 w-8 text-primary mb-2" />
              <h2 className="text-3xl font-bold text-white mb-1">Tu Plan de Acción Personalizado</h2>
              <p className="text-lg text-gray-200">Basado en tu estado de ánimo: <span className="font-bold text-primary">{selectedEmotionName}</span></p>
              <div className="flex items-center gap-2 mt-4">
                <label htmlFor="faith-switch" className="text-gray-200 text-base select-none">Incluir afirmaciones basadas en la fe</label>
                <input
                  id="faith-switch"
                  type="checkbox"
                  checked={faith}
                  onChange={() => setFaith(!faith)}
                  className="accent-primary w-5 h-5 rounded-full border-2 border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
            <div className="bg-white/20 rounded-xl p-6 mb-6">
              <p className="text-gray-100 mb-4">Entiendo que te sientes {selectedEmotionName?.toLowerCase()}. Aquí tienes un plan de acción para ayudarte a sentirte mejor:</p>
              <ul className="space-y-4">
                {examplePlan.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <input type="radio" name="plan-step" className="mt-1 accent-primary" />
                    <div>
                      <span className="font-bold text-white">{item.title}</span>
                      <span className="text-gray-200"> {item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
              <button
                className="gradient-button px-8 py-3 text-lg font-semibold"
                onClick={() => {}}
              >
                Regenerar Plan
              </button>
              <button
                className="gradient-button px-8 py-3 text-lg font-semibold bg-gradient-to-r from-gray-500 to-gray-700"
                onClick={() => setSelectedEmotion(null)}
              >
                Volver a Inicio
              </button>
            </div>
          </motion.div>
        )}
      </div>
      {!selectedEmotion && (
        <div className="z-10 w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <KiiaChatCard />
          <BoostModuleCard />
        </div>
      )}
    </main>
  );
}
