'use client';

import { useInventory, type AgingFilter } from '@/context/inventory-context';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';

export default function AnalysisPage() {
  const { paperRolls, isLoading, setAgingFilter } = useInventory();
  const router = useRouter();

  const agingStats = useMemo(() => {
    if (isLoading || !paperRolls) {
      return {
        under3: { rolls: 0, weight: 0 },
        '3to6': { rolls: 0, weight: 0 },
        '6to12': { rolls: 0, weight: 0 },
        over12: { rolls: 0, weight: 0 },
      };
    }

    const categories = {
      under3: { rolls: 0, weight: 0 },
      '3to6': { rolls: 0, weight: 0 },
      '6to12': { rolls: 0, weight: 0 },
      over12: { rolls: 0, weight: 0 },
    };

    paperRolls.forEach(roll => {
      const agingDays = roll.aging;
      if (agingDays < 90) {
        categories.under3.rolls += roll.rollCount;
        categories.under3.weight += roll.quantity;
      } else if (agingDays >= 90 && agingDays < 180) {
        categories['3to6'].rolls += roll.rollCount;
        categories['3to6'].weight += roll.quantity;
      } else if (agingDays >= 180 && agingDays < 365) {
        categories['6to12'].rolls += roll.rollCount;
        categories['6to12'].weight += roll.quantity;
      } else {
        categories.over12.rolls += roll.rollCount;
        categories.over12.weight += roll.quantity;
      }
    });

    return categories;
  }, [paperRolls, isLoading]);

  const agingData: {
    category: string;
    stats: { rolls: number; weight: number };
    filter: AgingFilter;
  }[] = [
    { category: 'Di Bawah 3 Bulan', stats: agingStats.under3, filter: { min: 0, max: 89, label: 'Di Bawah 3 Bulan' } },
    { category: '3-6 Bulan', stats: agingStats['3to6'], filter: { min: 90, max: 179, label: '3-6 Bulan' } },
    { category: '6-12 Bulan', stats: agingStats['6to12'], filter: { min: 180, max: 364, label: '6-12 Bulan' } },
    { category: 'Di Atas 12 Bulan', stats: agingStats.over12, filter: { min: 365, max: null, label: 'Di Atas 12 Bulan' } },
  ];

  const handleRowClick = (filter: AgingFilter) => {
    setAgingFilter(filter);
    router.push('/inventory');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analisis Usia Stok</h1>
      <Card>
        <CardHeader>
          <CardTitle>Rangkuman Usia Stok</CardTitle>
          <CardDescription>
            Tabel rincian jumlah gulungan dan berat berdasarkan kategori usia. Klik baris untuk memfilter inventaris.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategori Usia</TableHead>
                <TableHead className="text-right">Jumlah Gulungan</TableHead>
                <TableHead className="text-right">Total Berat (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
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
              ) : (
                agingData.map(item => (
                  <TableRow key={item.category} onClick={() => handleRowClick(item.filter)} className="cursor-pointer hover:bg-muted">
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell className="text-right font-mono">
                      {item.stats.rolls.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.stats.weight.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
