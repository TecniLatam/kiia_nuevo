
'use server';
/**
 * @fileOverview Generates a step-by-step action plan for a user's project.
 *
 * - generateProjectActionPlan - A function that generates a project action plan.
 * - GenerateProjectActionPlanInput - The input type for the function.
 * - GenerateProjectActionPlanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectActionPlanInputSchema = z.object({
  projectDescription: z
    .string()
    .describe(
      'A description of the project or goal the user wants to achieve.'
    ),
});
export type GenerateProjectActionPlanInput = z.infer<
  typeof GenerateProjectActionPlanInputSchema
>;

const GenerateProjectActionPlanOutputSchema = z.object({
  actionPlan: z
    .string()
    .describe(
      'A step-by-step action plan to help the user achieve their project, delivered in the same language as the input.'
    ),
});
export type GenerateProjectActionPlanOutput = z.infer<
  typeof GenerateProjectActionPlanOutputSchema
>;

export async function generateProjectActionPlan(
  input: GenerateProjectActionPlanInput
): Promise<GenerateProjectActionPlanOutput> {
  return generateProjectActionPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectActionPlanPrompt',
  input: {schema: GenerateProjectActionPlanInputSchema},
  output: {schema: GenerateProjectActionPlanOutputSchema},
  prompt: `You are KIIA, an expert project planning assistant. Your primary task is to detect the language of the user's project description and respond in that same language.

Based on the user's project description:
"{{{projectDescription}}}"

Generate a clear, motivating, and actionable step-by-step plan to help the user achieve their goal. Break down larger goals into smaller, manageable tasks. Encourage the user and emphasize that taking action is key to progress. The plan should be practical and easy to follow. Ensure the entire response, including the plan, is in the detected language.
  `,
});

const generateProjectActionPlanFlow = ai.defineFlow(
  {
    name: 'generateProjectActionPlanFlow',
    inputSchema: GenerateProjectActionPlanInputSchema,
    outputSchema: GenerateProjectActionPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
