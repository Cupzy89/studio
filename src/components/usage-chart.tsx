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
};

const monthTranslations: { [key: string]: string } = {
  Jan: 'Jan',
  Feb: 'Feb',
  Mar: 'Mar',
  Apr: 'Apr',
  May: 'Mei',
  Jun: 'Jun',
  Jul: 'Jul',
  Aug: 'Agu',
  Sep: 'Sep',
  Oct: 'Okt',
  Nov: 'Nov',
  Dec: 'Des',
};


export function UsageChart() {
  const translatedData = useMemo(() => {
    return historicalUsage.map(item => ({
      ...item,
      month: monthTranslations[item.month] || item.month,
    }));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisis Penggunaan Historis</CardTitle>
        <CardDescription>Penggunaan selama 6 bulan terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={translatedData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
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
              name="Dilapisi"
            />
            <Bar
              dataKey="Uncoated"
              fill="var(--color-Uncoated)"
              radius={[4, 4, 0, 0]}
              name="Tidak Dilapisi"
            />
            <Bar
              dataKey="Specialty"
              fill="var(--color-Specialty)"
              radius={[4, 4, 0, 0]}
              name="Khusus"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
