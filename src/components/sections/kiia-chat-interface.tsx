"use client";

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send, User, Bot, Mic, StopCircle, Volume2 } from 'lucide-react';
import { cn, detectEmotionFromText } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { KiiaAvatar } from '@/components/shared/kiia-avatar';
import { useIsMobile } from '@/hooks/use-mobile';

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
const getTemporaryResponse = (userInput: string, initialEmotion?: string): string => {
  const input = userInput.toLowerCase();
  
  // Si hay una emoción inicial, dar respuestas más específicas
  if (initialEmotion) {
    switch (initialEmotion) {
      case 'triste':
        if (input.includes('no sé') || input.includes('no se que hacer')) {
          return "Entiendo que cuando estás triste puede ser difícil saber qué hacer. Te sugiero empezar con algo pequeño: ¿podrías tomar una ducha caliente o salir a caminar por 5 minutos? A veces los pequeños pasos son los más importantes.";
        }
        if (input.includes('solo') || input.includes('sola')) {
          return "Sé que te sientes solo/a, pero quiero que sepas que no estás realmente solo/a. Estoy aquí contigo, y hay personas que se preocupan por ti. ¿Te gustaría que exploremos juntos formas de conectar con otros?";
        }
        break;
      
      case 'ansioso':
        if (input.includes('preocupado') || input.includes('miedo')) {
          return "La ansiedad puede hacer que todo se sienta más grande de lo que es. Vamos a hacer un ejercicio juntos: respira profundamente contando hasta 4, mantén por 4, exhala por 6. ¿Te gustaría que te guíe en esto?";
        }
        if (input.includes('no puedo') || input.includes('no puedo más')) {
          return "Sé que te sientes abrumado/a, pero eres más fuerte de lo que crees. Vamos a dividir esto en pasos más pequeños. ¿Qué es lo más urgente que necesitas manejar ahora mismo?";
        }
        break;
      
      case 'enojado':
        if (input.includes('molesto') || input.includes('frustrado')) {
          return "Es natural sentir enojo cuando las cosas no salen como esperamos. ¿Te gustaría contarme qué pasó? A veces hablar sobre ello puede ayudar a procesar estos sentimientos de manera más saludable.";
        }
        break;
      
      case 'feliz':
        if (input.includes('gracias') || input.includes('ayuda')) {
          return "¡Me alegra mucho haber podido ayudarte! Es hermoso ver que estás de buen ánimo. ¿Hay algo más en lo que pueda asistirte para mantener esta energía positiva?";
        }
        break;
    }
  }
  
  // Respuestas generales
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
  const emotionParam = searchParams.get('emotion');
  const isMobile = useIsMobile();

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCrisisMode, setIsCrisisMode] = useState(initialCrisisMode);
  
  // State for voice functionality
  const [isRecording, setIsRecording] = useState(false);
  const [isKiiaSpeaking, setIsKiiaSpeaking] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [canRecord, setCanRecord] = useState(true);
  const [shouldProcessResult, setShouldProcessResult] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const scrollAreaRootRef = useRef<HTMLDivElement>(null);

  const [emotion, setEmotion] = useState<'happy' | 'sad' | 'angry' | 'anxious' | 'neutral'>('neutral');

  // Función para generar mensaje inicial según la emoción
  const getInitialMessage = (emotion: string): string => {
    switch (emotion) {
      case 'feliz':
        return "¡Hola! Veo que te sientes feliz hoy. ¡Qué maravilloso! Me encanta cuando las personas están de buen ánimo. ¿Qué te está haciendo sentir así? Me gustaría celebrar contigo este momento positivo.";
      
      case 'tranquilo':
        return "Hola, noto que te sientes tranquilo. Es un estado muy hermoso y equilibrado. ¿Te gustaría compartir qué te está dando esa sensación de paz? Estoy aquí para acompañarte en este momento sereno.";
      
      case 'neutral':
        return "Hola, veo que te sientes neutral hoy. A veces necesitamos esos momentos de calma para procesar nuestros pensamientos. ¿Hay algo en particular en lo que te gustaría reflexionar o hablar?";
      
      case 'triste':
        return "Hola, veo que te sientes triste hoy. Quiero que sepas que es completamente normal tener días difíciles y que no estás solo. ¿Te gustaría contarme qué está pasando? Estoy aquí para escucharte sin juzgarte.";
      
      case 'ansioso':
        return "Hola, noto que estás sintiendo ansiedad. Esta sensación puede ser muy abrumadora, pero juntos podemos manejarla. ¿Te gustaría hablar sobre qué te está preocupando? Respira profundamente, estoy aquí contigo.";
      
      case 'enojado':
        return "Hola, veo que te sientes enojado. Es importante reconocer y expresar nuestras emociones de manera saludable. ¿Te gustaría contarme qué te está molestando? Estoy aquí para escucharte y ayudarte a procesar estos sentimientos.";
      
      default:
        return "¡Hola! Soy KIIA, tu compañera de apoyo emocional. Estoy aquí para escucharte y ayudarte. ¿Cómo te sientes hoy?";
    }
  };

  // Efecto para enviar mensaje inicial si hay emoción
  useEffect(() => {
    if (emotionParam && messages.length === 0) {
      const initialMessage = getInitialMessage(emotionParam);
      const kiiaMessage: Message = {
        id: `kiia-initial-${Date.now()}`,
        text: initialMessage,
        sender: 'kiia',
        timestamp: new Date(),
      };
      setMessages([kiiaMessage]);
      
      // Reproducir el mensaje inicial
      setTimeout(() => {
        try {
          speak(initialMessage);
        } catch (error) {
          console.warn("Error speaking initial message:", error);
        }
      }, 500);
    }
  }, [emotionParam, messages.length]);

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
      
      // Cargar las voces disponibles para síntesis de voz
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log("🎤 Voces disponibles:", voices.map(v => `${v.name} (${v.lang})`));
        
        // Buscar voces femeninas en español
        const femaleVoices = voices.filter(voice => 
          voice.lang.includes('es') && 
          (voice.name.toLowerCase().includes('maria') || 
           voice.name.toLowerCase().includes('helena') ||
           voice.name.toLowerCase().includes('ana') ||
           voice.name.toLowerCase().includes('carmen') ||
           voice.name.toLowerCase().includes('sofia') ||
           voice.name.toLowerCase().includes('isabella') ||
           voice.name.toLowerCase().includes('lucia') ||
           voice.name.toLowerCase().includes('paula') ||
           voice.name.toLowerCase().includes('elena') ||
           voice.name.toLowerCase().includes('monica') ||
           voice.name.toLowerCase().includes('patricia') ||
           voice.name.toLowerCase().includes('claudia'))
        );
        
        // Buscar voces masculinas para comparar
        const maleVoices = voices.filter(voice => 
          voice.lang.includes('es') && 
          (voice.name.toLowerCase().includes('juan') ||
           voice.name.toLowerCase().includes('carlos') ||
           voice.name.toLowerCase().includes('pedro') ||
           voice.name.toLowerCase().includes('miguel') ||
           voice.name.toLowerCase().includes('antonio'))
        );
        
        if (femaleVoices.length > 0) {
          console.log("🎤 Voces femeninas encontradas:", femaleVoices.map(v => v.name));
        } else {
          console.log("🎤 No se encontraron voces femeninas específicas");
        }
        
        if (maleVoices.length > 0) {
          console.log("🎤 Voces masculinas encontradas:", maleVoices.map(v => v.name));
        }
        
        // Mostrar todas las voces en español
        const spanishVoices = voices.filter(voice => voice.lang.includes('es'));
        console.log("🎤 Todas las voces en español:", spanishVoices.map(v => v.name));
        
        console.log("🎤 Configuración de voz optimizada para KIIA");
      };
      
      // Cargar voces inmediatamente si están disponibles
      loadVoices();
      
      // También cargar cuando las voces cambien
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Function to read a message aloud
  const speak = (text: string) => {
    // Verificar que estemos en el cliente
    if (typeof window === 'undefined') {
      return;
    }
    
    // Desactivar grabación mientras KIIA habla
    setCanRecord(false);
    
    // Detener completamente el reconocimiento de voz si está activo
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
      } catch (e) {
        console.warn('No se pudo detener el reconocimiento de voz:', e);
      }
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
    
    // Configuración mejorada para una voz más femenina y natural
    utterance.rate = 0.85; // Velocidad ligeramente más lenta para mayor claridad
    utterance.pitch = 1.5; // Tono muy alto para voz claramente femenina
    utterance.volume = 1.0;
    
    // Intentar seleccionar una voz femenina específica
    const voices = window.speechSynthesis.getVoices();
    
    // Priorizar voces femeninas con nombres específicos
    let femaleVoice = voices.find(voice => 
      voice.lang.includes('es') && 
      (voice.name.toLowerCase().includes('maria') || 
       voice.name.toLowerCase().includes('helena') ||
       voice.name.toLowerCase().includes('ana') ||
       voice.name.toLowerCase().includes('carmen') ||
       voice.name.toLowerCase().includes('sofia') ||
       voice.name.toLowerCase().includes('isabella') ||
       voice.name.toLowerCase().includes('lucia') ||
       voice.name.toLowerCase().includes('paula') ||
       voice.name.toLowerCase().includes('elena') ||
       voice.name.toLowerCase().includes('monica') ||
       voice.name.toLowerCase().includes('patricia') ||
       voice.name.toLowerCase().includes('claudia'))
    );
    
    // Si no encuentra voces con nombres específicos, buscar cualquier voz que contenga "female" o "mujer"
    if (!femaleVoice) {
      femaleVoice = voices.find(voice => 
        voice.lang.includes('es') && 
        (voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('mujer') ||
         voice.name.toLowerCase().includes('woman') ||
         voice.name.toLowerCase().includes('girl'))
      );
    }
    
    // Si aún no encuentra, buscar voces en español que no sean claramente masculinas
    if (!femaleVoice) {
      femaleVoice = voices.find(voice => 
        voice.lang.includes('es') && 
        !voice.name.toLowerCase().includes('juan') &&
        !voice.name.toLowerCase().includes('carlos') &&
        !voice.name.toLowerCase().includes('pedro') &&
        !voice.name.toLowerCase().includes('miguel') &&
        !voice.name.toLowerCase().includes('antonio') &&
        !voice.name.toLowerCase().includes('male') &&
        !voice.name.toLowerCase().includes('hombre') &&
        !voice.name.toLowerCase().includes('man') &&
        !voice.name.toLowerCase().includes('boy')
      );
    }
    
    // Último recurso: cualquier voz en español
    if (!femaleVoice) {
      femaleVoice = voices.find(voice => voice.lang.includes('es'));
    }
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
      console.log("🎤 Usando voz:", femaleVoice.name, "para KIIA (pitch:", utterance.pitch, ")");
    } else {
      console.log("🎤 No se encontró voz en español, usando configuración por defecto");
    }
    
    utterance.onstart = () => {
      setIsKiiaSpeaking(true);
      // Asegurar que el reconocimiento de voz esté completamente detenido
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Error stopping recognition on speech start:', e);
        }
      }
      setIsRecording(false);
    };
    
    utterance.onend = () => {
      setIsKiiaSpeaking(false);
      // Reactivar grabación después de que KIIA termine de hablar
      setCanRecord(true);
    };
    
    utterance.onerror = (event) => {
      console.warn("Speech synthesis error:", event.error);
      setIsKiiaSpeaking(false);
      // Reactivar grabación en caso de error
      setCanRecord(true);
      // No hacer nada más, solo silenciar el error
    };

    // Intentar reproducir la voz
    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn("Speech synthesis failed:", error);
      setIsKiiaSpeaking(false);
      setCanRecord(true);
    }
  };

  // Setup speech recognition
  useEffect(() => {
    console.log("Setting up speech recognition...");
    console.log("SpeechRecognition available:", !!SpeechRecognition);
    console.log("Is mobile:", isMobile);
    
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      setSpeechError("Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.");
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      console.log("Recognition object created:", recognition);
      
      recognition.continuous = true; // Modo continuo para evitar cortes por pausas
      recognition.lang = 'es-ES';
      recognition.interimResults = true; // Habilitar resultados intermedios para capturar texto en tiempo real
      recognition.maxAlternatives = 1;
      
      // Configuraciones específicas para móvil
      if (isMobile) {
        console.log("🔧 Configurando reconocimiento de voz para móvil");
        // En móvil, ser más conservador con los resultados
        recognition.continuous = false; // En móvil, usar modo no continuo para evitar duplicación
        recognition.interimResults = false; // Solo resultados finales en móvil
      }
      
      // Configuraciones adicionales para ser más tolerante con pausas
      if (recognition.grammar) {
        // Si el navegador soporta gramáticas, podemos configurar tiempo de espera
        console.log("Grammar support available");
      }

      recognition.onstart = () => {
        console.log("🎤 Speech recognition STARTED - Habla ahora!");
        setIsRecording(true);
        setSpeechError(null);
      };

      recognition.onresult = async (event: any) => {
        console.log("🎯 Speech recognition RESULT:", event);
        
        if (isMobile) {
          // En móvil, manejar de manera más simple
          const transcript = event.results[0][0].transcript.trim();
          setCurrentTranscript(transcript);
          console.log("📱 Mobile transcript:", transcript);
        } else {
          // En desktop, usar la lógica original mejorada
          let finalTranscript = '';
          
          // Acumular todo el texto transcrito (lógica original)
          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            finalTranscript += transcript + ' ';
          }
          finalTranscript = finalTranscript.trim();
          
          // Actualizar el transcript actual para mostrar en tiempo real
          setCurrentTranscript(finalTranscript);
          console.log("💻 Desktop transcript:", finalTranscript);
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
        
        // En móvil, asegurar que no haya duplicación
        if (isMobile && currentTranscript) {
          console.log("📱 Mobile: Recognition ended, keeping transcript:", currentTranscript);
        }
      };
      
      recognitionRef.current = recognition;
      console.log("✅ Speech recognition setup complete");
    } catch (error) {
      console.error("❌ Error setting up speech recognition:", error);
      setSpeechError("Error al configurar el reconocimiento de voz");
    }
  }, [emotionParam]);

  // Handle microphone button click
  const handleMicClick = () => {
    console.log("Mic button clicked, isRecording:", isRecording, "canRecord:", canRecord, "isMobile:", isMobile);
    
    if (!recognitionRef.current) {
      setSpeechError("Reconocimiento de voz no disponible");
      return;
    }

    // No permitir grabar si KIIA está hablando
    if (!canRecord && !isRecording) {
      setSpeechError("Espera a que KIIA termine de hablar");
      return;
    }

    try {
      if (isRecording) {
        // Usuario detiene manualmente la grabación
        console.log("🛑 User manually stopped recording");
        
        // Obtener el transcript final antes de detener
        const finalTranscript = currentTranscript;
        
        // Detener la grabación
        recognitionRef.current.stop();
        
        // En móvil, procesar inmediatamente
        const processDelay = isMobile ? 100 : 300;
        
        // Procesar el transcript final
        setTimeout(() => {
          if (finalTranscript && finalTranscript.trim()) {
            console.log("📝 Processing final transcript:", finalTranscript);
            
            // Procesar respuesta
            const voiceResponseText = getTemporaryResponse(finalTranscript, emotionParam || undefined);
            console.log("🤖 KIIA response:", voiceResponseText);
            
            // Agregar mensaje del usuario
            const userMessage: Message = {
              id: `user-voice-${Date.now()}`,
              text: finalTranscript,
              sender: 'user',
              timestamp: new Date(),
              kiiaResponse: voiceResponseText,
            };
            setMessages(prev => [...prev, userMessage]);
            
            setIsLoading(true);
            setTimeout(() => {
              const kiiaMessage: Message = {
                id: `kiia-${Date.now()}`,
                text: voiceResponseText,
                sender: 'kiia',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, kiiaMessage]);
              setIsLoading(false);
              
              try {
                console.log("🔊 Attempting to speak response...");
                speak(voiceResponseText);
              } catch (error) {
                console.warn("⚠️ Speech failed, but chat continues normally");
              }
            }, 1000);
          } else {
            console.log("📝 No transcript to process");
          }
          
          // Resetear el transcript
          setCurrentTranscript('');
        }, processDelay);
        
      } else {
        // Usuario inicia grabación
        console.log("🎤 User started recording");
        setUserInput('');
        setSpeechError(null);
        setCurrentTranscript(''); // Resetear el transcript completamente
        
        // En móvil, ser más cuidadoso con la limpieza
        if (isMobile) {
          // En móvil, no abortar, solo limpiar el transcript
          console.log("📱 Mobile: Starting fresh recognition session");
        } else {
          // En desktop, usar la lógica original
          setCurrentTranscript(''); // Resetear el transcript
          recognitionRef.current.start();
        }
        
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

  // Actualizar emoción cada vez que cambian los mensajes
  useEffect(() => {
    // Buscar el último mensaje relevante (de KIIA o usuario)
    const lastRelevant = [...messages].reverse().find(m => m.text && m.text.trim());
    if (lastRelevant) {
      setEmotion(detectEmotionFromText(lastRelevant.text));
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const responseText = getTemporaryResponse(userInput, emotionParam || undefined);
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
      {/* Área de mensajes en la parte superior */}
      <div className="flex-1 flex flex-col justify-end p-2 sm:p-4 relative min-h-0">
        {/* ScrollArea para los mensajes */}
        <ScrollArea className="w-full h-full flex-1 z-10 min-h-0" ref={scrollAreaRootRef}>
          <div className="space-y-3 sm:space-y-4 pb-4">
            {messages.filter(msg => msg.sender === 'user').map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end space-x-2 max-w-[85%] sm:max-w-[80%]",
                  msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                )}
              >
                {msg.sender === 'kiia' && (
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                      <Bot size={16} className="sm:w-5 sm:h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-2 sm:p-3 rounded-lg shadow text-sm sm:text-base",
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  )}
                >
                  <p className="font-body whitespace-pre-wrap leading-relaxed">{msg.text}</p>
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
                        className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                        title="Escuchar respuesta de Kiia"
                      >
                        <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="sr-only">Escuchar respuesta de Kiia</span>
                      </Button>
                    )}
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground text-xs sm:text-sm">
                        <User size={16} className="sm:w-5 sm:h-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.sender === 'user' && (
              <div className="flex items-end space-x-2 mr-auto justify-start">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                    <Bot size={16} className="sm:w-5 sm:h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="p-2 sm:p-3 rounded-lg shadow bg-muted text-muted-foreground rounded-bl-none">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Avatar en posición fija en la parte inferior */}
      <div className="flex-shrink-0 p-2 sm:p-4 flex justify-center bg-gradient-to-t from-card to-transparent">
        <div className="relative">
          <KiiaAvatar 
            isSpeaking={isKiiaSpeaking} 
            isListening={isRecording} 
            emotion={emotion} 
            size={isMobile ? 'small' : 'medium'}
          />
        </div>
      </div>

      {/* Barra de entrada de texto */}
      <form onSubmit={handleSubmit} className="p-2 sm:p-4 border-t bg-card flex items-center space-x-2">
        {speechError && (
          <div className="absolute bottom-16 sm:bottom-20 left-2 right-2 sm:left-4 sm:right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs sm:text-sm">
            {speechError}
          </div>
        )}
        
        {/* Mostrar transcript actual si está grabando */}
        {isRecording && currentTranscript && (
          <div className="absolute bottom-16 sm:bottom-20 left-2 right-2 sm:left-4 sm:right-4 bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded text-xs sm:text-sm">
            <strong>Escuchando:</strong> {currentTranscript}
          </div>
        )}
        
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={isRecording ? "Escuchando..." : "Escribe o habla con KIIA..."}
          className="flex-1 focus-visible:ring-primary font-body text-sm sm:text-base"
          disabled={isLoading || isRecording}
          aria-label="Mensaje para KIIA"
        />
        {isClient && SpeechRecognition && (
          <Button 
            type="button" 
            size="icon" 
            onClick={handleMicClick} 
            disabled={isLoading || !canRecord} 
            className={cn(
              "bg-purple-500 hover:bg-purple-600 text-white shadow-md h-8 w-8 sm:h-10 sm:w-10", 
              isRecording && "bg-red-500 hover:bg-red-600"
            )}
          >
            {isRecording ? <StopCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : <Mic className="h-4 w-4 sm:h-5 sm:w-5" />}
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
            className="bg-gray-400 hover:bg-gray-500 text-white h-8 w-8 sm:h-10 sm:w-10"
            title="Reconocimiento de voz no disponible"
          >
            <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
        {speechError && (
          <Button 
            type="button" 
            size="icon" 
            onClick={() => setSpeechError(null)}
            className="bg-red-500 hover:bg-red-600 text-white h-8 w-8 sm:h-10 sm:w-10"
            title="Cerrar mensaje de error"
          >
            <span className="text-xs">×</span>
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isLoading || !userInput.trim()} 
          className="bg-primary hover:bg-primary/90 h-8 w-8 sm:h-10 sm:w-10"
        >
          {isLoading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />}
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
          className="bg-green-500 hover:bg-green-600 text-white border-green-500 relative h-8 w-8 sm:h-10 sm:w-10"
          title="Reproducir última respuesta de Kiia"
        >
          <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
          {messages.filter(m => m.sender === 'kiia').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
              {messages.filter(m => m.sender === 'kiia').length}
            </span>
          )}
          <span className="sr-only">Reproducir última respuesta</span>
        </Button>
      </form>
    </div>
  );
} 