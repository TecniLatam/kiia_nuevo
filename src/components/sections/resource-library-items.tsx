"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { PlayCircle, Headphones, BookOpen, Search, SlidersHorizontal } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'Meditación' | 'Video' | 'Audio';
  duration: string;
  imageUrl: string;
  dataAiHint: string;
  category: 'Autoestima' | 'Ansiedad' | 'Manejo Emocional' | 'Niño Interior' | 'PNL' | 'Fe y Resiliencia';
  description: string;
  link: string; // Placeholder for actual resource link
}

const resources: Resource[] = [
  { id: 'r1', title: 'Meditación Guiada para la Calma', type: 'Meditación', duration: '5 min', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'calm meditation', category: 'Ansiedad', description: 'Una meditación corta para encontrar paz en momentos de estrés.', link: '#' },
  { id: 'r2', title: 'Fortaleciendo tu Autoestima', type: 'Video', duration: '3 min', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'self esteem', category: 'Autoestima', description: 'Un video inspirador para mejorar la confianza en ti mismo.', link: '#' },
  { id: 'r3', title: 'Audio Motivacional: Resiliencia', type: 'Audio', duration: '4 min', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'motivation resilience', category: 'Fe y Resiliencia', description: 'Un audio para fortalecer tu capacidad de superar adversidades.', link: '#' },
  { id: 'r4', title: 'Ejercicio de PNL para la Confianza', type: 'Meditación', duration: '5 min', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'nlp confidence', category: 'PNL', description: 'Un ejercicio práctico de Programación Neurolingüística.', link: '#' },
  { id: 'r5', title: 'Conectando con tu Niño Interior', type: 'Video', duration: '2 min', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'inner child', category: 'Niño Interior', description: 'Un corto video para sanar y escuchar a tu niño interior.', link: '#' },
  { id: 'r6', title: 'Manejo de Emociones Intensas', type: 'Audio', duration: '5 min', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'emotion management', category: 'Manejo Emocional', description: 'Guía para navegar emociones fuertes de manera saludable.', link: '#' },
];

const categories = ['Todas', ...new Set(resources.map(r => r.category))] as const;
type Category = typeof categories[number];

export function ResourceLibraryItems() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todas');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIconForType = (type: Resource['type']) => {
    if (type === 'Meditación') return <Headphones className="h-5 w-5 mr-2 text-primary" />;
    if (type === 'Video') return <PlayCircle className="h-5 w-5 mr-2 text-primary" />;
    if (type === 'Audio') return <BookOpen className="h-5 w-5 mr-2 text-primary" />; // Or specific audio icon
    return null;
  };

  return (
    <div className="space-y-8">
      <Card className="p-4 sm:p-6 shadow-md rounded-xl bg-card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-body w-full"
              aria-label="Buscar recursos"
            />
          </div>
          <div className="relative min-w-[200px]">
             <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as Category)}
            >
              <SelectTrigger className="w-full pl-10 font-body" aria-label="Filtrar por categoría">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="font-body">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <div className="relative w-full h-48">
                <Image
                  src={resource.imageUrl}
                  alt={resource.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={resource.dataAiHint}
                />
              </div>
              <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-xl font-headline text-primary flex items-center">
                  {getIconForType(resource.type)}
                  {resource.title}
                </CardTitle>
                <CardDescription className="font-body text-sm text-muted-foreground">
                  {resource.type} • {resource.duration} • {resource.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="font-body text-foreground text-sm">{resource.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 font-body" asChild>
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    Acceder al Recurso
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground font-body py-10">
          No se encontraron recursos que coincidan con tu búsqueda o filtro.
        </p>
      )}
    </div>
  );
}
