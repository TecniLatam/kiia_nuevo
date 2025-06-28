"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from 'next/navigation';

export function KiiaChatCard() {
  const router = useRouter();

  const handleChatStart = () => {
    router.push('/kiia-chat');
  };

  return (
    <div className="bg-white/10 rounded-2xl shadow-lg p-6 flex flex-col gap-4 items-start border border-white/10 backdrop-blur-lg">
      <div className="flex items-center gap-3 mb-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-white">Habla con KIIA</h3>
      </div>
      <p className="text-gray-200 mb-4">KIIA está aquí para escucharte y ofrecerte apoyo emocional.</p>
      <button className="gradient-button w-full" onClick={handleChatStart}>Iniciar Chat</button>
    </div>
  );
} 