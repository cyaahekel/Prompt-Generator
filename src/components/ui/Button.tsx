import React from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string;
}

export const Button = ({ children, className, variant = 'primary', ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-[#FFDE00] hover:bg-[#FFE500]',
    secondary: 'bg-[#00E0FF] hover:bg-[#33E7FF]',
    accent: 'bg-[#FF00F5] hover:bg-[#FF33F7]',
    danger: 'bg-[#FF4848] hover:bg-[#FF6B6B]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01, x: -1, y: -1 }}
      whileTap={{ scale: 0.99, x: 2, y: 2 }}
      className={cn(
        'relative px-6 py-3 font-black uppercase tracking-wider border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
