'use server';

import {
  suggestVisualizationTypes as suggestVisualizationTypesFlow,
  type SuggestVisualizationTypesInput,
  type SuggestVisualizationTypesOutput,
} from '@/ai/flows/suggest-visualization-types';

interface FormState {
  message: string;
  result: SuggestVisualizationTypesOutput | null;
  timestamp: number;
}

export async function getChartSuggestions(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const dataDescription = formData.get('dataDescription');

  if (!dataDescription || typeof dataDescription !== 'string' || dataDescription.length < 10) {
    return {
      message: 'Please provide a more detailed description.',
      result: null,
      timestamp: Date.now(),
    };
  }

  try {
    const input: SuggestVisualizationTypesInput = { dataDescription };
    const result = await suggestVisualizationTypesFlow(input);
    return {
      message: 'success',
      result,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while getting suggestions. Please try again.',
      result: null,
      timestamp: Date.now(),
    };
  }
}
