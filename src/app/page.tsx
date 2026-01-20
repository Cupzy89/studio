'use client';

import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Boxes, ChevronDown } from 'lucide-react';
import { useInventory } from '@/context/inventory-context';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const {
    paperRolls,
    isLoading,
    setKindFilter,
    setGsmFilter,
    setWidthFilter,
    setAgingFilter,
  } = useInventory();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  // State for expanded rows
  const [expandedKinds, setExpandedKinds] = useState<Set<string>>(new Set());
  const [expandedGsms, setExpandedGsms] = useState<Set<string>>(new Set());

  const toggleKind = (kind: string) => {
    setExpandedKinds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(kind)) {
        newSet.delete(kind);
        // When collapsing a kind, collapse all its children gsms.
        setExpandedGsms(prevGsms => {
          const nextGsms = new Set(prevGsms);
          prevGsms.forEach(gsmKey => {
            if (gsmKey.startsWith(`${kind}-`)) {
              nextGsms.delete(gsmKey);
            }
          });
          return nextGsms;
        });
      } else {
        newSet.add(kind);
      }
      return newSet;
    });
  };

  const toggleGsm = (kind: string, gsm: string) => {
    const key = `${kind}-${gsm}`;
    setExpandedGsms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleWidthClick = (kind: string, gsm: string, width: string) => {
    // Clear other filters that might conflict from other pages
    setAgingFilter(null);
    
    // Set the new filters
    setKindFilter(kind);
    setGsmFilter(Number(gsm));
    setWidthFilter(Number(width));
    
    // Navigate to the inventory page
    router.push('/inventory');
  };

  const stats = useMemo(() => {
    if (isLoading || !paperRolls) {
      return {
        totalWeight: 0,
        totalRolls: 0,
        localStockWeight: 0,
        localStockRolls: 0,
        oldStockWeight: 0,
        oldStockRolls: 0,
      };
    }

    let totalWeight = 0;
    let totalRolls = 0;
    let localStockWeight = 0;
    let localStockRolls = 0;
    let oldStockWeight = 0;
    let oldStockRolls = 0;

    for (const roll of paperRolls) {
      totalWeight += roll.quantity;
      totalRolls += roll.rollCount;

      const batchVal = (roll.batch || '').toLowerCase();

      if (batchVal.includes('local')) {
        localStockWeight += roll.quantity;
        localStockRolls += roll.rollCount;
      } else if (batchVal.includes('old')) {
        oldStockWeight += roll.quantity;
        oldStockRolls += roll.rollCount;
      }
    }

    return {
      totalWeight,
      totalRolls,
      localStockWeight,
      localStockRolls,
      oldStockWeight,
      oldStockRolls,
    };
  }, [paperRolls, isLoading]);

  const nestedKindStats = useMemo(() => {
    if (isLoading || !paperRolls) {
      return {};
    }

    const stats: Record<
      string,
      {
        rollCount: number;
        quantity: number;
        gsms: Record<
          string,
          {
            rollCount: number;
            quantity: number;
            widths: Record<
              string,
              {
                rollCount: number;
                quantity: number;
              }
            >;
          }
        >;
      }
    > = {};

    paperRolls.forEach(roll => {
      const kind = roll.type || 'Tidak Diketahui';
      const gsm = String(roll.gsm || 'N/A');
      const width = String(roll.width || 'N/A');

      if (!stats[kind]) {
        stats[kind] = { rollCount: 0, quantity: 0, gsms: {} };
      }
      if (!stats[kind].gsms[gsm]) {
        stats[kind].gsms[gsm] = { rollCount: 0, quantity: 0, widths: {} };
      }
      if (!stats[kind].gsms[gsm].widths[width]) {
        stats[kind].gsms[gsm].widths[width] = { rollCount: 0, quantity: 0 };
      }

      stats[kind].rollCount += roll.rollCount;
      stats[kind].quantity += roll.quantity;

      stats[kind].gsms[gsm].rollCount += roll.rollCount;
      stats[kind].gsms[gsm].quantity += roll.quantity;

      stats[kind].gsms[gsm].widths[width].rollCount += roll.rollCount;
      stats[kind].gsms[gsm].widths[width].quantity += roll.quantity;
    });

    return stats;
  }, [paperRolls, isLoading]);

  const sortedKindStats = useMemo(
    () =>
      Object.entries(nestedKindStats)
        .map(([kind, data]) => ({ kind, ...data }))
        .sort((a, b) => b.quantity - a.quantity),
    [nestedKindStats]
  );

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  total stock paper roll
                </CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Boxes className="h-4 w-4" />
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-3/4" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats.totalRolls.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalWeight.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{' '}
                      kg total berat
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 grid gap-4 rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="mb-1">
                      <Badge variant="secondary">Stok R1 (Lokal)</Badge>
                    </div>
                    <p className="text-lg font-bold">
                      {stats.localStockRolls.toLocaleString()} Gulungan
                    </p>
                  </div>
                </div>
                <p className="text-sm font-mono font-bold">
                  {stats.localStockWeight.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{' '}
                  kg
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="mb-1">
                      <Badge variant="secondary">Stok R2 (Lama)</Badge>
                    </div>
                    <p className="text-lg font-bold">
                      {stats.oldStockRolls.toLocaleString()} Gulungan
                    </p>
                  </div>
                </div>
                <p className="text-sm font-mono font-bold">
                  {stats.oldStockWeight.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{' '}
                  kg
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Card>
          <CardHeader>
            <CardTitle>Stok Berdasarkan Jenis</CardTitle>
            <CardDescription>
              Rincian stok berdasarkan jenis kertas, GSM, dan lebar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rincian</TableHead>
                  <TableHead className="text-right">Jumlah Gulungan</TableHead>
                  <TableHead className="text-right">Total Berat (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20 float-right" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28 float-right" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sortedKindStats.length > 0 ? (
                  sortedKindStats.map(
                    ({ kind, rollCount, quantity, gsms }) => {
                      const isKindExpanded = expandedKinds.has(kind);
                      const sortedGsms = Object.entries(gsms)
                        .map(([gsm, data]) => ({ gsm, ...data }))
                        .sort((a, b) => {
                          const aNum = Number(a.gsm);
                          const bNum = Number(b.gsm);
                          if (isNaN(aNum)) return 1;
                          if (isNaN(bNum)) return -1;
                          return bNum - aNum;
                        });

                      return (
                        <React.Fragment key={kind}>
                          <TableRow
                            onClick={() => toggleKind(kind)}
                            className="cursor-pointer hover:bg-muted/80"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <ChevronDown
                                  className={cn(
                                    'h-4 w-4 transform transition-transform',
                                    isKindExpanded && 'rotate-180'
                                  )}
                                />
                                {kind}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {rollCount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {quantity.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                            </TableCell>
                          </TableRow>

                          {isKindExpanded &&
                            sortedGsms.map(
                              ({
                                gsm,
                                rollCount: gsmRollCount,
                                quantity: gsmQuantity,
                                widths,
                              }) => {
                                const gsmKey = `${kind}-${gsm}`;
                                const isGsmExpanded = expandedGsms.has(gsmKey);
                                const sortedWidths = Object.entries(widths)
                                  .map(([width, data]) => ({ width, ...data }))
                                  .sort((a, b) => {
                                    const aNum = Number(a.width);
                                    const bNum = Number(b.width);
                                    if (isNaN(aNum)) return 1;
                                    if (isNaN(bNum)) return -1;
                                    return bNum - aNum;
                                  });

                                return (
                                  <React.Fragment key={gsmKey}>
                                    <TableRow
                                      onClick={() => toggleGsm(kind, gsm)}
                                      className="cursor-pointer bg-muted/50 hover:bg-muted/80"
                                    >
                                      <TableCell className="pl-8 font-medium">
                                        <div className="flex items-center gap-2">
                                          <ChevronDown
                                            className={cn(
                                              'h-4 w-4 transform transition-transform',
                                              isGsmExpanded && 'rotate-180'
                                            )}
                                          />
                                          <span>GSM: {gsm}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-right font-mono">
                                        {gsmRollCount.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="text-right font-mono">
                                        {gsmQuantity.toLocaleString(
                                          undefined,
                                          {
                                            maximumFractionDigits: 0,
                                          }
                                        )}
                                      </TableCell>
                                    </TableRow>

                                    {isGsmExpanded &&
                                      sortedWidths.map(
                                        ({
                                          width,
                                          rollCount: widthRollCount,
                                          quantity: widthQuantity,
                                        }) => (
                                          <TableRow
                                            key={`${gsmKey}-${width}`}
                                            className="bg-muted/30 cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleWidthClick(kind, gsm, width)}
                                          >
                                            <TableCell className="pl-16">
                                              <span className="ml-6">
                                                Width: {width}
                                              </span>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                              {widthRollCount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                              {widthQuantity.toLocaleString(
                                                undefined,
                                                {
                                                  maximumFractionDigits: 0,
                                                }
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                  </React.Fragment>
                                );
                              }
                            )}
                        </React.Fragment>
                      );
                    }
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Tidak ada data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
