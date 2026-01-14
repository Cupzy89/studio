'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { FileUp, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function UploadDialog() {
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
              <p className="text-sm font-medium text-foreground">
                Buatkan template excel, didalamnya terdapat kolom, GR date, Part No, Kind, Gsm, Width, SU No, Qty, Roll-Cnt, storage Bin, Aging, Batch, Diameter (Cm), Length, Vendor Name
              </p>
            </div>
          </div>

          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="inventory-file">Unggah File Data</Label>
            <div className="flex items-center gap-2">
              <Input id="inventory-file" type="file" className="flex-grow" />
            </div>
            <p className="text-xs text-muted-foreground">
              Mendukung file .xlsx, .csv hingga 5MB.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            <Upload className="mr-2 h-4 w-4" />
            Unggah
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
