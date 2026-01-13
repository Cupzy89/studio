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
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/">
          <SidebarMenuButton isActive={pathname === '/'} asChild>
            <>
              <LayoutDashboard /> Dashboard
            </>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link href="/inventory">
          <SidebarMenuButton isActive={pathname === '/inventory'} asChild>
            <>
              <Warehouse /> Inventory
            </>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <>
            <Truck /> Suppliers
          </>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <>
            <LineChart /> Analysis
          </>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <>
            <FileUp /> Upload File
          </>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
