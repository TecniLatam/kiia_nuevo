
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ShieldAlert, TrendingDown, CheckCircle, Loader2, Send, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { generateProjectActionPlan, GenerateProjectActionPlanInput } from "@/ai/flows/generate-project-action-plan";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BoostAction {
  id: string;
  title: string;
  description: string;
  category: 'Ansiedad' | 'Miedo' | 'Estancamiento';
  icon: React.ElementType;
}

const boostActions: BoostAction[] = [
  {
    id: 'b1',
    title: 'Respiración Consciente (1 min)',
    description: 'Enfócate en tu respiración. Inhala profundamente por la nariz contando hasta 4, sostén por 4 y exhala lentamente por la boca contando hasta 6. Repite 5 veces.',
    category: 'Ansiedad',
    icon: Zap,
  },
  {
    id: 'b2',
    title: 'Afirmación Positiva (30 seg)',
    description: 'Mírate al espejo y di en voz alta: "Soy capaz, soy fuerte y merezco la paz". Repítelo 3 veces con convicción.',
    category: 'Miedo',
    icon: ShieldAlert,
  },
  {
    id: 'b3',
    title: 'Pequeño Paso Adelante (2 min)',
    description: 'Identifica una tarea pequeña que has estado posponiendo. Dedícale solo 2 minutos. El simple hecho de empezar puede romper la inercia.',
    category: 'Estancamiento',
    icon: TrendingDown,
  },
  {
    id: 'b4',
    title: 'Gratitud Express (1 min)',
    description: 'Piensa en tres cosas por las que te sientes agradecido/a hoy, por pequeñas que sean. Anótalas o simplemente siéntelas.',
    category: 'Ansiedad',
    icon: Zap,
  },
  {
    id: 'b5',
    title: 'Visualiza el Éxito (2 min)',
    description: 'Cierra los ojos e imagínate superando un miedo o desafío actual. Siente la emoción positiva de haberlo logrado.',
    category: 'Miedo',
    icon: ShieldAlert,
  },
   {
    id: 'b6',
    title: 'Mueve tu Cuerpo (3 min)',
    description: 'Levántate y estírate, da un pequeño paseo, o pon una canción y baila. Cambiar tu estado físico puede cambiar tu estado mental.',
    category: 'Estancamiento',
    icon: TrendingDown,
  },
];

function ProjectPlannerCard() {
  const [projectDescription, setProjectDescription] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    if (!projectDescription.trim()) {
      setPlanError("Por favor, describe tu proyecto para generar un plan.");
      return;
    }
    setIsLoadingPlan(true);
    setGeneratedPlan(null);
    setPlanError(null);
    try {
      const input: GenerateProjectActionPlanInput = { projectDescription };
      const result = await generateProjectActionPlan(input);
      setGeneratedPlan(result.actionPlan);
    } catch (e) {
      console.error("Error generating project plan:", e);
      setPlanError("Hubo un problema al generar tu plan de proyecto. Inténtalo de nuevo.");
    } finally {
      setIsLoadingPlan(false);
    }
  };

  return (
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline text-primary flex items-center justify-center">
          <Lightbulb className="h-7 w-7 mr-3" />
          Planifica tu Próximo Gran Paso
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground font-body">
          Describe tu proyecto o meta, y KIIA te ayudará a crear un plan de acción.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Ej: Quiero lanzar mi blog de cocina en las próximas 4 semanas, enfocado en recetas saludables y fáciles..."
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          rows={5}
          className="font-body"
          disabled={isLoadingPlan}
        />
        <Button onClick={handleGeneratePlan} disabled={isLoadingPlan || !projectDescription.trim()} className="w-full font-headline">
          {isLoadingPlan ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Send className="mr-2 h-5 w-5" />
          )}
          {isLoadingPlan ? "Generando Plan..." : "Generar Plan de Acción"}
        </Button>

        {planError && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle className="font-headline">Error</AlertTitle>
            <AlertDescription className="font-body">{planError}</AlertDescription>
          </Alert>
        )}

        {generatedPlan && !isLoadingPlan && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg shadow whitespace-pre-line font-body text-foreground leading-relaxed">
            <h3 className="text-xl font-headline text-primary mb-3">Tu Plan de Proyecto:</h3>
            {generatedPlan.split('\\n').map((line, index) => {
              if (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\\d+\\./.test(line.trim())) {
                return <p key={index} className="mb-2 ml-4 flex items-start"><CheckCircle2 className="h-5 w-5 mr-2 mt-1 text-primary shrink-0" />{line.replace(/^[-*\\d.]+\\s*/, '')}</p>;
              }
              if (line.trim().match(/^Paso \\d+:/i) || line.trim().match(/^Semana \\d+:/i) || line.trim().match(/^Día \\d+:/i) || line.trim().match(/^Meta \\d+:/i)) {
                return <p key={index} className="font-semibold text-primary mt-3 mb-1">{line}</p>;
              }
              return <p key={index} className="mb-2">{line}</p>;
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function BoostModuleContent() {
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {(['Ansiedad', 'Miedo', 'Estancamiento'] as const).map((category, idx) => (
          <AccordionItem value={`category-${idx}`} key={category} className="border-b-2 border-primary/20 rounded-lg mb-4 shadow-sm bg-card overflow-hidden">
            <AccordionTrigger className="p-6 text-xl font-headline text-primary hover:bg-primary/10 hover:no-underline">
              <div className="flex items-center">
                {category === 'Ansiedad' && <Zap className="h-6 w-6 mr-3 text-yellow-500" />}
                {category === 'Miedo' && <ShieldAlert className="h-6 w-6 mr-3 text-red-500" />}
                {category === 'Estancamiento' && <TrendingDown className="h-6 w-6 mr-3 text-blue-500" />}
                {category}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-background">
              <div className="space-y-4">
                {boostActions.filter(action => action.category === category).map(action => {
                  const Icon = action.icon;
                  return (
                    <Card key={action.id} className="bg-muted/50 rounded-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-headline text-secondary-foreground flex items-center">
                          <Icon className="h-5 w-5 mr-2 text-primary"/>
                          {action.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body text-foreground mb-3">{action.description}</p>
                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10" onClick={() => alert(`¡Acción '${action.title}' marcada como iniciada! A por ello.`)}>
                          <CheckCircle className="h-4 w-4 mr-2"/> ¡Lo haré!
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <ProjectPlannerCard />

    </div>
  );
}
