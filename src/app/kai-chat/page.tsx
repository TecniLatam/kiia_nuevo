import { Suspense } from 'react';
import { KaiChatInterface } from '@/components/sections/kai-chat-interface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function KaiChatPage() {
  return (
    <div className="container mx-auto py-2">
      <Card className="mb-6 bg-transparent border-none shadow-none">
        <CardHeader className="text-center px-0">
          <CardTitle className="text-3xl font-headline text-primary">Tu Espacio Seguro con KAI</CardTitle>
          <CardDescription className="text-lg text-muted-foreground font-body">
            KAI está aquí para acompañarte. Comparte tus pensamientos y sentimientos con confianza.
          </CardDescription>
        </CardHeader>
      </Card>
      <Suspense fallback={<div className="flex justify-center items-center h-[calc(100vh-18rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <KaiChatInterface />
      </Suspense>
    </div>
  );
}
