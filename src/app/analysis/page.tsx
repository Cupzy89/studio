'use client';

import { useInventory } from '@/context/inventory-context';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock } from 'lucide-react';

export default function AnalysisPage() {
  const { paperRolls, isLoading } = useInventory();

  const agingStats = useMemo(() => {
    if (isLoading || !paperRolls) {
      return {
        under3: { rolls: 0, weight: 0 },
        '3to6': { rolls: 0, weight: 0 },
        '6to12': { rolls: 0, weight: 0 },
        over12: { rolls: 0, weight: 0 },
      };
    }

    const categories = {
      under3: { rolls: 0, weight: 0 },
      '3to6': { rolls: 0, weight: 0 },
      '6to12': { rolls: 0, weight: 0 },
      over12: { rolls: 0, weight: 0 },
    };

    paperRolls.forEach(roll => {
      const agingDays = roll.aging;
      if (agingDays < 90) {
        categories.under3.rolls += roll.rollCount;
        categories.under3.weight += roll.quantity;
      } else if (agingDays >= 90 && agingDays < 180) {
        categories['3to6'].rolls += roll.rollCount;
        categories['3to6'].weight += roll.quantity;
      } else if (agingDays >= 180 && agingDays < 365) {
        categories['6to12'].rolls += roll.rollCount;
        categories['6to12'].weight += roll.quantity;
      } else {
        categories.over12.rolls += roll.rollCount;
        categories.over12.weight += roll.quantity;
      }
    });

    return categories;
  }, [paperRolls, isLoading]);

  const StatCard = ({ title, rolls, weight, isLoading }: { title: string, rolls: number, weight: number, isLoading: boolean }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{rolls.toLocaleString()} Gulungan</div>
            <p className="text-xs text-muted-foreground">
              {weight.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg total berat
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analisis Usia Stok</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Di Bawah 3 Bulan" rolls={agingStats.under3.rolls} weight={agingStats.under3.weight} isLoading={isLoading} />
        <StatCard title="3-6 Bulan" rolls={agingStats['3to6'].rolls} weight={agingStats['3to6'].weight} isLoading={isLoading} />
        <StatCard title="6-12 Bulan" rolls={agingStats['6to12'].rolls} weight={agingStats['6to12'].weight} isLoading={isLoading} />
        <StatCard title="Di Atas 12 Bulan" rolls={agingStats.over12.rolls} weight={agingStats.over12.weight} isLoading={isLoading} />
      </div>
    </div>
  );
}
