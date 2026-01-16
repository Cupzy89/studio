'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
import { AuthMenu } from '@/components/auth-menu';

const publicPaths = ['/login', '/signup'];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return; // Wait for user session to be determined

    const isPublicPath = publicPaths.includes(pathname);

    // Redirect unauthenticated users from private pages to login
    if (!user && !isPublicPath) {
      router.push('/login');
    }

    // Redirect authenticated users from public pages (login/signup) to dashboard
    if (user && isPublicPath) {
      router.push('/');
    }
  }, [user, isUserLoading, pathname, router]);

  // Show a full page loader while session is loading, to avoid flicker
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const isPublicPath = publicPaths.includes(pathname);

  // If user is not authenticated and on a public path, show the page (e.g. Login/Signup)
  if (!user && isPublicPath) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        {children}
      </div>
    );
  }

  // If user is not authenticated on a private route, they will be redirected,
  // but we can show a loader to prevent content flicker.
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // User is authenticated, show the full layout.
  return (
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
            <AuthMenu />
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
