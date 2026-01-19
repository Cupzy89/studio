'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Boxes, Clock, Warehouse } from 'lucide-react';
import { useInventory } from '@/context/inventory-context';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

const OLD_STOCK_AGING_DAYS = 180;

export default function DashboardPage() {
  const { paperRolls, isLoading } = useInventory();

  const stats = useMemo(() => {
    if (isLoading || !paperRolls) {
      return {
        totalWeight: 0,
        totalRolls: 0,
        localStockWeight: 0,
        localStockRolls: 0,
        oldStockWeight: 0,
        oldStockRolls: 0,
      };
    }

    let totalWeight = 0;
    let totalRolls = 0;
    let localStockWeight = 0;
    let localStockRolls = 0;
    let oldStockWeight = 0;
    let oldStockRolls = 0;

    for (const roll of paperRolls) {
      totalWeight += roll.quantity;
      totalRolls += roll.rollCount;

      if (roll.aging > OLD_STOCK_AGING_DAYS) {
        oldStockWeight += roll.quantity;
        oldStockRolls += roll.rollCount;
      } else {
        localStockWeight += roll.quantity;
        localStockRolls += roll.rollCount;
      }
    }

    return {
      totalWeight,
      totalRolls,
      localStockWeight,
      localStockRolls,
      oldStockWeight,
      oldStockRolls,
    };
  }, [paperRolls, isLoading]);

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50">
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
                      {stats.totalRolls.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalWeight.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                      kg total berat
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rincian Stok</DialogTitle>
              <DialogDescription>
                Rincian stok berdasarkan kategori stok lokal dan stok lama. Stok
                dianggap lama jika usianya lebih dari {OLD_STOCK_AGING_DAYS} hari.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Warehouse className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Stok R1 (Lokal)
                    </p>
                    <p className="text-lg font-bold">
                      {stats.localStockRolls.toLocaleString()} Gulungan
                    </p>
                  </div>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                  {stats.localStockWeight.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Stok R2 (Lama)
                    </p>
                    <p className="text-lg font-bold">
                      {stats.oldStockRolls.toLocaleString()} Gulungan
                    </p>
                  </div>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                   {stats.oldStockWeight.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
