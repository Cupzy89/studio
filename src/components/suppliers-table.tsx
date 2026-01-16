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

interface SupplierSummary {
  vendorName: string;
  totalRolls: number;
  totalQuantity: number;
}

export function SuppliersTable() {
  const { paperRolls, isLoading } = useInventory();

  const supplierSummary: SupplierSummary[] = useMemo(() => {
    if (isLoading || !paperRolls) {
      return [];
    }

    const summary: Record<string, { totalRolls: number; totalQuantity: number }> = {};

    paperRolls.forEach(roll => {
      const vendor = roll.vendorName || 'Tidak Diketahui';
      if (!summary[vendor]) {
        summary[vendor] = { totalRolls: 0, totalQuantity: 0 };
      }
      summary[vendor].totalRolls += roll.rollCount;
      summary[vendor].totalQuantity += roll.quantity;
    });

    return Object.entries(summary)
      .map(([vendorName, totals]) => ({
        vendorName,
        ...totals,
      }))
      .sort((a, b) => a.vendorName.localeCompare(b.vendorName));

  }, [paperRolls, isLoading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ringkasan Pemasok</CardTitle>
        <CardDescription>
          Total gulungan dan kuantitas (kg) berdasarkan pemasok.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Nama Pemasok</TableHead>
                <TableHead className="text-right">Total Gulungan</TableHead>
                <TableHead className="text-right">Total Kuantitas (Kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-supplier-${index}`}>
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
              ) : supplierSummary.length > 0 ? (
                supplierSummary.map((supplier) => (
                  <TableRow key={supplier.vendorName}>
                    <TableCell className="font-medium">{supplier.vendorName}</TableCell>
                    <TableCell className="text-right font-mono">
                      {supplier.totalRolls.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {supplier.totalQuantity.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Tidak ada data pemasok yang ditemukan.
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
