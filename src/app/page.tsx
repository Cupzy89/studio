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

export default function DashboardPage() {
  const { paperRolls } = useInventory();
  
  // Logic for "Total Roll" - sum of all quantities
  const totalRoll = paperRolls.reduce((sum, roll) => sum + roll.quantity, 0);
  
  // Logic for "Stock Local" - same as total quantity
  const stockLocal = totalRoll;

  // Logic for "Stock Old" - count of items below reorder level
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
            <div className="text-2xl font-bold">{totalRoll}</div>
            <p className="text-xs text-muted-foreground">
              total qty di semua jenis
            </p>
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
            <div className="text-2xl font-bold">{stockLocal}</div>
            <p className="text-xs text-muted-foreground">
              total qty dari stok lokal
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Old</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockOld}</div>
            <p className="text-xs text-muted-foreground">total dari stok lama</p>
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
