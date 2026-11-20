import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { WarningCircle } from '@phosphor-icons/react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive', // 'destructive' | 'default'
  loading = false,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#141210] border border-white/15 rounded-[4px] text-stone-100">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0 ${
                variant === 'destructive'
                  ? 'bg-[#FF4124]/10 text-[#FF4124]'
                  : 'bg-white/10 text-white'
              }`}
            >
              <WarningCircle className="w-6 h-6" weight="regular" />
            </div>
            <div>
              <DialogTitle className="text-[18px] font-bold text-white">{title}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left text-stone-400 text-[14px] leading-relaxed">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-white/10">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="bg-white/10 border-white/15 text-white hover:bg-white/20 rounded-[4px]"
          >
            {cancelText}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onConfirm}
            loading={loading}
            className="rounded-[4px] bg-[#FF4124] text-white hover:bg-[#ff5a42]"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
