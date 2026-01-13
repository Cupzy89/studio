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
          <FileUp /> Upload File
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload and Manage Data</DialogTitle>
          <DialogDescription>
            Upload your inventory data or download the template to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-semibold">Download Template</h3>
              <p className="text-sm text-muted-foreground">
                Get the required Excel template for your data.
              </p>
            </div>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="inventory-file">Upload Data File</Label>
            <div className="flex items-center gap-2">
              <Input id="inventory-file" type="file" className="flex-grow" />
            </div>
             <p className="text-xs text-muted-foreground">
              Supports .xlsx, .csv files up to 5MB.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
