import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-0.5 text-[12px] font-semibold tracking-tight leading-none whitespace-nowrap transition-colors focus:outline-none focus:ring-1 focus:ring-[#FF4124]',
  {
    variants: {
      variant: {
        default:
          'bg-white/5 text-stone-200 border border-white/10',
        secondary:
          'bg-white/10 text-white border border-white/15',
        brand:
          'bg-[#FF4124]/10 text-[#FF4124] border border-[#FF4124]/30 font-bold',
        verified:
          'bg-white/10 text-stone-200 border border-white/20 font-mono',
        mandatory:
          'bg-[#FF4124]/10 text-[#FF4124] border border-[#FF4124]/30 font-mono',
        preferred:
          'bg-white/5 text-stone-300 border border-white/10 font-mono',
        unclear:
          'bg-white/5 text-stone-400 border border-white/10 font-mono',
        partial:
          'bg-white/5 text-stone-400 border border-white/10 font-mono',
        missing:
          'bg-[#FF4124]/10 text-[#FF4124] border border-[#FF4124]/30 font-mono',
        contradiction:
          'bg-[#FF4124]/10 text-[#FF4124] border border-[#FF4124]/30 font-bold font-mono',
        remote:
          'bg-white/5 text-stone-300 border border-white/10 font-mono',
        hybrid:
          'bg-white/5 text-stone-300 border border-white/10 font-mono',
        'on-site':
          'bg-white/5 text-stone-300 border border-white/10 font-mono',
        outline:
          'bg-transparent text-stone-400 border border-white/10',
        white:
          'bg-white text-stone-900 border border-white font-bold shadow-2xs',
        'outline-white':
          'bg-white/10 text-white border border-white/20 font-medium',
      },
      size: {
        default: 'px-2.5 py-1 text-[12px]',
        xs: 'px-2 py-0.5 text-[11px] rounded-[4px]',
        sm: 'px-2.5 py-1 text-[12px]',
        md: 'px-3 py-1.5 text-[13px]',
      },
      pill: {
        true: 'rounded-[4px]',
        false: 'rounded-[4px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      pill: false,
    },
  }
);

function Badge({ className, variant, size, pill, ...props }) {
  return (
    <div
      className={cn(badgeVariants({ variant, size, pill, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
