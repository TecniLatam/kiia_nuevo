import { Suspense } from 'react';
import { KiiaChatInterface } from '@/components/sections/kiia-chat-interface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function KiiaChatPage() {
  return (
    <div className="container mx-auto py-1 sm:py-2 pb-20 sm:pb-32 px-2 sm:px-4">
      <Card className="mb-4 sm:mb-6 bg-transparent border-none shadow-none">
        <CardHeader className="text-center px-0">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-headline text-primary">Tu Espacio Seguro con KIIA</CardTitle>
          <CardDescription className="text-sm sm:text-base md:text-lg text-muted-foreground font-body">
            KIIA está aquí para acompañarte. Comparte tus pensamientos y sentimientos con confianza.
          </CardDescription>
        </CardHeader>
      </Card>
      <Suspense fallback={<div className="flex justify-center items-center h-[calc(100vh-12rem)] sm:h-[calc(100vh-18rem)]"><Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-primary" /></div>}>
        <KiiaChatInterface />
      </Suspense>
    </div>
  );
}
