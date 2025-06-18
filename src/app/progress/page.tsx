import { ProgressDisplay } from '@/components/sections/progress-display';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProgressPage() {
  return (
    <div className="container mx-auto py-2">
       <Card className="mb-8 bg-transparent border-none shadow-none">
        <CardHeader className="text-center px-0">
          <CardTitle className="text-3xl font-headline text-primary">Tu Viaje de Crecimiento</CardTitle>
          <CardDescription className="text-lg text-muted-foreground font-body">
            Observa tu progreso, celebra tus logros y sigue iluminando tu camino.
          </CardDescription>
        </CardHeader>
      </Card>
      <ProgressDisplay />
    </div>
  );
}
