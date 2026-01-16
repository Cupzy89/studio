'use client';
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
import type { PaperRoll } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

export function InventoryTable() {
  const { paperRolls, isLoading } = useInventory();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Stock</CardTitle>
        <CardDescription>
          Tampilan mendetail dari semua gulungan kertas dalam inventaris.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>Part No</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>GR Date</TableHead>
                <TableHead>Gsm</TableHead>
                <TableHead>Width</TableHead>
                <TableHead className="text-right">Qty (Kg)</TableHead>
                <TableHead className="text-right">Roll-Cnt</TableHead>
                <TableHead>Storage Bin</TableHead>
                <TableHead>Vendor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 15 }).map((_, index) => (
                  <TableRow key={`skeleton-row-${index}`}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 float-right" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 float-right" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : paperRolls && paperRolls.length > 0 ? (
                paperRolls.map((roll: PaperRoll, index: number) => (
                  <TableRow key={`${roll.id}-${index}`}>
                    <TableCell className="font-medium">{roll.name}</TableCell>
                    <TableCell>{roll.type}</TableCell>
                    <TableCell>{roll.grDate}</TableCell>
                    <TableCell>{roll.gsm}</TableCell>
                    <TableCell>{roll.width}</TableCell>
                    <TableCell className="text-right font-mono">{roll.quantity.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })}</TableCell>
                    <TableCell className="text-right font-mono">{roll.rollCount}</TableCell>
                    <TableCell>{roll.storageBin}</TableCell>
                    <TableCell>{roll.vendorName}</TableCell>
                  </TableRow>
                ))
              ) : (
                  <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                          Tidak ada data inventaris. Silakan unggah file.
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
