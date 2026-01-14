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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <FileUp /> Unggah File
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unggah dan Kelola Data</DialogTitle>
          <DialogDescription>
            Unggah data inventaris Anda atau unduh template untuk memulai.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">Unduh Template</h3>
              <p className="text-sm text-muted-foreground">
                Dapatkan template Excel yang diperlukan untuk data Anda.
              </p>
            </div>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
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
