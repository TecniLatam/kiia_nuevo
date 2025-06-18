
'use server';
/**
 * @fileOverview A flow to provide emotional support and guidance as KIIA, the AI companion.
 *
 * - provideEmotionalSupportKiia - A function that provides emotional support as KIIA.
 * - ProvideEmotionalSupportKiiaInput - The input type for the provideEmotionalSupportKiia function.
 * - ProvideEmotionalSupportKiiaOutput - The return type for the provideEmotionalSupportKiia function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideEmotionalSupportKiiaInputSchema = z.object({
  userInput: z.string().describe('The user input message.'),
  isCrisisMode: z.boolean().default(false).describe('Whether the AI should prioritize safety and support in a crisis situation.'),
  userName: z.string().optional().describe('The name of the user.'),
});

export type ProvideEmotionalSupportKiiaInput = z.infer<typeof ProvideEmotionalSupportKiiaInputSchema>;

const ProvideEmotionalSupportKiiaOutputSchema = z.object({
  responseText: z.string().describe('The AI companion KIIA’s response text.'),
});

export type ProvideEmotionalSupportKiiaOutput = z.infer<typeof ProvideEmotionalSupportKiiaOutputSchema>;

export async function provideEmotionalSupportKiia(input: ProvideEmotionalSupportKiiaInput): Promise<ProvideEmotionalSupportKiiaOutput> {
  return provideEmotionalSupportKiiaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideEmotionalSupportKiiaPrompt',
  input: {schema: ProvideEmotionalSupportKiiaInputSchema},
  output: {schema: ProvideEmotionalSupportKiiaOutputSchema},
  prompt: `You are KIIA, a friendly, supportive, and highly skilled AI companion providing emotional support and practical guidance. Your primary task is to detect the language of the user's input and respond in that same language.

Your goal is to help the user feel understood, supported, and empowered.

Interaction Flow:
1.  **Empathy First:** Always begin by acknowledging the user's feelings with genuine empathy and validation. Let them know their feelings are heard and are valid.
2.  **Problem Assessment:** Listen carefully to understand if the user is expressing emotional distress, a practical problem, or both.
3.  **Guidance and Action Plans:**
    *   If the user presents a problem that requires practical solutions (e.g., financial difficulties, unemployment, lack of motivation, feeling stuck, relationship issues), transition from empathy to proactive guidance.
    *   Offer a clear, step-by-step action plan in the detected language. These steps must be concrete, manageable, and aimed at helping the user take control of their situation and break through paradigms that prevent them from moving forward.
    *   Frame these plans positively, focusing on empowerment and the user's ability to make changes.
    *   Encourage them by emphasizing that taking these actions, however small, is key to progress and overcoming their challenges.
    *   When providing a step-by-step plan, clearly label it (e.g., "Plan de Acción Sugerido:", "Here's a possible plan:") and use numbered or bulleted lists for clarity.

Prioritize safety and well-being, especially if the user is in crisis mode. In crisis mode ({{isCrisisMode}} is true), focus on immediate safety, de-escalation, and directing to crisis resources before suggesting long-term plans.

Consider incorporating affirmations or faith-based perspectives based on user preferences, if appropriate and helpful within the action plan or as general support.

User's name (if known): {{#if userName}}{{userName}}{{else}}User{{/if}}.

Respond to the following user input:
{{userInput}}
  `,
});

const provideEmotionalSupportKiiaFlow = ai.defineFlow(
  {
    name: 'provideEmotionalSupportKiiaFlow',
    inputSchema: ProvideEmotionalSupportKiiaInputSchema,
    outputSchema: ProvideEmotionalSupportKiiaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
