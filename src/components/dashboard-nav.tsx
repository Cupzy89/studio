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
              <Warehouse /> Inventory
            </span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <span className="flex w-full items-center gap-2">
            <Truck /> Suppliers
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <span className="flex w-full items-center gap-2">
            <LineChart /> Analysis
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <span className="flex w-full items-center gap-2">
            <FileUp /> Upload File
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
