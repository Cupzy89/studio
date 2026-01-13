'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { historicalUsage } from '@/lib/data';

const chartConfig = {
  Coated: {
    label: 'Coated',
    color: 'hsl(var(--chart-1))',
  },
  Uncoated: {
    label: 'Uncoated',
    color: 'hsl(var(--chart-2))',
  },
  Specialty: {
    label: 'Specialty',
    color: 'hsl(var(--chart-3))',
  },
};

export function UsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Usage Analysis</CardTitle>
        <CardDescription>Usage over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={historicalUsage} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="Coated"
              fill="var(--color-Coated)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Uncoated"
              fill="var(--color-Uncoated)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Specialty"
              fill="var(--color-Specialty)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
