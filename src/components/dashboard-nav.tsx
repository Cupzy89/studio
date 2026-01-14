'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Warehouse,
  Truck,
  LineChart,
  FileUp,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { UploadDialog } from './upload-dialog';

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton href="/" isActive={pathname === '/'}>
          <LayoutDashboard /> Dasbor
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/inventory"
          isActive={pathname === '/inventory'}
        >
          <Warehouse /> Inventaris
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <Truck /> Pemasok
        </SidebarMenuButton>
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
