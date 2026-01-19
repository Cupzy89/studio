'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Boxes, ChevronDown } from 'lucide-react';
import { useInventory } from '@/context/inventory-context';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function DashboardPage() {
  const { paperRolls, isLoading } = useInventory();
  const [isOpen, setIsOpen] = useState(false);

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

      const batchVal = (roll.batch || '').toLowerCase();

      if (batchVal.includes('local')) {
        localStockWeight += roll.quantity;
        localStockRolls += roll.rollCount;
      } else if (batchVal.includes('old')) {
        oldStockWeight += roll.quantity;
        oldStockRolls += roll.rollCount;
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

  const kindStats = useMemo(() => {
    if (isLoading || !paperRolls) {
      return [];
    }

    const stats: { [key: string]: { rollCount: number; quantity: number } } = {};

    paperRolls.forEach(roll => {
      const kind = roll.type || 'Tidak Diketahui';
      if (!stats[kind]) {
        stats[kind] = { rollCount: 0, quantity: 0 };
      }
      stats[kind].rollCount += roll.rollCount;
      stats[kind].quantity += roll.quantity;
    });

    return Object.entries(stats)
      .map(([kind, data]) => ({ kind, ...data }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [paperRolls, isLoading]);

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  total stock paper roll
                </CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Boxes className="h-4 w-4" />
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  />
                </div>
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
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 grid gap-4 rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="mb-1">
                      <Badge variant="secondary">Stok R1 (Lokal)</Badge>
                    </div>
                    <p className="text-lg font-bold">
                      {stats.localStockRolls.toLocaleString()} Gulungan
                    </p>
                  </div>
                </div>
                <p className="text-sm font-mono font-bold">
                  {stats.localStockWeight.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{' '}
                  kg
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="mb-1">
                      <Badge variant="secondary">Stok R2 (Lama)</Badge>
                    </div>
                    <p className="text-lg font-bold">
                      {stats.oldStockRolls.toLocaleString()} Gulungan
                    </p>
                  </div>
                </div>
                <p className="text-sm font-mono font-bold">
                  {stats.oldStockWeight.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{' '}
                  kg
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Card>
          <CardHeader>
            <CardTitle>Stok Berdasarkan Jenis</CardTitle>
            <CardDescription>
              Rincian stok berdasarkan jenis kertas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis Kertas</TableHead>
                  <TableHead className="text-right">Jumlah Gulungan</TableHead>
                  <TableHead className="text-right">Total Berat (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20 float-right" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28 float-right" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : kindStats.length > 0 ? (
                  kindStats.map(item => (
                    <TableRow key={item.kind}>
                      <TableCell className="font-medium">{item.kind}</TableCell>
                      <TableCell className="text-right font-mono">
                        {item.rollCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {item.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Tidak ada data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
