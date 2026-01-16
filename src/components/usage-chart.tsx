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
import { useInventory } from '@/context/inventory-context';
import { useMemo } from 'react';
import { Skeleton } from './ui/skeleton';

export function UsageChart() {
  const { paperRolls, isLoading } = useInventory();

  const { chartData, chartConfig, totalQuantity } = useMemo(() => {
    if (isLoading || !paperRolls || paperRolls.length === 0) {
      return { chartData: [], chartConfig: {}, totalQuantity: 0 };
    }

    const stockByKind: { [key: string]: number } = {};
    paperRolls.forEach(roll => {
      const kind = roll.type || 'Tidak Diketahui';
      stockByKind[kind] = (stockByKind[kind] || 0) + roll.quantity;
    });

    const totalQty = Object.values(stockByKind).reduce((acc, val) => acc + val, 0);

    const chartColors = [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))',
    ];
    
    const newChartConfig: ChartConfig = {};
    const newChartData = Object.entries(stockByKind).map(([kind], index) => {
        newChartConfig[kind] = {
          label: kind,
          color: chartColors[index % chartColors.length],
        };
      return {
        name: kind,
        value: stockByKind[kind],
        fill: `var(--color-${kind})`,
      };
    });

    return { chartData: newChartData, chartConfig: newChartConfig, totalQuantity: totalQty };
  }, [paperRolls, isLoading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stok Berdasarkan Jenis</CardTitle>
        <CardDescription>Distribusi persentase total stok (dalam Kg) berdasarkan jenis kertas.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex justify-center items-center h-[300px]">
                 <Skeleton className="aspect-square h-full w-full max-h-[300px] rounded-full" />
            </div>
        ) : chartData.length > 0 ? (
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
            >
                <PieChart>
                    <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            hideLabel
                            nameKey="name"
                            formatter={(value, name) => {
                                const percentage = totalQuantity > 0 ? (value / totalQuantity) * 100 : 0;
                                return (
                                    <div className="flex min-w-[120px] items-center text-xs">
                                        <div className="flex items-center gap-2 font-medium leading-none">
                                            {chartConfig[name as keyof typeof chartConfig]?.label || name}
                                        </div>
                                        <div className="ml-auto flex items-baseline gap-1">
                                            <span className="font-bold">{percentage.toFixed(1)}%</span>
                                            <span className="text-muted-foreground text-[10px]">({value.toLocaleString()} kg)</span>
                                        </div>
                                    </div>
                                )
                            }}
                        />
                    }
                    />
                    <ChartLegend
                        content={<ChartLegendContent nameKey="name" />}
                        className="-mt-2"
                    />
                    <Pie
                        data={chartData}
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
                                {totalQuantity.toLocaleString(undefined, {maximumFractionDigits: 0})}
                            </tspan>
                            <tspan
                                x={cx}
                                y={(cy || 0) + 20}
                                className="fill-muted-foreground"
                            >
                                Kg Total
                            </tspan>
                            </text>
                        )}
                        labelLine={false}
                    />
                </PieChart>
            </ChartContainer>
        ) : (
             <div className="flex flex-col h-[300px] w-full items-center justify-center rounded-lg border-dashed border-2">
                <p className="text-sm text-muted-foreground">Tidak ada data untuk ditampilkan.</p>
             </div>
        )}
      </CardContent>
    </Card>
  );
}
