import * as React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-[4px] transition-all',
      variant === 'default' && 'bg-[#141210] text-stone-100 border border-white/10 shadow-sm hover:border-white/20',
      variant === 'neutral' && 'bg-[#121110] text-stone-100 border border-white/10',
      variant === 'nested' && 'bg-[#1A1816] text-stone-100 border border-white/10',
      variant === 'accent' && 'bg-[#141210] text-stone-100 border border-[#FF4124]/30',
      variant === 'orange' && 'bg-[#FF4124] text-white border border-[#FF4124]',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-5 sm:p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-[18px] sm:text-[20px] font-bold text-white tracking-tight leading-snug', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-[14px] text-stone-400 leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 sm:p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-5 sm:p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
