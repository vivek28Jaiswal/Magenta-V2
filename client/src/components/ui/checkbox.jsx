import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-[3px] border border-white/20 bg-white/5 ring-offset-[#0C0B0A] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4124] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#FF4124] data-[state=checked]:border-[#FF4124] data-[state=checked]:text-white transition-all cursor-pointer',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-3 w-3 stroke-[3]" weight="bold" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
