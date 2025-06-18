"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListChecks, MessageSquareHeart, TrendingUp, Zap, LibraryBig, SmilePlus } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/action-plan', label: 'Plan de Acción', icon: ListChecks },
  { href: '/kiia-chat', label: 'Habla con KIIA', icon: MessageSquareHeart },
  { href: '/progress', label: 'Mi Progreso', icon: TrendingUp },
  { href: '/boost', label: 'El Impulso', icon: Zap },
  { href: '/library', label: 'Biblioteca', icon: LibraryBig },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <SidebarMenuItem key={item.label}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={isActive}
                className={cn(
                  'w-full justify-start',
                  isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
                tooltip={{ children: item.label, side: "right", className: "font-body" }}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="font-body">{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
