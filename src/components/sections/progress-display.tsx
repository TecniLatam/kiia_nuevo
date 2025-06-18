"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Award, Sun, CheckCircle } from 'lucide-react';

// Sample data - replace with actual data source
const wellnessData = [
  { date: 'Sem 1', wellnessScore: 3, fill: "hsl(var(--chart-2))" },
  { date: 'Sem 2', wellnessScore: 4, fill: "hsl(var(--chart-2))" },
  { date: 'Sem 3', wellnessScore: 2, fill: "hsl(var(--chart-2))" },
  { date: 'Sem 4', wellnessScore: 5, fill: "hsl(var(--chart-1))" },
  { date: 'Sem 5', wellnessScore: 4, fill: "hsl(var(--chart-2))" },
  { date: 'Sem 6', wellnessScore: 3, fill: "hsl(var(--chart-2))" },
  { date: 'Sem 7', wellnessScore: 5, fill: "hsl(var(--chart-1))" },
];

const chartConfig = {
  wellnessScore: {
    label: "Bienestar",
    color: "hsl(var(--chart-1))",
  },
};

const achievements = [
  "Completaste tu primer check-in diario.",
  "Exploraste el módulo 'El Impulso'.",
  "Realizaste una meditación de la biblioteca.",
  "Compartiste tus sentimientos con KAI.",
  "Mantuviste una racha de 3 check-ins.",
];

const pathOfLightMoments = [
  { date: "2024-07-15", moment: "Identifiqué un patrón de pensamiento negativo y logré cambiarlo." },
  { date: "2024-07-18", moment: "Me sentí orgulloso/a después de completar una tarea que posponía." },
  { date: "2024-07-22", moment: "Recibí un consejo útil de KAI que me ayudó a ver las cosas diferente." },
];

export function ProgressDisplay() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">Gráfico de Bienestar Semanal</CardTitle>
          <CardDescription className="font-body text-muted-foreground">Tu evolución emocional a lo largo del tiempo.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wellnessData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis domain={[0, 5]} allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} />
                <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="wellnessScore" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground font-body">Nota: Los datos son ilustrativos.</p>
          </CardFooter>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center">
              <Award className="h-7 w-7 mr-3" />
              Historial de Logros
            </CardTitle>
            <CardDescription className="font-body text-muted-foreground">Celebra tus avances y constancia.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <ul className="space-y-3">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start font-body text-foreground">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-green-500 shrink-0" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center">
              <Sun className="h-7 w-7 mr-3" />
              Camino de Luz
            </CardTitle>
            <CardDescription className="font-body text-muted-foreground">Momentos clave de tu crecimiento.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <ul className="space-y-4">
                {pathOfLightMoments.map((item, index) => (
                  <li key={index} className="p-3 bg-primary/10 rounded-md">
                    <p className="font-semibold text-sm text-primary font-body">{item.date}</p>
                    <p className="font-body text-foreground">{item.moment}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
