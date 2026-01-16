'use client';
import { Pie, PieChart } from 'recharts';
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
  type ChartConfig,
} from '@/components/ui/chart';
import { historicalUsage } from '@/lib/data';
import { useMemo } from 'react';

const chartConfig = {
  Coated: {
    label: 'Dilapisi',
    color: 'hsl(var(--chart-1))',
  },
  Uncoated: {
    label: 'Tidak Dilapisi',
    color: 'hsl(var(--chart-2))',
  },
  Specialty: {
    label: 'Khusus',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;


export function UsageChart() {
  const { aggregatedData, totalValue } = useMemo(() => {
    const totals: { [key in keyof typeof chartConfig]: number } = {
      Coated: 0,
      Uncoated: 0,
      Specialty: 0,
    };

    historicalUsage.forEach((monthData) => {
      totals.Coated += monthData.Coated;
      totals.Uncoated += monthData.Uncoated;
      totals.Specialty += monthData.Specialty;
    });

    const aggregatedData = Object.entries(totals).map(([kind, total]) => ({
      name: kind as keyof typeof chartConfig,
      value: total,
      fill: `var(--color-${kind})`,
    }));

    const totalValue = aggregatedData.reduce((acc, curr) => acc + curr.value, 0);

    return { aggregatedData, totalValue };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Penggunaan Berdasarkan Jenis</CardTitle>
        <CardDescription>Total penggunaan selama 6 bulan terakhir (dalam Kg)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
             <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-mt-2"
            />
            <Pie
              data={aggregatedData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              label={({
                cx,
                cy,
              }) => (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={cx}
                    y={cy}
                    className="fill-foreground text-3xl font-bold"
                  >
                    {totalValue.toLocaleString()}
                  </tspan>
                  <tspan
                    x={cx}
                    y={(cy || 0) + 20}
                    className="fill-muted-foreground"
                  >
                    Kg
                  </tspan>
                </text>
              )}
              labelLine={false}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
