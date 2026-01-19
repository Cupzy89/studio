'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Boxes } from 'lucide-react';
import { useInventory } from '@/context/inventory-context';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { paperRolls, isLoading } = useInventory();

  const { totalWeight, totalRolls } = useMemo(() => {
    if (isLoading || !paperRolls) {
      return { totalWeight: 0, totalRolls: 0 };
    }

    const totalWeight = paperRolls.reduce(
      (sum, roll) => sum + roll.quantity,
      0
    );
    const totalRolls = paperRolls.reduce(
      (sum, roll) => sum + roll.rollCount,
      0
    );

    return { totalWeight, totalRolls };
  }, [paperRolls, isLoading]);

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              total stock paper roll
            </CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-3/4" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {totalRolls.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalWeight.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{' '}
                  kg total berat
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
