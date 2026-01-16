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

interface AggregatedRoll {
  type: string;
  rollCount: number;
  quantity: number;
}

export function InventoryTable() {
  const { paperRolls, isLoading } = useInventory();

  const aggregatedData = useMemo(() => {
    if (!paperRolls) {
      return [];
    }

    const groupedData = paperRolls.reduce((acc, roll) => {
      const kind = roll.type || 'N/A';
      if (!acc[kind]) {
        acc[kind] = { type: kind, rollCount: 0, quantity: 0 };
      }
      acc[kind].rollCount += Number(roll.rollCount) || 0;
      acc[kind].quantity += Number(roll.quantity) || 0;
      return acc;
    }, {} as { [key: string]: AggregatedRoll });

    return Object.values(groupedData).sort((a, b) => a.type.localeCompare(b.type));
  }, [paperRolls]);

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
            ) : aggregatedData.length > 0 ? (
              aggregatedData.map((group: AggregatedRoll) => (
                <TableRow key={group.type}>
                  <TableCell>{group.type}</TableCell>
                  <TableCell className="text-right font-mono">{group.rollCount}</TableCell>
                  <TableCell className="text-right font-mono">{group.quantity.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })}</TableCell>
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
