import { Sunrise } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <Sunrise className="h-8 w-8" />
      <span className="text-xl font-headline font-bold">KIIA</span>
    </Link>
  );
}
