'use client';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
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
import { AlertTriangle } from 'lucide-react';

export function InventoryTable() {
  const { paperRolls } = useInventory();

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
              <TableHead>Part No</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>GR Date</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead className="text-right">Gsm</TableHead>
              <TableHead className="text-right">Width</TableHead>
              <TableHead>SU No</TableHead>
              <TableHead className="text-right">Qty (Kg)</TableHead>
              <TableHead className="text-right">Roll-Cnt</TableHead>
              <TableHead>Bin</TableHead>
              <TableHead className="text-right">Aging</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead className="text-right">Diameter</TableHead>
              <TableHead className="text-right">Length</TableHead>
              <TableHead>Vendor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memoizedPaperRolls.map((roll: PaperRoll) => (
              <TableRow key={roll.id}>
                <TableCell className="font-medium">{roll.name}</TableCell>
                <TableCell>
                  {roll.quantity < roll.reorderLevel ? (
                    <Badge
                      variant="destructive"
                      className="flex items-center justify-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" /> Stok Menipis
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Tersedia</Badge>
                  )}
                </TableCell>
                <TableCell>{roll.grDate}</TableCell>
                <TableCell>{roll.type}</TableCell>
                <TableCell className="text-right font-mono">{roll.gsm}</TableCell>
                <TableCell className="text-right font-mono">{roll.width}</TableCell>
                <TableCell>{roll.id}</TableCell>
                <TableCell className="text-right font-mono">{roll.quantity.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono">{roll.rollCount}</TableCell>
                <TableCell>{roll.storageBin}</TableCell>
                <TableCell className="text-right font-mono">{roll.aging}</TableCell>
                <TableCell>{roll.batch}</TableCell>
                <TableCell className="text-right font-mono">{roll.diameter}</TableCell>
                <TableCell className="text-right font-mono">{roll.length}</TableCell>
                <TableCell>{roll.vendorName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
