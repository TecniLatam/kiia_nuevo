import { ResourceLibraryItems } from '@/components/sections/resource-library-items';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LibraryPage() {
  return (
    <div className="container mx-auto py-2">
      <Card className="mb-8 bg-transparent border-none shadow-none">
        <CardHeader className="text-center px-0">
          <CardTitle className="text-3xl font-headline text-primary">Biblioteca de Recursos</CardTitle>
          <CardDescription className="text-lg text-muted-foreground font-body">
            Encuentra meditaciones, videos y audios para nutrir tu bienestar.
          </CardDescription>
        </CardHeader>
      </Card>
      <ResourceLibraryItems />
    </div>
  );
}
