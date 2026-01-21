'use client';

import { useInventory, type AgingFilter } from '@/context/inventory-context';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';


// Define the structure for nested statistics
interface WidthStats {
  rolls: number;
  weight: number;
}
interface GsmStats {
  rolls: number;
  weight: number;
  widths: Record<string, WidthStats>;
}
interface KindStats {
  rolls: number;
  weight: number;
  gsms: Record<string, GsmStats>;
}
interface AgingCategoryStats {
  rolls: number;
  weight: number;
  kinds: Record<string, KindStats>;
}
type NestedStats = Record<string, AgingCategoryStats>;


export default function AnalysisPage() {
  const { 
    paperRolls, 
    isLoading,
    setAgingFilter,
    setKindFilter,
    setGsmFilter,
    setWidthFilter,
  } = useInventory();
  const router = useRouter();

  // State for expanded rows
  const [expandedAging, setExpandedAging] = useState<Set<string>>(new Set());
  const [expandedKinds, setExpandedKinds] = useState<Set<string>>(new Set());
  const [expandedGsms, setExpandedGsms] = useState<Set<string>>(new Set());

  const toggleAging = (key: string) => {
    setExpandedAging(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleKind = (key: string) => {
    setExpandedKinds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };
  
  const toggleGsm = (key: string) => {
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

  const handleWidthClick = (agingFilter: AgingFilter, kind: string, gsm: string, width: string) => {
    setAgingFilter(agingFilter);
    setKindFilter(kind);
    setGsmFilter(Number(gsm));
    setWidthFilter(Number(width));
    router.push('/inventory');
  };

  const nestedStats = useMemo(() => {
    if (isLoading || !paperRolls) {
      return {};
    }

    const stats: NestedStats = {
      under3: { rolls: 0, weight: 0, kinds: {} },
      '3to6': { rolls: 0, weight: 0, kinds: {} },
      '6to12': { rolls: 0, weight: 0, kinds: {} },
      over12: { rolls: 0, weight: 0, kinds: {} },
    };

    paperRolls.forEach(roll => {
      let categoryKey: keyof NestedStats;
      const agingDays = roll.aging;
      if (agingDays < 90) categoryKey = 'under3';
      else if (agingDays < 180) categoryKey = '3to6';
      else if (agingDays < 365) categoryKey = '6to12';
      else categoryKey = 'over12';

      const kind = roll.type || 'Tidak Diketahui';
      const gsm = String(roll.gsm || 'N/A');
      const width = String(roll.width || 'N/A');

      const category = stats[categoryKey];
      category.rolls += roll.rollCount;
      category.weight += roll.quantity;

      if (!category.kinds[kind]) {
        category.kinds[kind] = { rolls: 0, weight: 0, gsms: {} };
      }
      const kindStat = category.kinds[kind];
      kindStat.rolls += roll.rollCount;
      kindStat.weight += roll.quantity;
      
      if (!kindStat.gsms[gsm]) {
        kindStat.gsms[gsm] = { rolls: 0, weight: 0, widths: {} };
      }
      const gsmStat = kindStat.gsms[gsm];
      gsmStat.rolls += roll.rollCount;
      gsmStat.weight += roll.quantity;

      if (!gsmStat.widths[width]) {
        gsmStat.widths[width] = { rolls: 0, weight: 0 };
      }
      const widthStat = gsmStat.widths[width];
      widthStat.rolls += roll.rollCount;
      widthStat.weight += roll.quantity;
    });

    return stats;
  }, [paperRolls, isLoading]);

  const agingData: {
    key: string;
    category: string;
    stats: AgingCategoryStats;
    filter: AgingFilter;
  }[] = [
    { key: 'under3', category: 'Di Bawah 3 Bulan', stats: nestedStats.under3, filter: { min: 0, max: 89, label: 'Di Bawah 3 Bulan' } },
    { key: '3to6', category: '3-6 Bulan', stats: nestedStats['3to6'], filter: { min: 90, max: 179, label: '3-6 Bulan' } },
    { key: '6to12', category: '6-12 Bulan', stats: nestedStats['6to12'], filter: { min: 180, max: 364, label: '6-12 Bulan' } },
    { key: 'over12', category: 'Di Atas 12 Bulan', stats: nestedStats.over12, filter: { min: 365, max: null, label: 'Di Atas 12 Bulan' } },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analisis Usia Stok</h1>
      <Card>
        <CardHeader>
          <CardTitle>Rangkuman Usia Stok</CardTitle>
          <CardDescription>
            Tabel rincian jumlah gulungan dan berat berdasarkan kategori usia. Klik baris untuk melihat rincian.
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
                Array.from({ length: 4 }).map((_, index) => (
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
              ) : (
                agingData.map(agingItem => (
                  <React.Fragment key={agingItem.key}>
                    <TableRow onClick={() => toggleAging(agingItem.key)} className="cursor-pointer hover:bg-muted/80">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           <ChevronDown
                              className={cn(
                                'h-4 w-4 transform transition-transform',
                                expandedAging.has(agingItem.key) && 'rotate-180'
                              )}
                            />
                          {agingItem.category}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {agingItem.stats.rolls.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {agingItem.stats.weight.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </TableCell>
                    </TableRow>
                    {expandedAging.has(agingItem.key) && Object.entries(agingItem.stats.kinds).sort(([,a], [,b]) => b.weight - a.weight).map(([kindName, kindStats]) => {
                      const kindKey = `${agingItem.key}-${kindName}`;
                      const isKindExpanded = expandedKinds.has(kindKey);
                      return (
                        <React.Fragment key={kindKey}>
                          <TableRow onClick={() => toggleKind(kindKey)} className="cursor-pointer bg-muted/50 hover:bg-muted/80">
                            <TableCell className="pl-8 font-medium">
                               <div className="flex items-center gap-2">
                                <ChevronDown
                                  className={cn(
                                    'h-4 w-4 transform transition-transform',
                                    isKindExpanded && 'rotate-180'
                                  )}
                                />
                                {kindName}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">{kindStats.rolls.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono">{kindStats.weight.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                          </TableRow>
                          {isKindExpanded && Object.entries(kindStats.gsms).sort(([gsmA], [gsmB]) => Number(gsmB) - Number(gsmA)).map(([gsmValue, gsmStats]) => {
                            const gsmKey = `${kindKey}-${gsmValue}`;
                            const isGsmExpanded = expandedGsms.has(gsmKey);
                            return (
                              <React.Fragment key={gsmKey}>
                                <TableRow onClick={() => toggleGsm(gsmKey)} className="cursor-pointer bg-muted/30 hover:bg-muted/50">
                                  <TableCell className="pl-16 font-medium">
                                    <div className="flex items-center gap-2">
                                      <ChevronDown
                                        className={cn(
                                          'h-4 w-4 transform transition-transform',
                                          isGsmExpanded && 'rotate-180'
                                        )}
                                      />
                                      <span>GSM: {gsmValue}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right font-mono">{gsmStats.rolls.toLocaleString()}</TableCell>
                                  <TableCell className="text-right font-mono">{gsmStats.weight.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                                </TableRow>
                                {isGsmExpanded && Object.entries(gsmStats.widths).sort(([widthA], [widthB]) => Number(widthB) - Number(widthA)).map(([widthValue, widthStats]) => (
                                  <TableRow 
                                    key={`${gsmKey}-${widthValue}`} 
                                    onClick={() => handleWidthClick(agingItem.filter, kindName, gsmValue, widthValue)}
                                    className="cursor-pointer bg-muted/20 hover:bg-muted/40"
                                  >
                                    <TableCell className="pl-24">
                                       <span className="ml-6">Width: {widthValue}</span>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{widthStats.rolls.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-mono">{widthStats.weight.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                                  </TableRow>
                                ))}
                              </React.Fragment>
                            )
                          })}
                        </React.Fragment>
                      )
                    })}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
