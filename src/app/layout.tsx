import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppLogo } from '@/components/shared/app-logo';
import { NavLinks } from '@/components/shared/nav-links';
import { EmotionalSOSButton } from '@/components/shared/emotional-sos-button';
import { Button } from '@/components/ui/button';
import { UserCircle, Settings, Bell } from 'lucide-react';
import { ParticlesBackground } from '@/components/ui/particles';
import { EmotionsGrid } from "@/components/ui/emotions-grid";

export const metadata: Metadata = {
  title: 'KIIA - Tu Faro Interior',
  description: 'Apoyo emocional y crecimiento personal con KIIA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="custom-scrollbar">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-gradient-to-br from-background to-background/95 min-h-screen">
        <ParticlesBackground />
        <SidebarProvider>
          <Sidebar collapsible="icon" className="glass border-r border-border/50 shadow-lg hover-glow">
            <SidebarHeader className="p-4 flex flex-col items-center group-data-[collapsible=icon]:items-center">
              <div className="hover-scale">
                <AppLogo />
              </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <NavLinks />
            </SidebarContent>
            <SidebarFooter className="p-4 mt-auto group-data-[collapsible=icon]:p-2">
              <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center hover-lift">
                <UserCircle className="h-5 w-5 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
                <span className="ml-2 group-data-[collapsible=icon]:hidden">Perfil</span>
              </Button>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between glass border-b px-6">
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
              <h1 className="text-xl font-headline font-semibold gradient-text hidden md:block">
                KIIA - Tu Faro Interior
              </h1>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="hover-lift">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover-lift">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </header>
            <main className="flex-1 p-6 overflow-auto animate-fadeInUp">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
        <EmotionalSOSButton />
        <Toaster />
      </body>
    </html>
  );
}
