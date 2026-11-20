import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { SpinnerGap } from '@phosphor-icons/react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] text-[14px] font-semibold tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4124] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#FF4124] text-white hover:bg-[#E0351B] border border-[#FF4124]',
        primary:
          'bg-[#FF4124] text-white hover:bg-[#E0351B] border border-[#FF4124]',
        secondary:
          'bg-white/10 text-white border border-white/15 hover:bg-white/20',
        white:
          'bg-white text-black hover:bg-stone-200 border border-white font-bold',
        'outline-white':
          'bg-white/10 text-white border border-white/30 hover:bg-white/20 font-medium',
        'ghost-white':
          'text-white/90 hover:text-white hover:bg-white/10 font-medium',
        outline:
          'bg-transparent border border-white/10 text-white hover:bg-white/5',
        ghost:
          'text-stone-400 hover:text-white hover:bg-white/5',
        destructive:
          'bg-[#FF4124]/15 text-[#FF4124] border border-[#FF4124]/30 hover:bg-[#FF4124]/25',
        soft:
          'bg-white/10 text-white border border-white/15 hover:bg-white/20',
        link:
          'text-[#FF4124] underline-offset-4 hover:underline p-0 h-auto font-medium',
      },
      size: {
        default: 'h-10 px-4 py-2 text-[14px] rounded-[4px]',
        xs: 'h-8 px-2.5 py-1 text-[13px] rounded-[4px] gap-1.5',
        sm: 'h-9 px-3.5 py-1.5 text-[14px] rounded-[4px] gap-1.5',
        md: 'h-10 px-4 py-2 text-[14px] rounded-[4px] gap-2',
        lg: 'h-11 px-5 py-2.5 text-[15px] rounded-[4px] gap-2.5',
        icon: 'h-10 w-10 p-0 rounded-[4px]',
        'icon-sm': 'h-8 w-8 p-0 rounded-[4px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, loading, icon: Icon, iconPosition = 'left', children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? (
          <SpinnerGap className="w-4 h-4 animate-spin text-current" />
        ) : Icon && iconPosition === 'left' ? (
          <Icon className="w-4 h-4 shrink-0 text-current" />
        ) : null}
        
        {children}

        {!loading && Icon && iconPosition === 'right' && (
          <Icon className="w-4 h-4 shrink-0 text-current" />
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
