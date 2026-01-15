'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { FileUp, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/context/inventory-context';
import * as XLSX from 'xlsx';
import type { PaperRoll } from '@/lib/types';
import { format, parse } from 'date-fns';

// Function to convert Excel serial date to JS Date
const excelDateToJSDate = (serial: number) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
};

const findColumn = (header: string[], possibleNames: string[]): string | undefined => {
  for (const name of possibleNames) {
    const found = header.find(h => h.toLowerCase().trim() === name.toLowerCase().trim());
    if (found) return found;
  }
  return undefined;
}


export function UploadDialog() {
  const { toast } = useToast();
  const { setPaperRolls } = useInventory();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadTemplate = () => {
    const headers = [
      'GR date',
      'Part No',
      'Kind',
      'Gsm',
      'Width',
      'SU No',
      'Qty',
      'Roll-Cnt',
      'storage Bin',
      'Aging',
      'Batch',
      'Diameter (Cm)',
      'Length',
      'Vendor Name',
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'inventory_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Tidak Ada File Terpilih',
        description: 'Silakan pilih file untuk diunggah.',
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            throw new Error("Tidak ada sheet yang ditemukan di dalam file.");
        }
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error('Sheet pertama tidak ditemukan atau kosong.');
        }
        const json: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: null });
        
        if (json.length === 0) {
            toast({
                variant: 'destructive',
                title: 'File Kosong',
                description: 'File yang diunggah tidak berisi data.',
            });
            setIsUploading(false);
            setFile(null);
            return;
        }

        const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
        if (!headerRow || !Array.isArray(headerRow)) {
            throw new Error("Header kolom tidak ditemukan.");
        }
        const header: string[] = headerRow.map(h => String(h));
        
        const keyMap = {
          id: findColumn(header, ['SU No', 'SU_No', 'SU-No', 'id']),
          name: findColumn(header, ['Part No', 'Part_No', 'Part-No', 'name']),
          type: findColumn(header, ['Kind', 'type']),
          grDate: findColumn(header, ['GR date', 'GR_date', 'GR-date', 'grDate']),
          gsm: findColumn(header, ['Gsm', 'gsm']),
          width: findColumn(header, ['Width', 'width']),
          quantity: findColumn(header, ['Qty', 'quantity']),
          rollCount: findColumn(header, ['Roll-Cnt', 'Roll Cnt', 'Roll_Cnt', 'rollCount']),
          storageBin: findColumn(header, ['storage Bin', 'Storage Bin', 'storage_bin', 'storageBin']),
          aging: findColumn(header, ['Aging', 'aging']),
          batch: findColumn(header, ['Batch', 'batch']),
          diameter: findColumn(header, ['Diameter (Cm)', 'Diameter', 'diameter']),
          length: findColumn(header, ['Length', 'length']),
          vendorName: findColumn(header, ['Vendor Name', 'Vendor_Name', 'vendorName']),
        };

        const newPaperRolls: PaperRoll[] = json.map((row: any, index: number) => {
          let grDateStr = 'N/A';
          const grDateValue = keyMap.grDate ? row[keyMap.grDate] : null;
          if (grDateValue) {
            if (grDateValue instanceof Date) {
              grDateStr = format(grDateValue, 'yyyy-MM-dd');
            } 
            else if (typeof grDateValue === 'number') {
              grDateStr = format(excelDateToJSDate(grDateValue), 'yyyy-MM-dd');
            }
            else if (typeof grDateValue === 'string') {
              try {
                 const parsedDate = parse(grDateValue, 'MM/dd/yy', new Date());
                 if(!isNaN(parsedDate.getTime())) {
                   grDateStr = format(parsedDate, 'yyyy-MM-dd');
                 } else {
                    const parsedDate2 = parse(grDateValue, 'dd-MM-yyyy', new Date());
                    if (!isNaN(parsedDate2.getTime())) {
                      grDateStr = format(parsedDate2, 'yyyy-MM-dd');
                    } else {
                      grDateStr = grDateValue;
                    }
                 }
              } catch (dateError) {
                console.warn(`Could not parse date for row ${index + 2}:`, grDateValue);
                grDateStr = String(grDateValue);
              }
            }
          }
          
          let idValue = keyMap.id ? row[keyMap.id] : null;

          // Robust ID generation
          if (idValue === null || String(idValue).trim() === '') {
             // Create a composite key if the primary ID is missing
             const compositeKey = Object.values(keyMap)
                .map(key => key ? row[key] : '')
                .join('-') + `-${index}`;
              idValue = compositeKey;
          }


          return {
            id: String(idValue),
            name: String((keyMap.name ? row[keyMap.name] : '') || `Part ${index + 1}`),
            type: String((keyMap.type ? row[keyMap.type] : '') || 'N/A'),
            grDate: grDateStr,
            gsm: Number(keyMap.gsm ? row[keyMap.gsm] : 0) || 0,
            width: Number(keyMap.width ? row[keyMap.width] : 0) || 0,
            quantity: Number(keyMap.quantity ? row[keyMap.quantity] : 0) || 0,
            rollCount: Number(keyMap.rollCount ? row[keyMap.rollCount] : 0) || 0,
            storageBin: String(keyMap.storageBin ? row[keyMap.storageBin] : 'N/A'),
            aging: Number(keyMap.aging ? row[keyMap.aging] : 0) || 0,
            batch: String((keyMap.batch ? row[keyMap.batch] : '') || 'N/A'),
            diameter: Number(keyMap.diameter ? row[keyMap.diameter] : 0) || 0,
            length: Number(keyMap.length ? row[keyMap.length] : 0) || 0,
            vendorName: String(keyMap.vendorName ? row[keyMap.vendorName] : 'N/A'),
            reorderLevel: 50, 
            lastUpdated: new Date().toISOString(),
          };
        });

        setPaperRolls(newPaperRolls);
        toast({
          title: 'Unggah Berhasil',
          description: `${newPaperRolls.length} item inventaris telah berhasil dimuat.`,
        });
        setIsOpen(false);
      } catch (error) {
        console.error("Gagal mem-parsing file:", error);
        toast({
          variant: 'destructive',
          title: 'Unggah Gagal',
          description: `Gagal mem-parsing file. Pastikan formatnya benar. Error: ${error instanceof Error ? error.message : String(error)}`,
        });
      } finally {
        setIsUploading(false);
        setFile(null);
      }
    };

    reader.onerror = () => {
        console.error("Gagal membaca file:", reader.error);
        toast({
            variant: 'destructive',
            title: 'Gagal Membaca File',
            description: 'Terjadi kesalahan saat membaca file.',
        });
        setIsUploading(false);
    }

    reader.readAsArrayBuffer(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <FileUp /> Unggah File
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unggah dan Kelola Data</DialogTitle>
          <DialogDescription>
            Unggah data inventaris Anda atau unduh template untuk memulai.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-4 rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">Unduh Template</h3>
                <p className="text-sm text-muted-foreground">
                  Dapatkan template CSV untuk data Anda.
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={handleDownloadTemplate}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="inventory-file">Unggah File Data</Label>
            <div className="flex items-center gap-2">
              <Input id="inventory-file" type="file" className="flex-grow" accept=".xlsx, .csv" onChange={handleFileChange} />
            </div>
            <p className="text-xs text-muted-foreground">
              Mendukung file .xlsx, .csv hingga 5MB.
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Mengunggah...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Unggah
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
