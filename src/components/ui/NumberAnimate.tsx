import React, { useEffect, useState } from 'react';

export const NumberAnimate = ({ value, duration = 1000 }: { value: string | number, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const target = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

  useEffect(() => {
    if (isNaN(target)) return;
    
    let start = displayValue;
    const end = target;
    const range = end - start;
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current = Math.floor(progress * range + start);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [target]);

  if (isNaN(target)) return <span>{value}</span>;

  return <span>{displayValue.toLocaleString()}</span>;
};
