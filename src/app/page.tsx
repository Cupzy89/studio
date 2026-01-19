'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Boxes, ChevronDown } from 'lucide-react';
import { useInventory } from '@/context/inventory-context';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { paperRolls, isLoading } = useInventory();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-1">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
             <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    total stock paper roll
                  </CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <Boxes className="h-4 w-4" />
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
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
                      <Badge variant="secondary">Stok R1 (Local)</Badge>
                    </div>
                    <p className="text-lg font-bold">
                      {stats.localStockRolls.toLocaleString()} Gulungan
                    </p>
                  </div>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                  {stats.localStockWeight.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="mb-1">
                      <Badge variant="secondary">Stok R2 (Old)</Badge>
                    </div>
                    <p className="text-lg font-bold">
                      {stats.oldStockRolls.toLocaleString()} Gulungan
                    </p>
                  </div>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                   {stats.oldStockWeight.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
}
