"use client";

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send, User, Bot, Mic, StopCircle, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { KiiaAvatar } from '@/components/shared/kiia-avatar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'kiia';
  timestamp: Date;
  kiiaResponse?: string; // Respuesta de Kiia asociada al mensaje del usuario
}

// SpeechRecognition might not be available on the window object on the server side
const SpeechRecognition =
  typeof window !== 'undefined' ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

// Respuestas temporales para cuando no hay API configurada
const getTemporaryResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  if (input.includes('hola') || input.includes('buenos días') || input.includes('buenas')) {
    return "¡Hola! Soy KIIA, tu compañera de apoyo emocional. Estoy aquí para escucharte y ayudarte. ¿Cómo te sientes hoy?";
  }
  
  if (input.includes('triste') || input.includes('deprimido') || input.includes('mal')) {
    return "Entiendo que te sientes así. Es completamente normal tener días difíciles. ¿Te gustaría contarme más sobre lo que te está pasando? Estoy aquí para escucharte sin juzgarte.";
  }
  
  if (input.includes('estrés') || input.includes('ansiedad') || input.includes('nervioso')) {
    return "El estrés y la ansiedad pueden ser muy abrumadores. Te sugiero que respires profundamente por unos momentos. ¿Qué te está causando esta sensación? Juntos podemos encontrar formas de manejarlo.";
  }
  
  if (input.includes('gracias') || input.includes('grax')) {
    return "¡De nada! Estoy aquí para ti siempre que lo necesites. Recuerda que no estás solo en esto.";
  }
  
  if (input.includes('ayuda') || input.includes('ayúdame')) {
    return "Por supuesto, estoy aquí para ayudarte. ¿En qué puedo asistirte hoy? Puedes contarme cualquier cosa que tengas en mente.";
  }
  
  if (input.includes('feliz') || input.includes('contento') || input.includes('bien')) {
    return "¡Me alegra mucho saber que te sientes bien! Es importante celebrar esos momentos positivos. ¿Qué te está haciendo sentir así?";
  }
  
  if (input.includes('amor') || input.includes('relación') || input.includes('pareja')) {
    return "Las relaciones pueden ser complejas y hermosas al mismo tiempo. ¿Te gustaría hablar más sobre esto? Estoy aquí para escucharte.";
  }
  
  if (input.includes('trabajo') || input.includes('empleo') || input.includes('carrera')) {
    return "El trabajo puede ser una fuente importante de satisfacción y también de estrés. ¿Cómo te sientes con tu situación laboral actual?";
  }
  
  return "Gracias por compartir eso conmigo. Es importante que tengas un espacio seguro para expresarte. ¿Hay algo más específico en lo que pueda ayudarte hoy?";
};

