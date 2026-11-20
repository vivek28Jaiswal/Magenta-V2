import React from 'react';
import { CloudSlash, WarningOctagon, ArrowClockwise } from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function ErrorState({
  title = 'Connection or Server Error',
  message = 'Unable to communicate with the deterministic analysis engine. Please verify your connection or retry.',
  onRetry,
  type = 'card', // 'card' | 'banner' | 'page'
  className = '',
}) {
  if (type === 'banner') {
    return (
      <div className={`w-full bg-[#FF4124]/10 border border-[#FF4124]/20 rounded-[4px] p-3.5 flex items-center justify-between text-[14px] text-white ${className}`}>
        <div className="flex items-center space-x-2.5">
          <WarningOctagon className="w-4 h-4 text-[#FF4124] shrink-0" weight="regular" />
          <span className="font-medium text-stone-200">{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-1 font-semibold text-[#FF4124] hover:underline shrink-0 ml-3 cursor-pointer"
          >
            <ArrowClockwise className="w-4 h-4" weight="bold" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  const isPage = type === 'page';

  return (
    <Card className={`flex flex-col items-center justify-center text-center p-8 space-y-4 bg-[#141210] border border-white/10 rounded-[4px] ${
      isPage ? 'min-h-[50vh] w-full my-8' : 'w-full'
    } ${className}`}>
      <div className="w-12 h-12 rounded-[4px] bg-white/5 text-[#FF4124] border border-white/10 flex items-center justify-center">
        <CloudSlash className="w-6 h-6" weight="regular" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-[20px] font-bold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-[14px] text-stone-400 leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          icon={ArrowClockwise}
          className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20"
        >
          Retry Request
        </Button>
      )}
    </Card>
  );
}
