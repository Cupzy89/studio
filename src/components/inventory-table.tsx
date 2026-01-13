'use client';
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
import { paperRolls } from '@/lib/data';
import type { PaperRoll } from '@/lib/types';
import { ScrollText, AlertTriangle } from 'lucide-react';

export function InventoryTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Real-time overview of all paper rolls.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll Type</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paperRolls.map((roll: PaperRoll) => (
              <TableRow key={roll.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <ScrollText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium">{roll.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {roll.type}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {roll.quantity < roll.reorderLevel ? (
                    <Badge
                      variant="destructive"
                      className="flex items-center justify-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" /> Low Stock
                    </Badge>
                  ) : (
                    <Badge variant="secondary">In Stock</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono text-lg">
                  {roll.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
