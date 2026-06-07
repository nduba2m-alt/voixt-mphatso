"use client";
import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate);
  const [tl, setTl] = useState<TimeLeft>(getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTl(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex gap-3 sm:gap-6 justify-center">
      {[
        { label: "Days", value: tl.days },
        { label: "Hours", value: tl.hours },
        { label: "Mins", value: tl.minutes },
        { label: "Secs", value: tl.seconds },
      ].map((unit) => (
        <div key={unit.label} className="text-center">
          <div
            className="font-display text-4xl sm:text-6xl leading-none"
            style={{ color: "#C9A84C", minWidth: "2ch", display: "inline-block" }}
          >
            {pad(unit.value)}
          </div>
          <div className="text-xs font-body mt-1 tracking-widest uppercase" style={{ color: "#9A8F78" }}>
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
