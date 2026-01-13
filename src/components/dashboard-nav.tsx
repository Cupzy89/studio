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

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/"
          isActive={pathname === '/'}
        >
          <LayoutDashboard /> Dashboard
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          href="/inventory"
          isActive={pathname === '/inventory'}
        >
          <Warehouse /> Inventory
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
            <Truck /> Suppliers
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
            <LineChart /> Analysis
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
            <FileUp /> Upload File
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
