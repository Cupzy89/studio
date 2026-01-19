'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Warehouse,
  AlertTriangle,
  Boxes,
} from 'lucide-react';
import { InventoryTable } from '@/components/inventory-table';
import { UsageChart } from '@/components/usage-chart';
import { OrderOptimizer } from '@/components/order-optimizer';
import { useInventory } from '@/context/inventory-context';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { paperRolls, isLoading } = useInventory();
  
  const { totalWeight, totalRolls, uniqueStorageBinsCount, lowStockCount } = useMemo(() => {
    if (isLoading || !paperRolls) {
      return { totalWeight: 0, totalRolls: 0, uniqueStorageBinsCount: 0, lowStockCount: 0 };
    }
    
    const totalWeight = paperRolls.reduce((sum, roll) => sum + roll.quantity, 0);
    const totalRolls = paperRolls.reduce((sum, roll) => sum + roll.rollCount, 0);
    const uniqueStorageBins = [...new Set(paperRolls.map(roll => roll.storageBin).filter(Boolean))];
    const lowStockCount = paperRolls.filter(
      (roll) => roll.quantity < roll.reorderLevel
    ).length;

    return { totalWeight, totalRolls, uniqueStorageBinsCount: uniqueStorageBins.length, lowStockCount };
  }, [paperRolls, isLoading]);

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventaris</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
            ) : (
                <>
                    <div className="text-2xl font-bold">{totalRolls.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                    {totalWeight.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg total berat
                    </p>
                </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lokasi Penyimpanan
            </CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
            ) : (
                <>
                    <div className="text-2xl font-bold">{uniqueStorageBinsCount}</div>
                    <p className="text-xs text-muted-foreground">
                    Total lokasi penyimpanan unik
                    </p>
                </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
            ) : (
                <>
                    <div className="text-2xl font-bold">{lowStockCount}</div>
                    <p className="text-xs text-muted-foreground">item di bawah level pemesanan ulang</p>
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
