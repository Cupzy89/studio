import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Warehouse,
  Truck,
  LineChart,
  Settings,
  FileUp,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import placeholderData from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { DashboardNav } from '@/components/dashboard-nav';

export const metadata: Metadata = {
  title: 'RollView',
  description: 'Sebuah dasbor untuk mengelola inventaris gulungan kertas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userAvatar = placeholderData.placeholderImages.find(
    (p) => p.id === 'user-avatar'
  );
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2 p-2">
                <Logo />
                <h1 className="text-xl font-semibold text-primary">RollView</h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <DashboardNav />
            </SidebarContent>
          </Sidebar>

          <SidebarInset>
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
              <SidebarTrigger />
              <div className="ml-auto flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Pengaturan</span>
                </Button>
                <Avatar className="h-9 w-9">
                  {userAvatar && (
                    <AvatarImage
                      src={userAvatar.imageUrl}
                      data-ai-hint={userAvatar.imageHint}
                    />
                  )}
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </div>
            </header>

            <main className="flex-1 space-y-6 p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
