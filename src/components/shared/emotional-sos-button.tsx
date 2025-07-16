"use client";

import { useState } from 'react';
import { AlertTriangle, LifeBuoy, Zap, Phone, ShieldQuestion, MessageSquareHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import Link from 'next/link';

export function EmotionalSOSButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOptionClick = (alertMessage?: string) => {
    if (alertMessage) {
      alert(alertMessage);
    }
    setIsModalOpen(false); 
  };

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full shadow-xl p-3 sm:p-4 h-auto"
        onClick={() => setIsModalOpen(true)}
        aria-label="Botón SOS Emocional"
      >
        <LifeBuoy className="h-6 w-6 sm:h-8 sm:w-8 mr-1 sm:mr-2" />
        <span className="font-headline text-base sm:text-lg">SOS</span>
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-background text-foreground p-4 sm:p-6 rounded-lg shadow-2xl mx-4">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl sm:text-2xl font-headline text-primary flex items-center">
              <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-destructive" />
              Apoyo Inmediato
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 text-sm sm:text-base font-body">
              Si te sientes en crisis, aquí tienes algunas opciones para obtener ayuda rápidamente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 sm:space-y-4 my-4 sm:my-6">
            <Link href="/kiia-chat?mode=crisis" passHref legacyBehavior>
              <Button 
                variant="outline" 
                className="w-full justify-start text-base sm:text-lg py-4 sm:py-6 border-primary text-primary hover:bg-primary/10"
                onClick={() => handleOptionClick()}
              >
                <MessageSquareHeart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" /> Hablar con KIIA (Modo Crisis)
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full justify-start text-base sm:text-lg py-4 sm:py-6 border-accent-foreground text-accent-foreground hover:bg-accent/80" 
              onClick={() => handleOptionClick("Función de ejercicios de respiración próximamente.")}
            >
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" /> Ejercicio de Respiración Rápido
            </Button>
             <Button 
              variant="outline" 
              className="w-full justify-start text-base sm:text-lg py-4 sm:py-6" 
              onClick={() => handleOptionClick("Recurso de línea de ayuda próximamente.")}
            >
              <Phone className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" /> Contactar Línea de Ayuda Local
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-base sm:text-lg py-4 sm:py-6" 
              onClick={() => handleOptionClick("Consejos de seguridad próximamente.")}
            >
              <ShieldQuestion className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" /> Consejos de Autocuidado Urgente
            </Button>
          </div>

          <DialogFooter className="mt-4 sm:mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:bg-muted/50">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
