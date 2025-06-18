import { BoostModuleContent } from '@/components/sections/boost-module-content';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BoostPage() {
  return (
    <div className="container mx-auto py-2">
      <Card className="mb-8 bg-transparent border-none shadow-none">
        <CardHeader className="text-center px-0">
          <CardTitle className="text-3xl font-headline text-primary">Módulo 'El Impulso'</CardTitle>
          <CardDescription className="text-lg text-muted-foreground font-body">
            Encuentra micro-acciones para vencer la ansiedad, el miedo y el estancamiento. ¡De la intención a la acción!
          </CardDescription>
        </CardHeader>
      </Card>
      <BoostModuleContent />
    </div>
  );
}
