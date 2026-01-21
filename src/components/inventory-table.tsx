'use client';
import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, Search, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

const FilterPopover = ({ title, options, selected, onSelectionChange }: { title: string, options: string[], selected: string[], onSelectionChange: (newSelection: string[]) => void }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-2">
          <h4 className="font-medium leading-none px-2 pt-1 pb-2">Filter berdasarkan {title}</h4>
          <ScrollArea className="h-40">
            <div className="p-2 space-y-2">
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${title}-${option}`}
                    checked={selected.includes(option)}
                    onCheckedChange={(checked) => {
                      const newSelection = checked
                        ? [...selected, option]
                        : selected.filter((item) => item !== option);
                      onSelectionChange(newSelection);
                    }}
                  />
                  <Label htmlFor={`${title}-${option}`} className="font-normal cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
           {selected.length > 0 &&
                <div className="p-2 border-t">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => onSelectionChange([])}>
                        Hapus Filter
                    </Button>
                </div>
            }
        </div>
      </PopoverContent>
    </Popover>
  );
}


export function InventoryTable() {
  const { 
    paperRolls, 
    isLoading, 
    agingFilter, 
    setAgingFilter, 
    kindFilter, 
    setKindFilter,
    gsmFilter,
    setGsmFilter,
    widthFilter,
    setWidthFilter,
   } = useInventory();
  const [partNoSearch, setPartNoSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof PaperRoll; direction: 'asc' | 'desc' } | null>(null);
  const [columnFilters, setColumnFilters] = useState<{
    type: string[];
    storageBin: string[];
  }>({
    type: [],
    storageBin: []
  });

  const { uniqueKinds, uniqueStorageBins } = useMemo(() => {
    if (isLoading || !paperRolls) return { uniqueKinds: [], uniqueStorageBins: [] };
    const kinds = [...new Set(paperRolls.map((roll) => roll.type).filter(Boolean))].sort();
    const bins = [...new Set(paperRolls.map((roll) => roll.storageBin).filter(Boolean))].sort();
    return { uniqueKinds: kinds, uniqueStorageBins: bins };
  }, [paperRolls, isLoading]);

  const requestSort = (key: keyof PaperRoll) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredRolls = useMemo(() => {
    let filtered = paperRolls.filter((roll) => {
      const searchMatch = partNoSearch
        ? roll.name.toLowerCase().includes(partNoSearch.toLowerCase())
        : true;
      const kindColumnMatch =
        columnFilters.type.length > 0
          ? columnFilters.type.includes(roll.type)
          : true;
      const storageBinMatch =
        columnFilters.storageBin.length > 0
            ? columnFilters.storageBin.includes(roll.storageBin)
            : true;
      
      const agingMatch = agingFilter
        ? (roll.aging >= agingFilter.min && (agingFilter.max === null || roll.aging <= agingFilter.max))
        : true;

      const kindContextMatch = kindFilter ? roll.type === kindFilter : true;
      const gsmMatch = gsmFilter ? roll.gsm === gsmFilter : true;
      const widthMatch = widthFilter ? roll.width === widthFilter : true;


      return searchMatch && kindColumnMatch && storageBinMatch && agingMatch && kindContextMatch && gsmMatch && widthMatch;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        let compareResult = 0;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            compareResult = aValue - bValue;
        } else {
            compareResult = String(aValue).localeCompare(String(bValue));
        }

        return sortConfig.direction === 'asc' ? compareResult : -compareResult;
      });
    }

    return filtered;
  }, [paperRolls, partNoSearch, columnFilters, sortConfig, agingFilter, kindFilter, gsmFilter, widthFilter]);

  const handleFilterChange = (column: 'type' | 'storageBin') => (selection: string[]) => {
    setColumnFilters(prev => ({ ...prev, [column]: selection }));
  }
  
  const getSortIcon = (columnKey: keyof PaperRoll) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Stock</CardTitle>
        <CardDescription>
          Tampilan mendetail dari semua gulungan kertas dalam inventaris.
        </CardDescription>
        <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="relative flex-grow min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Cari berdasarkan Part No..."
                    value={partNoSearch}
                    onChange={(e) => setPartNoSearch(e.target.value)}
                    className="pl-10 w-full md:w-1/2"
                />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {agingFilter && (
                    <Badge variant="secondary" className="py-1.5 px-3 flex items-center gap-2 text-sm">
                        Usia: {agingFilter.label}
                        <Button
                            variant="ghost" 
                            size="icon"
                            onClick={() => setAgingFilter(null)} 
                            className="h-5 w-5 -mr-1 rounded-full hover:bg-background/60"
                            aria-label="Hapus filter usia"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}
                {kindFilter && (
                    <Badge variant="secondary" className="py-1.5 px-3 flex items-center gap-2 text-sm">
                        Jenis: {kindFilter}
                        <Button
                            variant="ghost" 
                            size="icon"
                            onClick={() => setKindFilter(null)} 
                            className="h-5 w-5 -mr-1 rounded-full hover:bg-background/60"
                            aria-label="Hapus filter jenis"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}
                {gsmFilter && (
                    <Badge variant="secondary" className="py-1.5 px-3 flex items-center gap-2 text-sm">
                        GSM: {gsmFilter}
                        <Button
                            variant="ghost" 
                            size="icon"
                            onClick={() => setGsmFilter(null)} 
                            className="h-5 w-5 -mr-1 rounded-full hover:bg-background/60"
                            aria-label="Hapus filter gsm"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}
                {widthFilter && (
                    <Badge variant="secondary" className="py-1.5 px-3 flex items-center gap-2 text-sm">
                        Lebar: {widthFilter}
                        <Button
                            variant="ghost" 
                            size="icon"
                            onClick={() => setWidthFilter(null)} 
                            className="h-5 w-5 -mr-1 rounded-full hover:bg-background/60"
                            aria-label="Hapus filter lebar"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                 <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('name')} className="px-1 py-1 h-auto -ml-2">
                    Part No {getSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('id')} className="px-1 py-1 h-auto -ml-2">
                    SU No {getSortIcon('id')}
                  </Button>
                </TableHead>
                <TableHead>
                    <div className="flex items-center -ml-2">
                      <Button variant="ghost" onClick={() => requestSort('type')} className="px-1 py-1 h-auto">
                        Kind {getSortIcon('type')}
                      </Button>
                      <FilterPopover 
                        title="Kind"
                        options={uniqueKinds}
                        selected={columnFilters.type}
                        onSelectionChange={handleFilterChange('type')}
                      />
                    </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button variant="ghost" onClick={() => requestSort('grDate')} className="px-1 py-1 h-auto -ml-2">
                    GR Date {getSortIcon('grDate')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('gsm')} className="px-1 py-1 h-auto -ml-2">
                    Gsm {getSortIcon('gsm')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('width')} className="px-1 py-1 h-auto -ml-2">
                    Width {getSortIcon('width')}
                  </Button>
                </TableHead>
                 <TableHead className="hidden md:table-cell">
                  <Button variant="ghost" onClick={() => requestSort('length')} className="px-1 py-1 h-auto -ml-2">
                    Length {getSortIcon('length')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('aging')} className="px-1 py-1 h-auto -ml-2">
                    Aging {getSortIcon('aging')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                   <div className="flex items-center justify-end -mr-2">
                      <Button variant="ghost" onClick={() => requestSort('quantity')} className="px-1 py-1 h-auto">
                        Qty (Kg) {getSortIcon('quantity')}
                      </Button>
                   </div>
                </TableHead>
                <TableHead className="text-right">
                   <div className="flex items-center justify-end -mr-2">
                      <Button variant="ghost" onClick={() => requestSort('rollCount')} className="px-1 py-1 h-auto">
                        Roll-Cnt {getSortIcon('rollCount')}
                      </Button>
                   </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                    <div className="flex items-center -ml-2">
                      <Button variant="ghost" onClick={() => requestSort('storageBin')} className="px-1 py-1 h-auto">
                        Storage Bin {getSortIcon('storageBin')}
                      </Button>
                      <FilterPopover 
                        title="Storage Bin"
                        options={uniqueStorageBins}
                        selected={columnFilters.storageBin}
                        onSelectionChange={handleFilterChange('storageBin')}
                      />
                    </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 15 }).map((_, index) => (
                  <TableRow key={`skeleton-row-${index}`}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 float-right" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 float-right" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : sortedAndFilteredRolls.length > 0 ? (
                sortedAndFilteredRolls.map((roll) => (
                  <TableRow key={roll.id}>
                    <TableCell className="font-medium">{roll.name}</TableCell>
                    <TableCell>{roll.id}</TableCell>
                    <TableCell>{roll.type}</TableCell>
                    <TableCell className="hidden md:table-cell">{roll.grDate}</TableCell>
                    <TableCell>{roll.gsm}</TableCell>
                    <TableCell>{roll.width}</TableCell>
                    <TableCell className="hidden md:table-cell">{roll.length}</TableCell>
                    <TableCell>{roll.aging}</TableCell>
                    <TableCell className="text-right font-mono">{roll.quantity.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })}</TableCell>
                    <TableCell className="text-right font-mono">{roll.rollCount}</TableCell>
                    <TableCell className="hidden md:table-cell">{roll.storageBin}</TableCell>
                  </TableRow>
                ))
              ) : (
                  <TableRow>
                      <TableCell colSpan={11} className="h-24 text-center">
                          Tidak ada hasil yang ditemukan.
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
