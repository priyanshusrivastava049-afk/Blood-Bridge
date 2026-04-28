import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  key?: React.Key;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-bg3/50 rounded-lg ${className}`}
      {...props}
    />
  );
}
