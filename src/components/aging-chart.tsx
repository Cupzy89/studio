'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useInventory } from '@/context/inventory-context';
import { useMemo } from 'react';
import { Skeleton } from './ui/skeleton';

const chartConfig = {
  rollCount: {
    label: 'Jumlah Gulungan',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function AgingChart() {
  const { paperRolls, isLoading } = useInventory();

  const chartData = useMemo(() => {
    if (isLoading || !paperRolls) {
      return [];
    }

    const categories = {
      'Di Bawah 3 Bulan': 0,
      '3-6 Bulan': 0,
      '6-12 Bulan': 0,
      'Di Atas 12 Bulan': 0,
    };

    paperRolls.forEach(roll => {
      const agingDays = roll.aging;
      if (agingDays < 90) {
        categories['Di Bawah 3 Bulan'] += roll.rollCount;
      } else if (agingDays >= 90 && agingDays < 180) {
        categories['3-6 Bulan'] += roll.rollCount;
      } else if (agingDays >= 180 && agingDays < 365) {
        categories['6-12 Bulan'] += roll.rollCount;
      } else {
        categories['Di Atas 12 Bulan'] += roll.rollCount;
      }
    });

    return [
      { category: '0-3 bln', rollCount: categories['Di Bawah 3 Bulan'] },
      { category: '3-6 bln', rollCount: categories['3-6 Bulan'] },
      { category: '6-12 bln', rollCount: categories['6-12 Bulan'] },
      { category: '>12 bln', rollCount: categories['Di Atas 12 Bulan'] },
    ];
  }, [paperRolls, isLoading]);

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[350px] w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Usia Stok</CardTitle>
        <CardDescription>
          Jumlah gulungan kertas berdasarkan kategori usia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="rollCount" fill="var(--color-rollCount)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
