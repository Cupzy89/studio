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
  Sun,
  Moon,
  Languages,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import placeholderData from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { DashboardNav } from '@/components/dashboard-nav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { InventoryProvider } from '@/context/inventory-context';

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <InventoryProvider>
            <SidebarProvider>
              <Sidebar>
                <SidebarHeader>
                  <div className="flex items-center gap-2 p-2">
                    <Logo />
                    <h1 className="text-xl font-semibold text-primary">
                      RollView
                    </h1>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-5 w-5" />
                          <span className="sr-only">Pengaturan</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Pengaturan</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Languages className="mr-2 h-4 w-4" />
                            <span>Bahasa</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>Bahasa Indonesia</DropdownMenuItem>
                              <DropdownMenuItem>English</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span>Tema</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <ThemeToggle />
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>

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
          </InventoryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
