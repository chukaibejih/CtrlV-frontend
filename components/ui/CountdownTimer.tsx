// components/ui/CountdownTimer.tsx
"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set launch date to March 6, 2025 00:00:00
    const launchDate = new Date('2025-03-06T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        // Launch day has arrived
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Display a "Launched!" message if all values are 0
  const hasLaunched = 
    timeLeft.days === 0 && 
    timeLeft.hours === 0 && 
    timeLeft.minutes === 0 && 
    timeLeft.seconds === 0;

  return (
    <div className="flex flex-col items-center justify-center py-6 border border-zinc-700 rounded-lg bg-zinc-800/50 backdrop-blur-sm">
      {hasLaunched ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-500 mb-2">We've Launched!</h2>
          <p className="text-zinc-300">Start sharing your code now</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-3 text-zinc-200">Launching In</h2>
          <div className="flex gap-4 text-center">
            <div className="flex flex-col">
              <div className="text-4xl font-bold w-16 h-16 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-emerald-400">
                {timeLeft.days}
              </div>
              <span className="text-sm text-zinc-400 mt-2">Days</span>
            </div>
            <div className="flex flex-col">
              <div className="text-4xl font-bold w-16 h-16 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-emerald-400">
                {timeLeft.hours}
              </div>
              <span className="text-sm text-zinc-400 mt-2">Hours</span>
            </div>
            <div className="flex flex-col">
              <div className="text-4xl font-bold w-16 h-16 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-emerald-400">
                {timeLeft.minutes}
              </div>
              <span className="text-sm text-zinc-400 mt-2">Minutes</span>
            </div>
            <div className="flex flex-col">
              <div className="text-4xl font-bold w-16 h-16 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-emerald-400">
                {timeLeft.seconds}
              </div>
              <span className="text-sm text-zinc-400 mt-2">Seconds</span>
            </div>
          </div>
          <p className="mt-6 text-zinc-400 text-sm">Code sharing at the speed of paste</p>
        </>
      )}
    </div>
  );
}