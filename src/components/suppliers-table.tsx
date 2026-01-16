'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInventory } from '@/context/inventory-context';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';

interface KindSummary {
  kind: string;
  totalRolls: number;
  totalQuantity: number;
}

export function SuppliersTable() {
  const { paperRolls, isLoading } = useInventory();

  const kindSummary: KindSummary[] = useMemo(() => {
    if (isLoading || !paperRolls) {
      return [];
    }

    const summary: Record<string, { totalRolls: number; totalQuantity: number }> = {};

    paperRolls.forEach(roll => {
      const kind = roll.type || 'Tidak Diketahui';
      if (!summary[kind]) {
        summary[kind] = { totalRolls: 0, totalQuantity: 0 };
      }
      summary[kind].totalRolls += roll.rollCount;
      summary[kind].totalQuantity += roll.quantity;
    });

    return Object.entries(summary)
      .map(([kind, totals]) => ({
        kind,
        ...totals,
      }))
      .sort((a, b) => a.kind.localeCompare(b.kind));

  }, [paperRolls, isLoading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ringkasan Berdasarkan Jenis</CardTitle>
        <CardDescription>
          Total gulungan dan kuantitas (kg) berdasarkan jenis kertas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Jenis Kertas</TableHead>
                <TableHead className="text-right">Total Gulungan</TableHead>
                <TableHead className="text-right">Total Kuantitas (Kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-kind-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-20 float-right" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-24 float-right" />
                    </TableCell>
                  </TableRow>
                ))
              ) : kindSummary.length > 0 ? (
                kindSummary.map((item) => (
                  <TableRow key={item.kind}>
                    <TableCell className="font-medium">{item.kind}</TableCell>
                    <TableCell className="text-right font-mono">
                      {item.totalRolls.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.totalQuantity.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Tidak ada data jenis yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
