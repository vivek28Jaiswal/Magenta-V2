import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-[4px] border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white tracking-tight placeholder:text-stone-500 focus-visible:outline-none focus-visible:border-white/25 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
