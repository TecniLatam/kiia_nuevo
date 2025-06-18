
'use server';

/**
 * @fileOverview Generates a personalized action plan based on the user's daily check-in.
 *
 * - generatePersonalizedActionPlan - A function that generates a personalized action plan.
 * - GeneratePersonalizedActionPlanInput - The input type for the generatePersonalizedActionPlan function.
 * - GeneratePersonalizedActionPlanOutput - The return type for the generatePersonalizedActionPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedActionPlanInputSchema = z.object({
  dailyCheckIn: z
    .string()
    .describe(
      'A string representing the user\'s daily check-in, including their current emotional state.'
    ),
  includeFaithBasedAffirmations: z
    .boolean()
    .describe(
      'A boolean indicating whether to include spiritual or faith-based affirmations in the action plan.'
    ),
});
export type GeneratePersonalizedActionPlanInput = z.infer<
  typeof GeneratePersonalizedActionPlanInputSchema
>;

const GeneratePersonalizedActionPlanOutputSchema = z.object({
  actionPlan: z
    .string()
    .describe(
      'A personalized action plan consisting of micro-actions, messages, or exercises tailored to the user\'s daily check-in, incorporating spiritual or faith-based affirmations if requested, and delivered in the language of the user\'s input. Actionable items should be formatted as a list.'
    ),
});
export type GeneratePersonalizedActionPlanOutput = z.infer<
  typeof GeneratePersonalizedActionPlanOutputSchema
>;

export async function generatePersonalizedActionPlan(
  input: GeneratePersonalizedActionPlanInput
): Promise<GeneratePersonalizedActionPlanOutput> {
  return generatePersonalizedActionPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedActionPlanPrompt',
  input: {schema: GeneratePersonalizedActionPlanInputSchema},
  output: {schema: GeneratePersonalizedActionPlanOutputSchema},
  prompt: `Your primary task is to detect the language of the user's daily check-in and respond in that same language.

Based on my daily check-in: {{{dailyCheckIn}}}, please provide a personalized action plan in the detected language.
The plan should consist of micro-actions, messages, or exercises (1-3 minutes each).
Format any actionable items as a list using markdown syntax (e.g., using '-', '*', or numbered lists like '1.').

{{#if includeFaithBasedAffirmations}}
Incorporate spiritual or faith-based affirmations into the action plan, also in the detected language.
{{/if}}
  `,
});

const generatePersonalizedActionPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedActionPlanFlow',
    inputSchema: GeneratePersonalizedActionPlanInputSchema,
    outputSchema: GeneratePersonalizedActionPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
