import React from 'react';
import { Loader2 } from "lucide-react";
import { useLoading } from '@/lib/LoadingContext';

export function GlobalLoadingIndicator() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-50">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
