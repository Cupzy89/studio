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

export function UploadDialog() {
  const { toast } = useToast();
  const { setPaperRolls } = useInventory();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            throw new Error("Tidak ada sheet yang ditemukan di dalam file.");
        }
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

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

        const newPaperRolls: PaperRoll[] = json.map((row: any, index: number) => {
          // Basic validation and mapping
          const name = row['Part No'] || `Gulungan Tanpa Nama ${index + 1}`;
          const type = row['Kind'] || 'Uncoated';
          const quantity = Number(row['Qty']) || 0;
          
          return {
            id: row['SU No'] || `R${String(index + 1).padStart(3, '0')}`,
            name,
            type,
            quantity,
            reorderLevel: 50, // Default value
            lastUpdated: new Date().toISOString(),
          };
        });

        setPaperRolls(newPaperRolls);
        toast({
          title: 'Unggah Berhasil',
          description: `${newPaperRolls.length} item inventaris telah berhasil dimuat.`,
        });
      } catch (error) {
        console.error("Gagal mem-parsing file:", error);
        toast({
          variant: 'destructive',
          title: 'Unggah Gagal',
          description: 'Gagal mem-parsing file. Pastikan formatnya benar.',
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
    <Dialog>
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
            <div>
              <p className="text-xs font-medium text-foreground">
                Buatkan template excel, didalamnya terdapat kolom, GR date, Part
                No, Kind, Gsm, Width, SU No, Qty, Roll-Cnt, storage Bin, Aging,
                Batch, Diameter (Cm), Length, Vendor Name
              </p>
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
