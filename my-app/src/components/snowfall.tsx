"use client";

import React, { useState, useEffect } from "react";
import { Snowflake } from "lucide-react";

type SnowflakeType = {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
};

function makeSnowflakes(count = 30): SnowflakeType[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 10 + 10}s`,
    size: Math.random() * 20 + 10,
  }));
}

export function Snowfall() {
  // Defer generating random snowflakes until after mount to avoid SSR/client hydration mismatches
  const [snowflakes, setSnowflakes] = useState<SnowflakeType[]>([]);
  useEffect(() => {
    const id = window.setTimeout(() => setSnowflakes(makeSnowflakes(30)), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {snowflakes.map((flake: SnowflakeType) => (
        <React.Fragment key={flake.id}>
          <style jsx>{`
            .flake-${flake.id} {
              left: ${flake.left};
              animation-delay: ${flake.delay};
              animation-duration: ${flake.duration};
            }
          `}</style>
          <div
            className={`absolute -top-10 animate-snow snowflake flake-${flake.id}`}
          >
            <Snowflake size={flake.size} className="text-white/40 " />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