export function KiiaChatInterface() {
  const searchParams = useSearchParams();
  const initialCrisisMode = searchParams.get('mode') === 'crisis';

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisisMode, setIsCrisisMode] = useState(initialCrisisMode);
  
  // State for voice functionality
  const [isRecording, setIsRecording] = useState(false);
  const [isKiiaSpeaking, setIsKiiaSpeaking] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const scrollAreaRootRef = useRef<HTMLDivElement>(null);

  // Efecto para asegurar que el código del cliente solo se ejecuta en el cliente
  useEffect(() => {
    setIsClient(true);
    
    // Verificar si el navegador soporta reconocimiento de voz
    if (typeof window !== 'undefined') {
      if (!SpeechRecognition) {
        setSpeechError("Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.");
        console.warn("Speech recognition not supported in this browser.");
      } else {
        console.log("Speech recognition is available");
      }
    }
  }, []);

  // Function to read a message aloud
  const speak = (text: string) => {
    // Verificar que estemos en el cliente
    if (typeof window === 'undefined') {
      return;
    }
    
    // Verificar que la síntesis de voz esté disponible
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not available");
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
    } catch (error) {
      console.warn("Error canceling speech:", error);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsKiiaSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsKiiaSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.warn("Speech synthesis error:", event.error);
      setIsKiiaSpeaking(false);
      // No hacer nada más, solo silenciar el error
    };

    // Intentar reproducir la voz
    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn("Speech synthesis failed:", error);
      setIsKiiaSpeaking(false);
    }
  };

  // Setup speech recognition
  useEffect(() => {
    console.log("Setting up speech recognition...");
    console.log("SpeechRecognition available:", !!SpeechRecognition);
    
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      setSpeechError("Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.");
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      console.log("Recognition object created:", recognition);
      
      recognition.continuous = false;
      recognition.lang = 'es-ES';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("🎤 Speech recognition STARTED - Habla ahora!");
        setIsRecording(true);
        setSpeechError(null);
      };

      recognition.onresult = async (event: any) => {
        console.log("🎯 Speech recognition RESULT:", event);
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log("📝 Transcript:", transcript);
        setIsRecording(false);
        
        if (transcript && transcript.trim()) {
          // Procesar respuesta primero
          const responseText = getTemporaryResponse(transcript);
          console.log("🤖 KIIA response:", responseText);
          
          // Agregar mensaje del usuario con la respuesta de KIIA
          const userMessage: Message = {
            id: `user-voice-${Date.now()}`,
            text: transcript,
            sender: 'user',
            timestamp: new Date(),
            kiiaResponse: responseText, // Guardar la respuesta de KIIA
          };
          setMessages(prev => [...prev, userMessage]);
          
          setIsLoading(true);
          setTimeout(() => {
            const kiiaMessage: Message = {
              id: `kiia-${Date.now()}`,
              text: responseText,
              sender: 'kiia',
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, kiiaMessage]);
            setIsLoading(false);
            
            // Restaurar la reproducción automática con manejo de errores
            try {
              console.log("🔊 Attempting to speak response...");
              speak(responseText);
            } catch (error) {
              console.warn("⚠️ Speech failed, but chat continues normally");
            }
          }, 1000);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error("❌ Speech recognition ERROR:", event.error);
        setIsRecording(false);
        
        let errorMessage = "Error en el reconocimiento de voz";
        switch (event.error) {
          case 'not-allowed':
            errorMessage = "🚫 Permiso denegado para el micrófono. Por favor, permite el acceso al micrófono en tu navegador.";
            break;
          case 'no-speech':
            errorMessage = "🔇 No se detectó voz. Por favor, habla más cerca del micrófono.";
            break;
          case 'audio-capture':
            errorMessage = "🎤 No se puede acceder al micrófono. Verifica que tu micrófono esté conectado y funcionando.";
            break;
          case 'network':
            errorMessage = "🌐 Error de red. Verifica tu conexión a internet.";
            break;
          default:
            errorMessage = `❌ Error: ${event.error}`;
        }
        setSpeechError(errorMessage);
      };
      
      recognition.onend = () => {
        console.log("⏹️ Speech recognition ENDED");
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
      console.log("✅ Speech recognition setup complete");
    } catch (error) {
      console.error("❌ Error setting up speech recognition:", error);
      setSpeechError("Error al configurar el reconocimiento de voz");
    }
  }, []);

  // Handle microphone button click
  const handleMicClick = () => {
    console.log("Mic button clicked, isRecording:", isRecording);
    
    if (!recognitionRef.current) {
      setSpeechError("Reconocimiento de voz no disponible");
      return;
    }

    try {
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        setUserInput('');
        setSpeechError(null);
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error("Error handling mic click:", error);
      setSpeechError("Error al activar el micrófono");
    }
  };

  useEffect(() => {
    // Ya no mostrar mensaje de bienvenida automático
  }, []);

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

    const responseText = getTemporaryResponse(userInput);
    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: userInput,
      sender: 'user',
      timestamp: new Date(),
      kiiaResponse: responseText, // Guardar la respuesta de Kiia
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simular delay para que parezca que está procesando
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usar respuesta temporal en lugar de la API
      const kiiaMessage: Message = {
        id: `kiia-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: responseText,
        sender: 'kiia',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, kiiaMessage]);
      // Restaurar la reproducción automática con manejo de errores
      try {
        speak(responseText);
      } catch (error) {
        console.warn("⚠️ Speech failed, but chat continues normally");
      }
    } catch (error) {
      console.error("Error communicating with KIIA:", error);
      const errorMessageText = "Lo siento, parece que tengo problemas para conectarme. Por favor, inténtalo de nuevo más tarde.";
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: errorMessageText,
        sender: 'kiia',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      speak(errorMessageText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-card overflow-hidden">
      {/* Avatar y área de mensajes combinados */}
      <div className="flex-1 flex flex-col justify-end p-4 relative min-h-0">
        {/* Fondo del chat con avatar centrado */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <KiiaAvatar isSpeaking={isKiiaSpeaking} isListening={isRecording} />
        </div>

        {/* ScrollArea para los mensajes, sobre el fondo */}
        <ScrollArea className="w-full h-full flex-1 z-10 min-h-0" ref={scrollAreaRootRef}>
          <div className="space-y-4 pt-48">
            {messages.filter(msg => msg.sender === 'user').map((msg) => (
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
                  <div className="flex items-center space-x-1">
                    {msg.kiiaResponse && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => speak(msg.kiiaResponse!)}
                        className="h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                        title="Escuchar respuesta de Kiia"
                      >
                        <Volume2 className="h-4 w-4" />
                        <span className="sr-only">Escuchar respuesta de Kiia</span>
                      </Button>
                    )}
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                  </div>
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
          </div>
        </ScrollArea>
      </div>

      {/* Barra de entrada de texto */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-card flex items-center space-x-2">
        {speechError && (
          <div className="absolute bottom-20 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {speechError}
          </div>
        )}
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={isRecording ? "Escuchando..." : "Escribe o habla con KIIA..."}
          className="flex-1 focus-visible:ring-primary font-body"
          disabled={isLoading || isRecording}
          aria-label="Mensaje para KIIA"
        />
        {isClient && SpeechRecognition && (
          <Button type="button" size="icon" onClick={handleMicClick} disabled={isLoading} className={cn("bg-purple-500 hover:bg-purple-600 text-white shadow-md", isRecording && "bg-red-500 hover:bg-red-600")}>
            {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            <span className="sr-only">{isRecording ? "Dejar de grabar" : "Grabar voz"}</span>
          </Button>
        )}
        {isClient && !SpeechRecognition && (
          <Button 
            type="button" 
            size="icon" 
            onClick={() => {
              alert("Tu navegador no soporta reconocimiento de voz. Por favor, usa Chrome o Edge.");
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white"
            title="Reconocimiento de voz no disponible"
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
        {speechError && (
          <Button 
            type="button" 
            size="icon" 
            onClick={() => setSpeechError(null)}
            className="bg-red-500 hover:bg-red-600 text-white"
            title="Cerrar mensaje de error"
          >
            <span className="text-xs">×</span>
          </Button>
        )}
        <Button type="submit" disabled={isLoading || !userInput.trim()} className="bg-primary hover:bg-primary/90">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          <span className="sr-only">Enviar</span>
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="outline"
          onClick={() => {
            const lastKiiaMessage = [...messages].reverse().find(m => m.sender === 'kiia');
            if (lastKiiaMessage) {
              speak(lastKiiaMessage.text);
            }
          }}
          disabled={!messages.some(m => m.sender === 'kiia')}
          className="bg-green-500 hover:bg-green-600 text-white border-green-500 relative"
          title="Reproducir última respuesta de Kiia"
        >
          <Volume2 className="h-5 w-5" />
          {messages.filter(m => m.sender === 'kiia').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {messages.filter(m => m.sender === 'kiia').length}
            </span>
          )}
          <span className="sr-only">Reproducir última respuesta</span>
        </Button>
      </form>
    </div>
  );
} 