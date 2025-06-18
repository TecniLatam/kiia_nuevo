
"use client";

import { useState, useRef, useEffect, FormEvent } from 'react';
import { provideEmotionalSupportKiia, ProvideEmotionalSupportKiiaInput } from '@/ai/flows/provide-emotional-support-kiia';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'kiia';
  timestamp: Date;
}

export function KaiChatInterface() { // Component name can remain generic or be changed if desired
  const searchParams = useSearchParams();
  const initialCrisisMode = searchParams.get('mode') === 'crisis';

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisisMode, setIsCrisisMode] = useState(initialCrisisMode); 

  const scrollAreaRootRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    if (initialCrisisMode && messages.length === 0) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Hola, KIIA está aquí para ayudarte. Entiendo que puedes estar pasando por un momento difícil. Por favor, cuéntame qué sucede, estoy aquí para escucharte y apoyarte.",
          sender: 'kiia',
          timestamp: new Date(),
        }
      ]);
    }
  }, [initialCrisisMode, messages.length]);

  useEffect(() => {
    if (scrollAreaRootRef.current) {
      const viewport = scrollAreaRootRef.current.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const input: ProvideEmotionalSupportKiiaInput = {
        userInput: userMessage.text,
        isCrisisMode: isCrisisMode, 
        userName: "Usuario" 
      };
      const response = await provideEmotionalSupportKiia(input);
      const kiiaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.responseText,
        sender: 'kiia',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, kiiaMessage]);
    } catch (error) {
      console.error("Error communicating with KIIA:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, parece que tengo problemas para conectarme. Por favor, inténtalo de nuevo más tarde.",
        sender: 'kiia',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[700px] border rounded-xl shadow-lg bg-card overflow-hidden">
      <header className="p-4 border-b bg-card flex justify-between items-center">
        <h2 className="text-xl font-headline text-primary">Conversación con KIIA</h2>
      </header>
      <ScrollArea className="flex-1 p-4 space-y-4" ref={scrollAreaRootRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-end space-x-2 max-w-[80%]",
              msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
            )}
          >
            {msg.sender === 'kiia' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={20} />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "p-3 rounded-lg shadow",
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-muted-foreground rounded-bl-none'
              )}
            >
              <p className="text-sm font-body whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs text-right mt-1 opacity-70">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
             {msg.sender === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length -1]?.sender === 'user' && (
          <div className="flex items-end space-x-2 mr-auto justify-start">
            <Avatar className="h-8 w-8">
               <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={20} />
                </AvatarFallback>
            </Avatar>
            <div className="p-3 rounded-lg shadow bg-muted text-muted-foreground rounded-bl-none">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t bg-card flex items-center space-x-2">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Escribe tu mensaje a KIIA..."
          className="flex-1 focus-visible:ring-primary font-body"
          disabled={isLoading}
          aria-label="Mensaje para KIIA"
        />
        <Button type="submit" disabled={isLoading || !userInput.trim()} className="bg-primary hover:bg-primary/90">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          <span className="sr-only">Enviar</span>
        </Button>
      </form>
    </div>
  );
}
