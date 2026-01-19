'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useInventory, type AgingFilter } from '@/context/inventory-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from './ui/skeleton';

interface KindBreakdownDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  agingFilter: AgingFilter | null;
}

export function KindBreakdownDialog({ isOpen, onOpenChange, agingFilter }: KindBreakdownDialogProps) {
  const { paperRolls, isLoading, setAgingFilter, setKindFilter } = useInventory();
  const router = useRouter();

  const kindBreakdown = useMemo(() => {
    if (isLoading || !paperRolls || !agingFilter) {
      return [];
    }

    const filteredRolls = paperRolls.filter(roll => 
      roll.aging >= agingFilter.min && (agingFilter.max === null || roll.aging <= agingFilter.max)
    );

    const breakdown: { [key: string]: { rolls: number; weight: number } } = {};

    filteredRolls.forEach(roll => {
      const kind = roll.type || 'Tidak Diketahui';
      if (!breakdown[kind]) {
        breakdown[kind] = { rolls: 0, weight: 0 };
      }
      breakdown[kind].rolls += roll.rollCount;
      breakdown[kind].weight += roll.quantity;
    });

    return Object.entries(breakdown).map(([kind, stats]) => ({
      kind,
      ...stats,
    }));

  }, [paperRolls, isLoading, agingFilter]);

  const handleKindClick = (kind: string) => {
    if (agingFilter) {
      setAgingFilter(agingFilter);
    }
    setKindFilter(kind);
    onOpenChange(false);
    router.push('/inventory');
  };

  if (!agingFilter) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rincian Stok Berdasarkan Jenis</DialogTitle>
          <DialogDescription>
            Menampilkan rincian untuk kategori usia: <span className="font-semibold">{agingFilter.label}</span>. Klik jenis untuk memfilter inventaris.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
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
                 Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 float-right" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 float-right" /></TableCell>
                  </TableRow>
                ))
              ) : kindBreakdown.length > 0 ? (
                kindBreakdown.map(item => (
                  <TableRow key={item.kind} onClick={() => handleKindClick(item.kind)} className="cursor-pointer hover:bg-muted">
                    <TableCell className="font-medium">{item.kind}</TableCell>
                    <TableCell className="text-right font-mono">{item.rolls.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{item.weight.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Tidak ada stok dalam kategori usia ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
