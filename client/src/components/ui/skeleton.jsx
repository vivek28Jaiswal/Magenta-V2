import * as React from 'react';
import { cn } from '../../lib/utils';

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-[4px] bg-white/10', className)}
      {...props}
    />
  );
}

export { Skeleton };
