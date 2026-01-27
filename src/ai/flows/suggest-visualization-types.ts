'use server';

/**
 * @fileOverview Provides suggestions for the best chart type to visualize data.
 *
 * - suggestVisualizationTypes - A function that suggests chart types based on data description.
 * - SuggestVisualizationTypesInput - The input type for the suggestVisualizationTypes function.
 * - SuggestVisualizationTypesOutput - The return type for the suggestVisualizationTypes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestVisualizationTypesInputSchema = z.object({
  dataDescription: z
    .string()
    .describe('A detailed description of the data to be visualized.'),
});

export type SuggestVisualizationTypesInput = z.infer<
  typeof SuggestVisualizationTypesInputSchema
>;

const SuggestVisualizationTypesOutputSchema = z.object({
  suggestedChartTypes: z
    .array(z.string())
    .describe('An array of suggested chart types for the data.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested chart types.'),
});

export type SuggestVisualizationTypesOutput = z.infer<
  typeof SuggestVisualizationTypesOutputSchema
>;

export async function suggestVisualizationTypes(
  input: SuggestVisualizationTypesInput
): Promise<SuggestVisualizationTypesOutput> {
  return suggestVisualizationTypesFlow(input);
}

const suggestVisualizationTypesPrompt = ai.definePrompt({
  name: 'suggestVisualizationTypesPrompt',
  input: {schema: SuggestVisualizationTypesInputSchema},
  output: {schema: SuggestVisualizationTypesOutputSchema},
  prompt: `You are an expert data visualization consultant. Given a description of the data, you will suggest the best chart types to use to visualize the data, along with a brief explanation of why each chart type is appropriate.\n\nData Description: {{{dataDescription}}}\n\nSuggest chart types:
{{json suggestedChartTypes}}
Reasoning:
{{json reasoning}}`,
});

const suggestVisualizationTypesFlow = ai.defineFlow(
  {
    name: 'suggestVisualizationTypesFlow',
    inputSchema: SuggestVisualizationTypesInputSchema,
    outputSchema: SuggestVisualizationTypesOutputSchema,
  },
  async input => {
    const {output} = await suggestVisualizationTypesPrompt(input);
    return output!;
  }
);
