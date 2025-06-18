
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { generatePersonalizedActionPlan, GeneratePersonalizedActionPlanInput } from '@/ai/flows/generate-personalized-action-plan';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface PlanElement {
  id: string;
  type: 'action' | 'text';
  text: string;
  completed?: boolean;
}

function ActionPlanContent() {
  const searchParams = useSearchParams();
  const mood = searchParams.get('mood');

  const [actionPlanText, setActionPlanText] = useState<string | null>(null);
  const [planElements, setPlanElements] = useState<PlanElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [includeFaith, setIncludeFaith] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  const parseActionPlan = (planText: string | null): PlanElement[] => {
    if (!planText) return [];
    const lines = planText.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || /^\d+\./.test(trimmedLine)) {
        return {
          id: `action-${index}-${Date.now()}`,
          type: 'action',
          text: trimmedLine.replace(/^[-*\d.]+\s*/, ''),
          completed: false,
        };
      }
      return {
        id: `text-${index}-${Date.now()}`,
        type: 'text',
        text: line,
      };
    });
  };

  const fetchActionPlan = async () => {
    if (!mood) {
      setError("No se ha especificado un estado de ánimo para generar el plan.");
      setPlanElements([]);
      setActionPlanText(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setPlanGenerated(false);
    setPlanElements([]); 
    try {
      const input: GeneratePersonalizedActionPlanInput = {
        dailyCheckIn: `Hoy me siento: ${mood}.`,
        includeFaithBasedAffirmations: includeFaith,
      };
      const result = await generatePersonalizedActionPlan(input);
      setActionPlanText(result.actionPlan);
      setPlanElements(parseActionPlan(result.actionPlan));
      setPlanGenerated(true);
    } catch (e) {
      console.error(e);
      setError("Hubo un problema al generar tu plan de acción. Inténtalo de nuevo.");
      setActionPlanText(null);
      setPlanElements([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mood) {
      fetchActionPlan();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

   useEffect(() => {
    if (mood && planGenerated) { 
      fetchActionPlan();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeFaith]);


  const toggleActionItem = (itemId: string) => {
    setPlanElements(prevPlan =>
      prevPlan.map(item =>
        item.id === itemId && item.type === 'action'
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary flex items-center justify-center">
            <Lightbulb className="h-8 w-8 mr-3" />
            Tu Plan de Acción Personalizado
          </CardTitle>
          {mood && (
            <CardDescription className="text-lg text-muted-foreground font-body">
              Basado en tu estado de ánimo: <span className="font-semibold text-primary">{mood}</span>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2 justify-center">
            <Switch
              id="faith-affirmations"
              checked={includeFaith}
              onCheckedChange={setIncludeFaith}
              disabled={isLoading}
              aria-labelledby="faith-label"
            />
            <Label htmlFor="faith-affirmations" id="faith-label" className="font-body text-foreground">
              Incluir afirmaciones basadas en la fe
            </Label>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-2">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground font-body">Generando tu plan personalizado...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle className="font-headline">Error</AlertTitle>
              <AlertDescription className="font-body">{error}</AlertDescription>
            </Alert>
          )}

          {actionPlanText && !isLoading && planElements.length > 0 && (
             <div className="p-6 bg-primary/10 rounded-lg shadow whitespace-pre-line font-body text-foreground leading-relaxed">
                {planElements.map((element) => {
                  if (element.type === 'action') {
                    return (
                      <div key={element.id} className="flex items-start mb-3">
                        <Checkbox
                          id={element.id}
                          checked={!!element.completed}
                          onCheckedChange={() => toggleActionItem(element.id)}
                          className="mr-3 mt-1 shrink-0 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          aria-labelledby={`${element.id}-label`}
                        />
                        <Label
                          htmlFor={element.id}
                          id={`${element.id}-label`}
                          className={cn(
                            "flex-1 text-foreground cursor-pointer",
                            element.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {element.text}
                        </Label>
                      </div>
                    );
                  } else { 
                     if (element.text.trim() === '') return null; 
                    return <p key={element.id} className="mb-2">{element.text}</p>;
                  }
                })}
            </div>
          )}
          
          {!mood && !isLoading && (
             <Alert className="mt-4 border-accent bg-accent/10">
              <AlertTitle className="font-headline text-accent-foreground">Información</AlertTitle>
              <AlertDescription className="font-body text-accent-foreground">
                Por favor, completa tu <a href="/" className="underline hover:text-primary">check-in diario</a> para generar un plan de acción.
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={fetchActionPlan} disabled={isLoading || !mood} className="font-headline text-lg">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-5 w-5" />
            )}
            {planGenerated ? "Regenerar Plan" : "Generar Plan"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ActionPlanPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <ActionPlanContent />
    </Suspense>
  );
}
