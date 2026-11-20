import * as React from 'react';
import { cn } from '../../lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[90px] w-full rounded-[4px] border border-white/10 bg-white/5 px-3.5 py-3 text-xs sm:text-sm text-white tracking-tight placeholder:text-stone-500 focus-visible:outline-none focus-visible:border-white/25 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans leading-relaxed resize-none',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
