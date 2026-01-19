'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Warehouse,
  Layers,
  LineChart,
  FileUp,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { UploadDialog } from './upload-dialog';
import Link from 'next/link';

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/">
          <SidebarMenuButton isActive={pathname === '/'} asChild>
            <span className="flex w-full items-center gap-2">
              <LayoutDashboard /> Dashboard
            </span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link href="/inventory">
          <SidebarMenuButton isActive={pathname === '/inventory'} asChild>
            <span className="flex w-full items-center gap-2">
              <Layers /> Inventaris per Jenis
            </span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <LineChart /> Analisis
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <UploadDialog />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
