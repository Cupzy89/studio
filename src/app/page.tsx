'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ScrollText,
  AlertTriangle,
  Warehouse,
} from 'lucide-react';
import { InventoryTable } from '@/components/inventory-table';
import { UsageChart } from '@/components/usage-chart';
import { OrderOptimizer } from '@/components/order-optimizer';
import { useInventory } from '@/context/inventory-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { paperRolls, isLoading } = useInventory();
  
  const totalWeight = paperRolls.reduce((sum, roll) => sum + roll.quantity, 0);
  const totalRolls = paperRolls.reduce((sum, roll) => sum + roll.rollCount, 0);
  
  const stockLocal = totalWeight;

  const stockOld = paperRolls.filter(
    (roll) => roll.quantity < roll.reorderLevel
  ).length;

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Dasbor</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roll</CardTitle>
            <ScrollText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
            ) : (
                <>
                    <div className="text-2xl font-bold">{totalRolls}</div>
                    <p className="text-xs text-muted-foreground">
                    {totalWeight.toLocaleString()} kg total berat
                    </p>
                </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stock Local
            </CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
            ) : (
                <>
                    <div className="text-2xl font-bold">{stockLocal.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                    total qty dari stok lokal
                    </p>
                </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Old</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
            ) : (
                <>
                    <div className="text-2xl font-bold">{stockOld}</div>
                    <p className="text-xs text-muted-foreground">total dari stok lama</p>
                </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <InventoryTable />
        </div>
        <div className="lg:col-span-2">
          <UsageChart />
        </div>
      </div>

      <div>
        <OrderOptimizer />
      </div>
    </>
  );
}
