'use client';

import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { SalesRecord } from '@/types';
import type { ChartConfig } from '@/components/ui/chart';

interface DataVisualizationCardProps {
  data: SalesRecord[];
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function DataVisualizationCard({ data }: DataVisualizationCardProps) {
  const { salesByRegion, salesOverTime, categoryBreakdown } = useMemo(() => {
    const salesByRegion = data.reduce((acc, cur) => {
      if (!acc[cur.region]) {
        acc[cur.region] = 0;
      }
      acc[cur.region] += cur.amount;
      return acc;
    }, {} as { [key: string]: number });

    const salesOverTime = data
      .map(item => ({
        date: new Date(item.saleDate).toLocaleDateString('en-CA'),
        amount: item.amount,
      }))
      .reduce((acc, cur) => {
        if (!acc[cur.date]) {
          acc[cur.date] = 0;
        }
        acc[cur.date] += cur.amount;
        return acc;
      }, {} as { [key: string]: number });

    const categoryBreakdown = data.reduce((acc, cur) => {
        if (!acc[cur.category]) {
            acc[cur.category] = 0;
        }
        acc[cur.category] += cur.amount;
        return acc;
    }, {} as { [key: string]: number });

    return {
      salesByRegion: Object.entries(salesByRegion)
        .map(([region, total]) => ({ region, total: Math.round(total) }))
        .sort((a, b) => b.total - a.total),
      salesOverTime: Object.entries(salesOverTime)
        .map(([date, total]) => ({ date, total: Math.round(total) }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      categoryBreakdown: Object.entries(categoryBreakdown).map(
        ([category, total]) => ({ category, total: Math.round(total) })
      ).sort((a,b) => b.total - a.total),
    };
  }, [data]);

  const barChartConfig: ChartConfig = {
    total: {
      label: "Total Sales",
      color: "hsl(var(--chart-1))",
    },
  };
  
  const lineChartConfig: ChartConfig = {
    total: {
      label: "Total Sales",
      color: "hsl(var(--chart-1))",
    },
  };

  const pieChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    categoryBreakdown.forEach((item, index) => {
      config[item.category] = {
        label: item.category,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }
    });
    return config;
  }, [categoryBreakdown]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualizations</CardTitle>
        <CardDescription>
          Visual representation of the current data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="region">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="region">By Region</TabsTrigger>
            <TabsTrigger value="time">Over Time</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
          </TabsList>
          <TabsContent value="region">
            <ChartContainer config={barChartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={salesByRegion}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="region"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="time">
            <ChartContainer config={lineChartConfig} className="min-h-[300px] w-full">
              <LineChart
                accessibilityLayer
                data={salesOverTime}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="total"
                  type="monotone"
                  stroke="var(--color-total)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="category">
            <ChartContainer config={pieChartConfig} className="min-h-[300px] w-full">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="total" hideLabel />} />
                    <Pie data={categoryBreakdown} dataKey="total" nameKey="category" innerRadius={60}>
                       {categoryBreakdown.map((entry) => (
                          <Cell key={entry.category} fill={`var(--color-${entry.category})`} />
                        ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
