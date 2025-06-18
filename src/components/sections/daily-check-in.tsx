"use client";

import { useState } from 'react';
import { Smile, Frown, Meh, Angry, Laugh, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface EmojiOption {
  name: string;
  icon: React.ElementType;
  description: string;
}

const emojiOptions: EmojiOption[] = [
  { name: 'Feliz', icon: Laugh, description: 'Me siento alegre y positivo.' },
  { name: 'Tranquilo', icon: Smile, description: 'Me siento calmado y en paz.' },
  { name: 'Neutral', icon: Meh, description: 'No me siento particularmente bien ni mal.' },
  { name: 'Triste', icon: Frown, description: 'Me siento decaído o triste.' },
  { name: 'Ansioso', icon: HeartPulse, description: 'Me siento inquieto o ansioso.' },
  { name: 'Enojado', icon: Angry, description: 'Me siento irritado o enojado.' },
];

export function DailyCheckIn({ onCheckInComplete }: { onCheckInComplete?: (mood: string) => void }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const router = useRouter();

  const handleMoodSelect = (moodName: string) => {
    setSelectedMood(moodName);
    if (onCheckInComplete) {
      onCheckInComplete(moodName);
    } else {
      // Default behavior if no callback is provided, e.g., navigate to action plan
      router.push(`/action-plan?mood=${encodeURIComponent(moodName)}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline text-primary">Diagnóstico Diario</CardTitle>
        <CardDescription className="text-lg text-muted-foreground font-body">
          ¿Cómo te sientes hoy? Selecciona una emoción.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {emojiOptions.map((emoji) => {
            const Icon = emoji.icon;
            return (
              <Button
                key={emoji.name}
                variant="outline"
                className={cn(
                  "flex flex-col items-center justify-center p-4 h-32 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105",
                  "border-2",
                  selectedMood === emoji.name
                    ? 'bg-accent border-primary text-primary-foreground shadow-md'
                    : 'bg-card hover:bg-accent/50 hover:border-accent-foreground'
                )}
                onClick={() => handleMoodSelect(emoji.name)}
                aria-pressed={selectedMood === emoji.name}
                aria-label={`Seleccionar estado de ánimo: ${emoji.name}`}
              >
                <Icon className={cn("w-12 h-12 mb-2", selectedMood === emoji.name ? "text-primary-foreground" : "text-primary")} />
                <span className={cn("text-sm font-medium font-body", selectedMood === emoji.name ? "text-primary-foreground" : "text-foreground")}>{emoji.name}</span>
              </Button>
            );
          })}
        </div>
        {selectedMood && (
          <p className="text-center text-muted-foreground font-body italic mt-4">
            Has seleccionado: {selectedMood}. Tu plan de acción se basará en esto.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
