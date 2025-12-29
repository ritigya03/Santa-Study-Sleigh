import React from "react";

export default function BadgeCard({ title }: { title?: string }) {
  return (
    <div className="rounded border p-3">
      <div className="text-sm font-semibold">{title ?? "Badge"}</div>
    </div>
  );
}
