'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Loader2, Sparkles } from 'lucide-react';
import {
  optimizePaperRollOrders,
  type OptimizePaperRollOrdersOutput,
} from '@/ai/flows/optimize-paper-roll-orders';
import { aiOptimizationInput } from '@/lib/ai-data';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export function OrderOptimizer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizePaperRollOrdersOutput | null>(
    null
  );
  const { toast } = useToast();

  const handleOptimize = async () => {
    setLoading(true);
    setResult(null);
    try {
      const optimizedOrders = await optimizePaperRollOrders(aiOptimizationInput);
      setResult(optimizedOrders);
    } catch (error) {
      console.error('Optimasi gagal:', error);
      toast({
        variant: 'destructive',
        title: 'Optimasi Gagal',
        description: 'Tidak dapat menghasilkan pesanan yang dioptimalkan. Silakan coba lagi.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-accent" />
          Pengoptimal Pesanan AI
        </CardTitle>
        <CardDescription>
          Gunakan AI untuk mendapatkan saran pesanan yang dioptimalkan berdasarkan inventaris, penggunaan, dan data pemasok Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[150px]">
        {loading && (
          <div className="flex h-full min-h-[150px] flex-col items-center justify-center rounded-lg border border-dashed">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="mt-4 text-muted-foreground">
              Menganalisis data dan menghasilkan saran...
            </span>
          </div>
        )}
        {!loading && !result && (
            <div className="flex h-full min-h-[150px] flex-col items-center justify-center rounded-lg border border-dashed">
                <Sparkles className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Klik tombol untuk menghasilkan saran pesanan</p>
            </div>
        )}
        {result && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipe Gulungan</TableHead>
                <TableHead>Pemasok</TableHead>
                <TableHead className="text-right">Kuantitas</TableHead>
                <TableHead className="text-right">Perk. Biaya</TableHead>
                <TableHead>Perk. Pengiriman</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{order.rollType}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell className="text-right font-mono">
                    {order.quantity}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${order.cost.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.estimatedDeliveryDate), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleOptimize} disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengoptimalkan...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Hasilkan Saran
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
