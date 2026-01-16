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
import { Filter, Search } from 'lucide-react';
import { Label } from './ui/label';

const FilterPopover = ({ title, options, selected, onSelectionChange }: { title: string, options: string[], selected: string[], onSelectionChange: (newSelection: string[]) => void }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
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
  const { paperRolls, isLoading } = useInventory();
  const [partNoSearch, setPartNoSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<{
    type: string[];
    vendorName: string[];
    storageBin: string[];
  }>({
    type: [],
    vendorName: [],
    storageBin: []
  });

  const { uniqueKinds, uniqueVendors, uniqueStorageBins } = useMemo(() => {
    if (isLoading) return { uniqueKinds: [], uniqueVendors: [], uniqueStorageBins: [] };
    const kinds = [...new Set(paperRolls.map((roll) => roll.type).filter(Boolean))].sort();
    const vendors = [...new Set(paperRolls.map((roll) => roll.vendorName).filter(Boolean))].sort();
    const bins = [...new Set(paperRolls.map((roll) => roll.storageBin).filter(Boolean))].sort();
    return { uniqueKinds: kinds, uniqueVendors: vendors, uniqueStorageBins: bins };
  }, [paperRolls, isLoading]);

  const filteredRolls = useMemo(() => {
    return paperRolls.filter((roll) => {
      const searchMatch = partNoSearch
        ? roll.name.toLowerCase().includes(partNoSearch.toLowerCase())
        : true;
      const kindMatch =
        columnFilters.type.length > 0
          ? columnFilters.type.includes(roll.type)
          : true;
      const vendorMatch =
        columnFilters.vendorName.length > 0
          ? columnFilters.vendorName.includes(roll.vendorName)
          : true;
      const storageBinMatch =
        columnFilters.storageBin.length > 0
            ? columnFilters.storageBin.includes(roll.storageBin)
            : true;

      return searchMatch && kindMatch && vendorMatch && storageBinMatch;
    });
  }, [paperRolls, partNoSearch, columnFilters]);

  const handleFilterChange = (column: 'type' | 'vendorName' | 'storageBin') => (selection: string[]) => {
    setColumnFilters(prev => ({ ...prev, [column]: selection }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Stock</CardTitle>
        <CardDescription>
          Tampilan mendetail dari semua gulungan kertas dalam inventaris.
        </CardDescription>
        <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Cari berdasarkan Part No..."
                value={partNoSearch}
                onChange={(e) => setPartNoSearch(e.target.value)}
                className="pl-10 w-full md:w-1/3"
            />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Part No</TableHead>
                <TableHead>
                    <div className="flex items-center">
                        Kind
                         <FilterPopover 
                            title="Kind"
                            options={uniqueKinds}
                            selected={columnFilters.type}
                            onSelectionChange={handleFilterChange('type')}
                        />
                    </div>
                </TableHead>
                <TableHead>GR Date</TableHead>
                <TableHead>Gsm</TableHead>
                <TableHead>Width</TableHead>
                <TableHead className="text-right">Qty (Kg)</TableHead>
                <TableHead className="text-right">Roll-Cnt</TableHead>
                <TableHead>
                    <div className="flex items-center">
                        Storage Bin
                         <FilterPopover 
                            title="Storage Bin"
                            options={uniqueStorageBins}
                            selected={columnFilters.storageBin}
                            onSelectionChange={handleFilterChange('storageBin')}
                        />
                    </div>
                </TableHead>
                <TableHead>
                     <div className="flex items-center">
                        Vendor
                        <FilterPopover 
                            title="Vendor"
                            options={uniqueVendors}
                            selected={columnFilters.vendorName}
                            onSelectionChange={handleFilterChange('vendorName')}
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
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 float-right" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 float-right" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : filteredRolls.length > 0 ? (
                filteredRolls.map((roll: PaperRoll, index: number) => (
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
