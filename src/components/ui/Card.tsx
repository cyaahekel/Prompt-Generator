import React from 'react';
import { cn } from '@/src/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-zinc-800 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
