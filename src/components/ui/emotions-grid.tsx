"use client";

import { useState } from "react";
import { EmotionCard } from "./emotion-card";

const emotions = [
  {
    emotion: "feliz",
    icon: "😊",
    name: "Feliz",
    description: "Me siento bien y positivo",
  },
  {
    emotion: "tranquilo",
    icon: "😌",
    name: "Tranquilo",
    description: "En paz y relajado",
  },
  {
    emotion: "neutral",
    icon: "😐",
    name: "Neutral",
    description: "Sin emociones fuertes",
  },
  {
    emotion: "triste",
    icon: "😢",
    name: "Triste",
    description: "Me siento decaído",
  },
  {
    emotion: "ansioso",
    icon: "😰",
    name: "Ansioso",
    description: "Preocupado o nervioso",
  },
  {
    emotion: "enojado",
    icon: "😠",
    name: "Enojado",
    description: "Molesto o frustrado",
  },
];

interface EmotionsGridProps {
  compact?: boolean;
  onSelect?: (emotion: string) => void;
}

export function EmotionsGrid({ compact, onSelect }: EmotionsGridProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const handleSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    if (onSelect) onSelect(emotion);
  };

  return (
    <div className={`grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'}`}>
      {emotions.map((emotion) => (
        <EmotionCard
          key={emotion.emotion}
          {...emotion}
          isSelected={selectedEmotion === emotion.emotion}
          onClick={() => handleSelect(emotion.emotion)}
          compact={compact}
        />
      ))}
    </div>
  );
} 