import { useEffect, useState } from 'react';

export default function AnimatedCounter({ value, duration = 900, format = (count) => count, className = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    let frame;
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(start + (target - start) * progress));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className={className}>{format(count)}</span>;
}
