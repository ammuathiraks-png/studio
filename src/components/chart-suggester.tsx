'use client';

import React, { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Lightbulb, Loader, AlertTriangle, CheckCircle } from 'lucide-react';

import { getChartSuggestions } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const initialState = {
  message: '',
  result: null,
  timestamp: Date.now(),
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Lightbulb className="mr-2 h-4 w-4" />
      )}
      Get Suggestions
    </Button>
  );
}

export default function ChartSuggester() {
  const [state, formAction] = useFormState(getChartSuggestions, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== 'success') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          <span>AI Chart Suggester</span>
        </CardTitle>
        <CardDescription>
          Describe your data to get AI-powered chart recommendations.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="dataDescription">Data Description</Label>
            <Textarea
              id="dataDescription"
              name="dataDescription"
              placeholder="e.g., Monthly sales data for different product categories over the last year."
              required
              minLength={10}
            />
          </div>
          <SubmitButton />

          {state.result && (
            <div className="mt-4 space-y-4 rounded-lg border bg-secondary/30 p-4">
                <div>
                    <h4 className="font-semibold text-primary">Suggested Chart Types</h4>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {state.result.suggestedChartTypes.map(type => (
                            <Badge key={type} variant="secondary">{type}</Badge>
                        ))}
                    </div>
                </div>
                <Separator/>
                <div>
                    <h4 className="font-semibold text-primary">Reasoning</h4>
                    <p className="text-sm text-muted-foreground pt-2">
                        {state.result.reasoning}
                    </p>
                </div>
            </div>
          )}
        </CardContent>
      </form>
    </Card>
  );
}
