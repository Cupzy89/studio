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
import type { PaperRoll } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

export function InventoryTable() {
  const { paperRolls, isLoading } = useInventory();

  // useMemo will re-calculate only when paperRolls changes.
  const memoizedPaperRolls = useMemo(() => paperRolls, [paperRolls]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Stock</CardTitle>
        <CardDescription>
          Stock paper roll
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kind</TableHead>
              <TableHead className="text-right">Roll-Cnt</TableHead>
              <TableHead className="text-right">Qty (Kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-row-${index}`}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 float-right" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 float-right" /></TableCell>
                </TableRow>
              ))
            ) : memoizedPaperRolls.length > 0 ? (
              memoizedPaperRolls.map((roll: PaperRoll, index: number) => (
                <TableRow key={roll.id || `roll-${index}`}>
                  <TableCell>{roll.type}</TableCell>
                  <TableCell className="text-right font-mono">{roll.rollCount}</TableCell>
                  <TableCell className="text-right font-mono">{roll.quantity.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center">
                        Tidak ada data inventaris. Silakan unggah file.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
