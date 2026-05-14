import React from 'react';
import { cn } from '@/src/lib/utils';

export const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <span className={cn(
      "px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-tighter border-2 border-black",
      className
    )}>
      {children}
    </span>
  );
};
