import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { DashboardNav } from '@/components/dashboard-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { InventoryProvider } from '@/context/inventory-context';
import { FirebaseClientProvider } from '@/firebase';
import { AuthMenu } from '@/components/auth-menu';

export const metadata: Metadata = {
  title: 'RollView',
  description: 'Sebuah dasbor untuk mengelola inventaris gulungan kertas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <FirebaseClientProvider>
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
                      <AuthMenu />
                    </div>
                  </header>

                  <main className="flex-1 space-y-6 p-4 sm:p-6">{children}</main>
                </SidebarInset>
              </SidebarProvider>
            </InventoryProvider>
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
