import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Compass, House, ArrowLeft } from '@phosphor-icons/react';

export default function NotFoundPage() {
  return (
    <Card className="w-full min-h-[50vh] flex flex-col items-center justify-center text-center p-8 space-y-4 bg-[#141210] border border-white/10 rounded-[4px]">
      <div className="w-14 h-14 rounded-[4px] bg-white/5 border border-white/10 text-white flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8" weight="regular" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <span className="font-mono text-[12px] font-bold text-[#FF4124] tracking-widest uppercase">
          404 Error • Page Not Located
        </span>
        <h1 className="text-[28px] font-bold text-white tracking-tight">
          Lost in Navigation
        </h1>
        <p className="text-[14px] text-stone-400 leading-relaxed">
          The requested workbench view or resource does not exist in the deterministic index.
        </p>
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <Link to="/dashboard">
          <Button variant="default" size="sm" icon={House} className="rounded-[4px]">
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" size="sm" icon={ArrowLeft} className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20">
            Homepage
          </Button>
        </Link>
      </div>
    </Card>
  );
}
