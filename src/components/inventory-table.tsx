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
              <TableHead>Kind</TableHead>
              <TableHead className="text-right">Roll-Cnt</TableHead>
              <TableHead className="text-right">Qty (Kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memoizedPaperRolls.map((roll: PaperRoll) => (
              <TableRow key={roll.id}>
                <TableCell>{roll.type}</TableCell>
                <TableCell className="text-right font-mono">{roll.rollCount}</TableCell>
                <TableCell className="text-right font-mono">{roll.quantity.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
